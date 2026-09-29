// Server only: stores each exchange in `chat_sessions/{sessionId}` so the owner can read it on
// /admin/ai-chats and the widget can reload the conversation. Messages live in the `messages`
// subcollection ({ role, text, timestamp }); the session document keeps a summary for the list.
import admin from "firebase-admin";
import { getAdminDb } from "@/lib/firebase-admin";
import type { LeadAttempt } from "./shared";

const SESSION_ID = /^[A-Za-z0-9_-]{8,128}$/;

/**
 * Visitors get a random id; signed-in users use `session_<uid>`, which only that user may read.
 * Those are only written when the request proves it comes from that user.
 */
export function canLogSession(sessionId: unknown, verifiedUid?: string | null): sessionId is string {
    if (typeof sessionId !== "string" || !SESSION_ID.test(sessionId)) return false;
    if (sessionId.startsWith("session_")) return !!verifiedUid && sessionId === `session_${verifiedUid}`;
    return true;
}

interface ChatTurnLog {
    sessionId: string;
    userMessage: string;
    reply: string;
    /** When the visitor's message arrived (ms) */
    receivedAt: number;
    model: string;
    visitorName?: string;
    userId?: string | null;
    lead?: LeadAttempt | null;
}

export async function logChatTurn(entry: ChatTurnLog): Promise<void> {
    try {
        const db = getAdminDb();
        const { FieldValue, Timestamp } = admin.firestore;
        const ref = db.collection("chat_sessions").doc(entry.sessionId);
        const existing = await ref.get();
        const repliedAt = Math.max(Date.now(), entry.receivedAt + 1);

        const batch = db.batch();
        batch.set(
            ref,
            {
                lastMessageAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
                preview: entry.userMessage.slice(0, 160),
                lastModel: entry.model,
                ...(existing.exists ? {} : { startedAt: Timestamp.fromMillis(entry.receivedAt) }),
                ...(entry.userId ? { userId: entry.userId } : {}),
                ...(entry.visitorName ? { userContext: { name: entry.visitorName } } : {}),
                ...(entry.lead?.saved
                    ? { lead: { name: entry.lead.name, phone: entry.lead.phone, service: entry.lead.service || null }, leadCapturedAt: FieldValue.serverTimestamp() }
                    : {}),
            },
            { merge: true }
        );
        const messages = ref.collection("messages");
        batch.set(messages.doc(), { role: "user", text: entry.userMessage, timestamp: Timestamp.fromMillis(entry.receivedAt) });
        batch.set(messages.doc(), { role: "model", text: entry.reply, timestamp: Timestamp.fromMillis(repliedAt) });
        await batch.commit();
    } catch (error) {
        console.error("[assistant] Session log failed:", error);
    }
}
