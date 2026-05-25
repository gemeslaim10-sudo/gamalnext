import admin from "firebase-admin";

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Replace escaped newlines with actual newline characters
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            }),
        });
    } catch (error) {
        console.error("Firebase Admin initialization failed:", error);
    }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

export async function verifyAuthUser(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        throw new Error("Unauthorized: Missing authorization header");
    }
    const token = authHeader.substring(7);
    try {
        return await adminAuth.verifyIdToken(token);
    } catch {
        throw new Error("Unauthorized: Invalid token");
    }
}
