import type { FirebaseTimestamp } from "@/types";

/** `chat_sessions/{id}` — a summary written by the assistant after every exchange. */
export interface ChatSessionSummary {
    id: string;
    userId?: string;
    /** The visitor's latest message */
    preview?: string;
    lastMessageAt?: FirebaseTimestamp;
    startedAt?: FirebaseTimestamp;
    lastModel?: string;
    userContext?: { name?: string; phone?: string };
    /** Set when the assistant saved the visitor as a lead */
    lead?: { name?: string; phone?: string; service?: string | null };
}

/** `chat_sessions/{id}/messages/{messageId}` */
export interface ChatLogMessage {
    id: string;
    role: "user" | "model";
    text: string;
    timestamp: FirebaseTimestamp;
}

export function sessionName(session: ChatSessionSummary): string {
    const leadName = session.lead?.name;
    if (leadName && leadName !== "Chat visitor") return leadName;
    return session.userContext?.name || "Visitor";
}

export function sessionPhone(session: ChatSessionSummary): string | undefined {
    return session.lead?.phone || session.userContext?.phone || undefined;
}
