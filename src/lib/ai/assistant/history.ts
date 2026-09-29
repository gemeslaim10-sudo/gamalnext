// Cleans the conversation the browser sends before it reaches a model.

export interface ChatTurn {
    role: "user" | "model";
    text: string;
}

export const MESSAGE_MAX_CHARS = 2_000;
const TURN_MAX_CHARS = 4_000;
const HISTORY_MAX_TURNS = 24;
const HISTORY_MAX_CHARS = 16_000;

/**
 * Accepts the widget format (`{ role, parts: [{ text }] }`) and plain `{ role, text }` /
 * `{ role, content }` objects. Keeps the most recent turns within a size budget, merges
 * consecutive messages from the same side and makes sure the history starts with the visitor.
 */
export function normalizeHistory(raw: unknown): ChatTurn[] {
    if (!Array.isArray(raw)) return [];

    const turns: ChatTurn[] = [];
    for (const item of raw) {
        if (!item || typeof item !== "object") continue;
        const m = item as Record<string, unknown>;
        if (m.isError === true) continue;
        const role = m.role === "model" || m.role === "assistant" ? "model" : m.role === "user" ? "user" : null;
        if (!role) continue;
        const text = stripLegacyTags(extractText(m)).trim().slice(0, TURN_MAX_CHARS);
        if (!text) continue;
        const last = turns[turns.length - 1];
        if (last && last.role === role) last.text = `${last.text}\n${text}`.slice(0, TURN_MAX_CHARS);
        else turns.push({ role, text });
    }

    // Keep the newest turns that fit the budget
    const kept: ChatTurn[] = [];
    let chars = 0;
    for (let i = turns.length - 1; i >= 0 && kept.length < HISTORY_MAX_TURNS; i--) {
        chars += turns[i].text.length;
        if (chars > HISTORY_MAX_CHARS && kept.length > 0) break;
        kept.unshift(turns[i]);
    }

    while (kept.length > 0 && kept[0].role === "model") kept.shift();
    return kept;
}

/**
 * The history sent to a model must end with a model turn. Visitor messages that never got a
 * reply (e.g. the previous request failed) are kept by prepending them to the new message.
 */
export function withPendingMessage(turns: ChatTurn[], message: string): { history: ChatTurn[]; message: string } {
    const history = [...turns];
    const pending: string[] = [];
    while (history.length > 0 && history[history.length - 1].role === "user") {
        pending.unshift(history.pop()!.text);
    }
    return { history, message: [...pending, message].join("\n") };
}

/** Hidden markers from older assistant versions, still present in saved chats. */
export function stripLegacyTags(text: string): string {
    return text.replace(/\[\[LEAD_DATA[\s\S]*?(\]\]|$)/gi, "").replace(/<lead>[\s\S]*?(<\/lead>|$)/gi, "");
}

function extractText(m: Record<string, unknown>): string {
    if (typeof m.text === "string") return m.text;
    if (typeof m.content === "string") return m.content;
    if (Array.isArray(m.parts)) {
        return m.parts
            .map((p) => (p && typeof p === "object" && typeof (p as { text?: unknown }).text === "string" ? (p as { text: string }).text : ""))
            .join("\n");
    }
    return "";
}
