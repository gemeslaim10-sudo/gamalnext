import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TrendingArticlesClient from "./TrendingArticlesClient";

export const revalidate = 3600; // Revalidate every hour

type Article = {
    id: string;
    title: string;
    summary?: string;
    content?: string;
    media: { url: string; type: 'image' | 'video' }[];
    createdAt: any;
}

async function getTrendingArticles(): Promise<any[]> {
    try {
        const q = query(
            collection(db, "articles"),
            orderBy("createdAt", "desc"),
            limit(6) // Increased limit for slider
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => {
            const data = d.data();
            return {
                id: d.id,
                ...data,
                // Serialize all timestamps
                createdAt: data.createdAt?.seconds ? data.createdAt.seconds * 1000 : Date.now(),
                updatedAt: data.updatedAt?.seconds ? data.updatedAt.seconds * 1000 : null
            };
        });
    } catch (e) {
        console.error("Error fetching trending articles:", e);
        return [];
    }
}

export default async function TrendingArticles() {
    const articles = await getTrendingArticles();
    return <TrendingArticlesClient articles={articles} />;
}
