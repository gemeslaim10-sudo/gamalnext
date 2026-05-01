import { doc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function logSession(sid: string, msg: string, resp: string) {
    try {
        const sessionRef = doc(db, "chat_sessions", sid);
        
        // Update the main session document with the last activity time
        await setDoc(sessionRef, {
            lastMessageAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }, { merge: true });

        const messagesRef = collection(sessionRef, "messages");
        
        // Add user message
        await addDoc(messagesRef, {
            role: 'user',
            text: msg,
            timestamp: serverTimestamp()
        });

        // Add model response
        await addDoc(messagesRef, {
            role: 'model',
            text: resp,
            timestamp: serverTimestamp()
        });
        
    } catch (e) {
        console.error("Session Log Error:", e);
    }
}
