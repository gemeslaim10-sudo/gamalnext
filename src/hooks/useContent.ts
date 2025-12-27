"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Hook to subscribe to a Firestore document.
 * Returns the document data if it exists, otherwise returns defaultData.
 */
export function useContent<T>(collectionName: string, docId: string, defaultData?: T) {
    const [data, setData] = useState<T | undefined>(defaultData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If we're on the server or db isn't ready (though it initializes sync), be safe
        const unsubscribe = onSnapshot(doc(db, collectionName, docId), (docSnapshot) => {
            if (docSnapshot.exists()) {
                setData(docSnapshot.data() as T);
            } else {
                // Doc doesn't exist, keep default data
                setData(defaultData);
            }
            setLoading(false);
        }, (error) => {
            console.error(`Error fetching ${collectionName}/${docId}:`, error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [collectionName, docId, defaultData]);

    return { data, loading };
}
