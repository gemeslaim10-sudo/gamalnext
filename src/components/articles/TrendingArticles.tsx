import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TrendingArticlesClient from "./TrendingArticlesClient";
import type { ArticleSerialized, ArticleRaw } from "@/types";
import { getTimestampMs } from "@/types";

export const revalidate = 3600; // Revalidate every hour

async function getTrendingArticles(): Promise<ArticleSerialized[]> {
    try {
        const q = query(
            collection(db, "articles"),
            orderBy("createdAt", "desc"),
            limit(6) // Increased limit for slider
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => {
            const data = d.data() as Omit<ArticleRaw, 'id'>;
            return {
                id: d.id,
                ...data,
                // Serialize all timestamps
                createdAt: getTimestampMs(data.createdAt) || Date.now(),
                updatedAt: getTimestampMs(data.updatedAt) || null
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
