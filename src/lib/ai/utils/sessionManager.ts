import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function logSession(sid: string, msg: string, resp: string) {
    try {
        const docRef = doc(db, "chat_sessions", sid);
        const snap = await getDoc(docRef);
        let messages: any[] = snap.exists() ? (snap.data().messages || []) : [];
        
        messages.push({ role: 'user', text: msg, timestamp: new Date() });
        messages.push({ role: 'model', text: resp, timestamp: new Date() });
        
        // Limit to 100 messages to prevent document size exhaustion (1MB max)
        if (messages.length > 100) messages = messages.slice(messages.length - 100);

        await setDoc(docRef, {
            lastMessageAt: serverTimestamp(),
            messages
        }, { merge: true });
    } catch (e) {
        console.error("Session Log Error:", e);
    }
}
