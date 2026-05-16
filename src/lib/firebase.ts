import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Debug logging only in development
if (process.env.NODE_ENV === 'development') {
    console.log("🔥 Firebase Config:", firebaseConfig.projectId ? "Loaded" : "MISSING");
}


// Initialize Firebase (Singleton pattern)

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Analytics: lazy singleton pattern to avoid async export race condition.
// Consumers should use: const analytics = await getAnalyticsInstance();
let _analyticsInstance: Analytics | null = null;
let _analyticsPromise: Promise<Analytics | null> | null = null;

function getAnalyticsInstance(): Promise<Analytics | null> {
    if (typeof window === "undefined") {
        return Promise.resolve(null);
    }

    if (_analyticsInstance) {
        return Promise.resolve(_analyticsInstance);
    }

    if (!_analyticsPromise) {
        _analyticsPromise = isSupported()
            .then((yes) => {
                if (yes) {
                    _analyticsInstance = getAnalytics(app);
                    return _analyticsInstance;
                }
                return null;
            })
            .catch((err) => {
                console.warn("Firebase Analytics initialization failed:", err);
                return null;
            });
    }

    return _analyticsPromise;
}

export { app, auth, db, getAnalyticsInstance };
