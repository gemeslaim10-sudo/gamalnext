// Firebase app + Auth only. Kept apart from Firestore (src/lib/firebase.ts) so pages that only need
// sign-in state don't download the database library, the biggest one on the site.
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (Singleton pattern)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

/**
 * Loads Firestore only when something actually reads or writes (a like, a comment, sign-up…):
 * `const { db, doc, setDoc } = await loadFirestore();`
 */
export async function loadFirestore() {
    const [firestore, { db }] = await Promise.all([import("firebase/firestore"), import("@/lib/firebase")]);
    return { ...firestore, db };
}
