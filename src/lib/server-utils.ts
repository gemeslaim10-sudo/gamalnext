import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

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
export async function getCollection<T>(collectionName: string): Promise<T[]> {
    try {
        const colRef = collection(db, collectionName);
        const snapshot = await getDocs(colRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
        console.error(`Error fetching collection ${collectionName}:`, error);
        return [];
    }
}
