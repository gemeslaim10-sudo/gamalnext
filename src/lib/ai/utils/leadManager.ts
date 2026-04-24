import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function handleLeadCapture(text: string, userId?: string) {
    const match = text.match(/\[\[LEAD_DATA:({[\s\S]*?})\]\]/);
    if (match?.[1]) {
        try {
            const data = JSON.parse(match[1]);
            await addDoc(collection(db, "leads"), { 
                ...data, 
                capturedAt: serverTimestamp(), 
                userId: userId || "Anonymous" 
            });
        } catch (e) {
            console.error("Lead Capture Error:", e);
        }
    }
}
