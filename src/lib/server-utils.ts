import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, query, limit, orderBy, QueryConstraint, OrderByDirection } from "firebase/firestore";

// Helper to fetch single document data for SSR
export async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as T;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching document ${collectionName}/${docId}:`, error);
        return null;
    }
}

// Helper to fetch collection data for SSR
export async function getCollection<T>(
    collectionName: string,
    options?: { limitCount?: number; orderByField?: string; orderDirection?: OrderByDirection }
): Promise<T[]> {
    try {
        const colRef = collection(db, collectionName);
        const constraints: QueryConstraint[] = [];
        
        if (options?.orderByField) {
            constraints.push(orderBy(options.orderByField, options.orderDirection || "asc"));
        }
        if (options?.limitCount) {
            constraints.push(limit(options.limitCount));
        }

        const q = constraints.length > 0 ? query(colRef, ...constraints) : colRef;
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
        console.error(`Error fetching collection ${collectionName}:`, error);
        return [];
    }
}
