import { setDoc, collection, serverTimestamp, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function handleLeadCapture(text: string, userId?: string, sessionId?: string): Promise<boolean | null> {
    console.log("Checking for lead data in response...");
    
    // 1. Try to find the tag with a lenient regex
    const match = text.match(/\[*LEAD_DATA\s*:\s*([\s\S]*?)(?:\]\]|\](?!\w))/i);
    
    if (match?.[1]) {
        try {
            // Clean up the string just in case there are markdown blocks around the JSON
            let jsonString = match[1].trim();
            if (jsonString.startsWith('\`\`\`json')) jsonString = jsonString.replace(/^\`\`\`json\s*/, '');
            if (jsonString.startsWith('\`\`\`')) jsonString = jsonString.replace(/^\`\`\`\s*/, '');
            if (jsonString.endsWith('\`\`\`')) jsonString = jsonString.replace(/\s*\`\`\`$/, '');
            
            console.log("Extracted Lead JSON:", jsonString);
            
            const data = JSON.parse(jsonString);
            console.log("Parsed Lead Data Successfully:", data);
            
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
            
            console.log("Lead successfully UPSERTED in Firestore 'leads' collection!");
            return true;
        } catch (e) {
            console.error("Lead Capture Error - JSON Parse or Firestore Failed:", e, "Raw string was:", match[1]);
            return false;
        }
    } else {
        console.log("No LEAD_DATA tag found in the response.");
        return null;
    }
}
