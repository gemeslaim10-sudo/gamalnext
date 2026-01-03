import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ReviewsClient from "./ReviewsClient";

type Review = {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: any;
}

async function getReviews() {
    try {
        const q = query(
            collection(db, "reviews"),
            where("status", "==", "approved"),
            orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Serialize timestamps if needed, though they pass fine to client components in Server Actions usually, 
            // but for props passing we might need simple JSON types or ensure the client handles the detailed object.
            // For safety with Firestore timestamps passing to Client Component:
            createdAt: doc.data().createdAt?.seconds ? doc.data().createdAt.seconds * 1000 : Date.now()
        } as Review));
    } catch (e) {
        console.error("Error fetching reviews:", e);
        return [];
    }
}

export default async function Reviews() {
    const reviews = await getReviews();
    return <ReviewsClient reviews={reviews} />;
}
