"use client";

import { useState, useEffect } from "react";
import { loadFirestore } from "@/lib/firebase-app";

/**
 * Hook to subscribe to a Firestore document.
 * Returns the document data if it exists, otherwise returns defaultData.
 * With `enabled: false` it only returns `defaultData` (e.g. the server already sent the content).
 */
export function useContent<T>(collectionName: string, docId: string, defaultData?: T, enabled = true) {
    const [data, setData] = useState<T | undefined>(defaultData);
    const [loading, setLoading] = useState(enabled);

    useEffect(() => {
        if (!enabled) return undefined;
        let unsubscribe: (() => void) | undefined;
        let cancelled = false;
        // The database library loads only when this fallback is actually needed
        loadFirestore()
            .then(({ db, doc, onSnapshot }) => {
                if (cancelled) return;
                unsubscribe = onSnapshot(
                    doc(db, collectionName, docId),
                    (docSnapshot) => {
                        // A missing document keeps the default data
                        setData(docSnapshot.exists() ? (docSnapshot.data() as T) : defaultData);
                        setLoading(false);
                    },
                    (error) => {
                        // The caller shows its fallback content, so visitors get a page instead of an error message
                        console.error(`Error fetching ${collectionName}/${docId}:`, error);
                        setLoading(false);
                    }
                );
            })
            .catch((error: unknown) => {
                console.error(`Error loading ${collectionName}/${docId}:`, error);
                setLoading(false);
            });

        return () => {
            cancelled = true;
            unsubscribe?.();
        };
    }, [collectionName, docId, defaultData, enabled]);

    return { data, loading };
}
