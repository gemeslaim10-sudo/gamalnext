import { setDoc, serverTimestamp, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const isDev = process.env.NODE_ENV === 'development';

export async function handleLeadCapture(text: string, userId?: string, sessionId?: string): Promise<boolean | null> {
    // 1. Try to find the tag with a lenient regex
    const match = text.match(/\[*LEAD_DATA\s*:\s*([\s\S]*?)(?:\]\]|\](?!\w))/i);
    
    if (match?.[1]) {
        try {
            // Clean up the string just in case there are markdown blocks around the JSON
            let jsonString = match[1].trim();
            if (jsonString.startsWith('\`\`\`json')) jsonString = jsonString.replace(/^\`\`\`json\s*/, '');
            if (jsonString.startsWith('\`\`\`')) jsonString = jsonString.replace(/^\`\`\`\s*/, '');
            if (jsonString.endsWith('\`\`\`')) jsonString = jsonString.replace(/\s*\`\`\`$/, '');
            
            const data = JSON.parse(jsonString);
            if (isDev) console.log("Parsed Lead Data:", data);
            
            // We CANNOT use getDocs(q) here because the client SDK is restricted by firestore.rules
            // which prevents non-admins from READING the leads collection.
            // Instead, we use the sanitized phone number as the Document ID, and use setDoc with merge: true.
            // This performs an "Upsert" (Update if exists, Create if not) without needing to read the database!
            
            const sanitizedPhone = data.phone.replace(/[^0-9+]/g, '');
            if (!sanitizedPhone) throw new Error("Invalid phone number format");

            const docRef = doc(db, "leads", sanitizedPhone);
            await setDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp(),
                userId: userId || "Anonymous",
                sessionId: sessionId || null
            }, { merge: true });
            
            return true;
        } catch (e) {
            console.error("Lead Capture Error:", e);
            return false;
        }
    }
    return null;
}

