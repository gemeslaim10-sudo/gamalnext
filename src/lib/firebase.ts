import { getFirestore } from "firebase/firestore";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { app, auth } from "./firebase-app";

// Browser code that only needs sign-in should import from "@/lib/firebase-app" instead: this
// module pulls in Firestore. Server code (cached reads) uses it freely.
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
