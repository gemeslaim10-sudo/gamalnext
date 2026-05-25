import { adminDb } from "@/lib/firebase-admin";
import admin from "firebase-admin";

export async function logSession(sid: string, msg: string, resp: string) {
    try {
        const sessionRef = adminDb.collection("chat_sessions").doc(sid);
        
        // Update the main session document with the last activity time
        await sessionRef.set({
            lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        const messagesRef = sessionRef.collection("messages");
        
        // Add user message
        await messagesRef.add({
            role: 'user',
            text: msg,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        // Add model response
        await messagesRef.add({
            role: 'model',
            text: resp,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        
    } catch (e) {
        console.error("Session Log Error:", e);
    }
}
