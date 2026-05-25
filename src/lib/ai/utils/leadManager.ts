import { getAdminDb } from "@/lib/firebase-admin";
import admin from "firebase-admin";

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
            
            // We use the Firebase Admin SDK to write the lead document, which bypasses all security rules.
            // This allows guest users and API routes on the server to record leads securely.
            
            const sanitizedPhone = data.phone.replace(/[^0-9+]/g, '');
            if (!sanitizedPhone) throw new Error("Invalid phone number format");

            const docRef = getAdminDb().collection("leads").doc(sanitizedPhone);
            await docRef.set({
                ...data,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
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

