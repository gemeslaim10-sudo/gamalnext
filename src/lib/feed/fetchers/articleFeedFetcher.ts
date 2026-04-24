import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { parseDate } from "../utils";
import type { FeedItem } from "../types";

export async function fetchArticlesFeed(allFeed: FeedItem[]) {
    try {
        const articlesQ = query(collection(db, "articles"), orderBy("createdAt", "desc"));
        const articlesSnap = await getDocs(articlesQ);
        articlesSnap.docs.forEach(docSnap => {
            const data = docSnap.data();
            allFeed.push({
                id: docSnap.id,
                type: "article",
                title: data.title || "Untitled Article",
                description: data.summary || (data.content ? (data.content as string).substring(0, 150) + "..." : ""),
                fullContent: data.content || data.summary || "",
                imageUrl: data.media?.[0]?.url || null,
                gallery: Array.isArray(data.media) ? (data.media as Array<{ url: string }>).map(m => m.url) : null,
                mediaType: data.media?.[0]?.type || "image",
                link: `/articles/${docSnap.id}`,
                createdAt: parseDate(data.createdAt),
            });
        });
    } catch (err) {
        console.error("Feed: Failed to fetch articles", err);
    }
}
