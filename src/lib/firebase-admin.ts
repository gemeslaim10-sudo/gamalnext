import admin from "firebase-admin";

function initFirebaseAdmin() {
    if (admin.apps.length) return;

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
        console.warn("Firebase Admin credentials are not fully set in environment variables. Initialization skipped.");
        return;
    }

    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey: privateKey.replace(/\\n/g, "\n"),
            }),
        });
    } catch (error) {
        console.error("Firebase Admin initialization failed:", error);
    }
}

export const getAdminDb = () => {
    initFirebaseAdmin();
    return admin.firestore();
};

export const getAdminAuth = () => {
    initFirebaseAdmin();
    return admin.auth();
};

export async function verifyAuthUser(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        throw new Error("Unauthorized: Missing authorization header");
    }
    const token = authHeader.substring(7);
    try {
        const auth = getAdminAuth();
        return await auth.verifyIdToken(token);
    } catch {
        throw new Error("Unauthorized: Invalid token");
    }
}
