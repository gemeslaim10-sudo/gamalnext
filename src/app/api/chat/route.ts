import { after, NextResponse } from "next/server";
import type { DecodedIdToken } from "firebase-admin/auth";
import { verifyAuthUser } from "@/lib/firebase-admin";
import { ALLOWED_ADMINS } from "@/lib/constants";
import { AssistantUnavailableError, MESSAGE_MAX_CHARS, runAssistant, type VisitorInfo } from "@/lib/ai/assistant";
import { getPublicChatConfig } from "@/lib/ai/assistant/settings";
import { canLogSession, logChatTurn } from "@/lib/ai/assistant/session";
import { allowRequest, rateLimitKey } from "@/lib/ai/assistant/rateLimit";
import { isRealName } from "@/lib/ai/assistant/shared";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Public widget texts (name, subtitle, placeholder, welcome). Never includes keys or instructions. */
export async function GET() {
    const config = await getPublicChatConfig();
    return NextResponse.json(config, {
        headers: { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300" },
    });
}

/**
 * Body: { message, history, userContext?, sessionId?, page?, test? } → { response }
 * `test: true` is admin-only (Firebase ID token in `Authorization: Bearer …`): nothing is saved,
 * and the reply comes with debug info (model used, knowledge cards, prompt).
 */
export async function POST(req: Request) {
    const receivedAt = Date.now();

    let body: Record<string, unknown>;
    try {
        body = (await req.json()) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!message) return NextResponse.json({ error: "Message is required." }, { status: 400 });
    if (message.length > MESSAGE_MAX_CHARS) return NextResponse.json({ error: "Message is too long." }, { status: 400 });

    const test = body.test === true;
    let authUser: DecodedIdToken | null = null;
    if (req.headers.get("authorization")) {
        try {
            authUser = await verifyAuthUser(req);
        } catch {
            if (test) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }
    }

    if (test) {
        if (!authUser) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        if (!ALLOWED_ADMINS.includes(authUser.email || "")) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    } else if (!allowRequest(rateLimitKey(req))) {
        return NextResponse.json({ error: "Too many messages. Please wait a minute and try again." }, { status: 429 });
    }

    const visitor = readVisitor(body.userContext, body.page, authUser);
    const sessionId = !test && canLogSession(body.sessionId, authUser?.uid) ? body.sessionId : null;

    try {
        const result = await runAssistant({
            message,
            history: body.history,
            visitor,
            sessionId,
            userId: authUser?.uid ?? null,
            userEmail: authUser?.email ?? null,
            test,
            // The test page can try another Gemini model before saving it
            model: test && typeof body.model === "string" && /^[\w.-]{3,80}$/.test(body.model) ? body.model : undefined,
        });

        if (sessionId) {
            // Saved after the response is sent, so the visitor doesn't wait for it
            after(() =>
                logChatTurn({
                    sessionId,
                    userMessage: message,
                    reply: result.reply,
                    receivedAt,
                    model: result.model,
                    visitorName: visitor.name,
                    userId: authUser?.uid ?? null,
                    lead: result.lead,
                })
            );
        }

        return NextResponse.json(test ? { response: result.reply, debug: result.debug } : { response: result.reply });
    } catch (error) {
        if (error instanceof AssistantUnavailableError) {
            console.error("[assistant] All providers failed:", error.attempts);
            return NextResponse.json(
                { error: "The assistant is unavailable right now.", ...(test ? { debug: { attempts: error.attempts } } : {}) },
                { status: 503 }
            );
        }
        console.error("[assistant] Unexpected error:", error);
        return NextResponse.json({ error: "The assistant is unavailable right now." }, { status: 500 });
    }
}

/** Only small, cleaned pieces of client data reach the prompt. */
function readVisitor(rawContext: unknown, rawPage: unknown, authUser: DecodedIdToken | null): VisitorInfo {
    const context = rawContext && typeof rawContext === "object" ? (rawContext as Record<string, unknown>) : {};
    const clean = (value: unknown, max: number) =>
        typeof value === "string"
            ? Array.from(value)
                  .filter((ch) => ch >= " ")
                  .join("")
                  .replace(/[<>{}[\]"`]/g, " ")
                  .replace(/\s+/g, " ")
                  .trim()
                  .slice(0, max)
            : "";

    const contextName = clean(context.name, 60);
    const tokenName = clean(authUser?.name, 60);
    const name = isRealName(contextName) ? contextName : isRealName(tokenName) ? tokenName : undefined;

    const phone = clean(context.phone, 24);
    const page = typeof rawPage === "string" && /^\/(?!\/)[^\s?#]{0,200}$/.test(rawPage.split(/[?#]/)[0]) ? rawPage.split(/[?#]/)[0] : undefined;

    return {
        name,
        phone: /^\+?[\d\s-]{7,20}$/.test(phone) ? phone : undefined,
        page,
    };
}
