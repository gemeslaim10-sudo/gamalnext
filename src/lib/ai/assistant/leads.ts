// Server only: the `save_lead` tool the model calls once it has a visitor's name and phone.
// Leads go through saveLead() like every other form on the site (source: "chat").
// Backup models without tool support use a <lead>{…}</lead> tag instead, parsed and removed here.
import { getAdminDb } from "@/lib/firebase-admin";
import { saveLead } from "@/lib/leads/server";
import { LEAD_LIMITS, normalizePhone, validateLead } from "@/lib/leads/schema";
import { isRealName, type LeadAttempt } from "./shared";

export interface ToolSpec {
    name: string;
    description: string;
    /** JSON Schema (lower-case types); converted for Gemini by the provider */
    parameters: {
        type: "object";
        properties: Record<string, { type: "string"; description: string }>;
        required: string[];
    };
}

export const SAVE_LEAD_TOOL: ToolSpec = {
    name: "save_lead",
    description:
        "Save the visitor's contact details so the owner can follow up. Call it once you know BOTH the visitor's name and phone/WhatsApp number and they are interested in a service or want to be contacted. Never call it with a made-up or incomplete number.",
    parameters: {
        type: "object",
        properties: {
            name: { type: "string", description: "The visitor's name as they wrote it" },
            phone: { type: "string", description: "Phone or WhatsApp number exactly as the visitor wrote it, including the country code if given" },
            service: { type: "string", description: "The service they are interested in, in a few words (e.g. 'ERP system', 'Shopify store')" },
            message: { type: "string", description: "One or two sentences summarizing what they need, in the conversation's language" },
        },
        required: ["name", "phone"],
    },
};

export type ToolResult = Record<string, unknown>;

/** Name stored when a visitor leaves a number before their name. */
const UNKNOWN_NAME = "Chat visitor";
/** Descriptions models sometimes put in the name field instead of a name. */
const PLACEHOLDER_NAME = /unknown|not (?:given|provided)|n\/a|anonymous|visitor|غير معروف|مجهول|بدون اسم|لم يذكر|زائر|عميل مهتم/i;
export type ToolExecutor = (name: string, args: Record<string, unknown>) => Promise<ToolResult>;

interface LeadContext {
    /** In test mode nothing is written — the details are only validated and reported */
    test: boolean;
    sessionId?: string | null;
    userId?: string | null;
    userEmail?: string | null;
    page?: string | null;
    /** The owner's own numbers are never saved as a lead (e.g. a visitor asking "is this your number?") */
    isOwnerPhone?: (phone: string) => boolean;
}

/** One per request: runs the tool and remembers the last attempt for logging and debug output. */
export function createLeadRecorder(ctx: LeadContext) {
    let last: LeadAttempt | null = null;

    async function record(args: Record<string, unknown>, via: LeadAttempt["via"]): Promise<ToolResult> {
        const givenName = asText(args.name).slice(0, LEAD_LIMITS.nameMax);
        // A phone number is never dropped: without a real name it's saved as "Chat visitor" and the
        // model asks for the name, then calls again (same phone = same lead, so the name is updated).
        const nameKnown = isRealName(givenName) && !PLACEHOLDER_NAME.test(givenName);
        const input = {
            name: nameKnown ? givenName : UNKNOWN_NAME,
            phone: asText(args.phone),
            service: asText(args.service).slice(0, LEAD_LIMITS.serviceMax) || undefined,
            message: asText(args.message).slice(0, LEAD_LIMITS.messageMax) || undefined,
        };

        const errors: Record<string, string> = { ...validateLead(input) };
        if (!errors.phone && ctx.isOwnerPhone?.(input.phone)) {
            errors.phone = "That is the owner's own number, not the visitor's. Don't save it; ask for the visitor's number only if they want to be contacted.";
        }
        if (Object.keys(errors).length > 0) {
            last = { ...input, saved: false, errors, via };
            return { ok: false, errors };
        }

        const followUp = nameKnown ? {} : { next: "The number is saved, but the name is missing: ask for their name once, then call save_lead again with it." };

        if (ctx.test) {
            last = { ...input, saved: false, via };
            return { ok: true, note: "Test mode: the details are valid but were not stored.", ...followUp };
        }

        try {
            if (!nameKnown) {
                // Without a name, don't overwrite a lead that already has one (same phone = same document)
                const existing = await getAdminDb().collection("leads").doc(normalizePhone(input.phone).replace(/\D/g, "")).get();
                const existingName = existing.exists ? String(existing.data()?.name || "") : "";
                if (existingName && existingName !== UNKNOWN_NAME) {
                    last = { ...input, name: existingName, saved: true, via };
                    return { ok: true, message: `Already saved as ${existingName}. The owner will follow up soon.` };
                }
            }
            const result = await saveLead(
                { ...input, source: "chat", page: ctx.page || undefined },
                { userId: ctx.userId ?? null, userEmail: ctx.userEmail ?? null, sessionId: ctx.sessionId ?? null }
            );
            if (!result.ok) {
                last = { ...input, saved: false, errors: result.errors, via };
                return { ok: false, errors: result.errors };
            }
            last = { ...input, saved: true, via };
            return { ok: true, message: "Saved. The owner will follow up soon.", ...followUp };
        } catch (error) {
            console.error("[assistant] saveLead failed:", error);
            last = { ...input, saved: false, errors: { server: "Could not save right now" }, via };
            return { ok: false, error: "Could not save the details right now. Share the WhatsApp link instead." };
        }
    }

    const execute: ToolExecutor = async (name, args) => {
        if (name === SAVE_LEAD_TOOL.name) return record(args, "tool");
        return { ok: false, error: `Unknown tool: ${name}` };
    };

    return {
        execute,
        /** Handles a <lead> tag written by a model without tool support */
        fromTag: (args: Record<string, unknown>) => record(args, "tag"),
        get last() {
            return last;
        },
    };
}

// ── Text-tag fallback ─────────────────────────────────────────────────────────

const LEAD_TAG = /<lead>\s*([\s\S]*?)\s*<\/lead>/i;

/** Returns the lead JSON inside a <lead> tag, if there is a valid one. */
export function parseLeadTag(text: string): Record<string, unknown> | null {
    const match = text.match(LEAD_TAG);
    if (!match) return null;
    const raw = match[1].replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
    try {
        const data = JSON.parse(raw);
        return data && typeof data === "object" && !Array.isArray(data) ? (data as Record<string, unknown>) : null;
    } catch {
        return null;
    }
}

/** Removes lead tags (even broken, unclosed ones) and model reasoning blocks from a reply. */
export function cleanReply(text: string): string {
    return text
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .replace(/<lead>[\s\S]*?(<\/lead>|$)/gi, "")
        .trim();
}

function asText(value: unknown): string {
    return typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "";
}
