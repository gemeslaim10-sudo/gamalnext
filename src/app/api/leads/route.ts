import { NextResponse } from "next/server";
import { verifyAuthUser } from "@/lib/firebase-admin";
import { validateLead, type LeadInput, type LeadSource } from "@/lib/leads/schema";
import { saveLead } from "@/lib/leads/server";

export const dynamic = "force-dynamic";

const SOURCES: readonly LeadSource[] = ["popup", "contact", "pricing", "services", "chat", "other"];
const MAX_BODY_CHARS = 10_000;
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

// Request times per IP. Kept in memory, so it resets on deploy and isn't shared between server
// instances: a light guard against someone hammering the form, not a hard limit.
const recentRequests = new Map<string, number[]>();

function clientIp(req: Request) {
    return req.headers.get("x-real-ip")?.trim() || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
}

function isRateLimited(ip: string) {
    const now = Date.now();
    const recent = (recentRequests.get(ip) ?? []).filter((time) => now - time < RATE_LIMIT.windowMs);
    const limited = recent.length >= RATE_LIMIT.max;
    if (!limited) recent.push(now);
    recentRequests.set(ip, recent);

    // Forget idle visitors so the map can't grow forever
    if (recentRequests.size > 1000) {
        for (const [key, times] of recentRequests) {
            if (times.every((time) => now - time >= RATE_LIMIT.windowMs)) recentRequests.delete(key);
        }
    }
    return limited;
}

const text = (value: unknown) => (typeof value === "string" ? value : "");

function json(body: Record<string, unknown>, status = 200) {
    return NextResponse.json(body, { status });
}

/**
 * Saves a visitor's name + phone as a lead (popup, contact form, pricing).
 * Body: { name, phone, service?, message?, source, page?, company? } — `company` is a honeypot.
 * Response: { ok: true, isNew } or { ok: false, errors | error }.
 */
export async function POST(req: Request) {
    // Without an IP every visitor would share one bucket, so the limit is skipped rather than blocking real leads
    const ip = clientIp(req);
    if (ip && isRateLimited(ip)) {
        return json({ ok: false, error: "Too many requests. Please try again in a few minutes." }, 429);
    }

    // JSON only: browsers can't send that cross-site without a CORS preflight, which this route doesn't allow
    if (!req.headers.get("content-type")?.toLowerCase().includes("application/json")) {
        return json({ ok: false, error: "Expected a JSON body." }, 415);
    }

    let body: Record<string, unknown>;
    try {
        const raw = await req.text();
        if (raw.length > MAX_BODY_CHARS) return json({ ok: false, error: "Request is too large." }, 413);
        const parsed: unknown = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Body must be an object");
        body = parsed as Record<string, unknown>;
    } catch {
        return json({ ok: false, error: "Invalid request body." }, 400);
    }

    // Honeypot: people never see this field, bots fill it in. Pretend it worked and save nothing.
    if (text(body.company).trim()) {
        return json({ ok: true });
    }

    const page = text(body.page).trim();
    const lead: LeadInput = {
        name: text(body.name),
        phone: text(body.phone),
        service: text(body.service).trim() || undefined,
        message: text(body.message).trim() || undefined,
        source: SOURCES.find((source) => source === body.source) ?? "other",
        page: page.startsWith("/") ? page.slice(0, 200) : undefined,
    };

    const errors = validateLead(lead);
    if (Object.keys(errors).length > 0) {
        return json({ ok: false, errors }, 400);
    }

    // Signed-in visitors: link the lead to their account. Login is never required.
    let userId: string | null = null;
    let userEmail: string | null = null;
    if (req.headers.get("authorization")?.startsWith("Bearer ")) {
        try {
            const user = await verifyAuthUser(req);
            userId = user.uid;
            userEmail = user.email ?? null;
        } catch {
            // Expired or invalid token: save the lead as a guest
        }
    }

    try {
        const result = await saveLead(lead, { userId, userEmail });
        if (!result.ok) return json({ ok: false, errors: result.errors }, 400);
        return json({ ok: true, isNew: result.isNew });
    } catch (error) {
        console.error("Saving lead failed:", error);
        return json({ ok: false, error: "Your details couldn't be saved right now." }, 500);
    }
}
