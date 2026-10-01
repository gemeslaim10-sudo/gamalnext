import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { parseDate } from "../utils";
import type { FeedItem } from "../types";
import { isPublicArticle } from "@/lib/content/shared";
import { markdownExcerpt } from "@/lib/articles/plainText";
import { articlePath } from "@/lib/articles/paths";

export async function fetchArticlesFeed(allFeed: FeedItem[]) {
    try {
        const articlesQ = query(collection(db, "articles"), orderBy("createdAt", "desc"));
        const articlesSnap = await getDocs(articlesQ);
        articlesSnap.docs.forEach(docSnap => {
            const data = docSnap.data();
            // Articles waiting for review stay out (no status = published before moderation existed)
            if (!isPublicArticle(data)) return;
            const createdAt = parseDate(data.createdAt);
            allFeed.push({
                id: docSnap.id,
                type: "article",
                title: data.title || "Untitled Article",
                // The text is Markdown, so the feed shows the summary (or a plain start) and links to
                // the article page, which renders it; the full text isn't sent with the feed
                description: data.summary || markdownExcerpt(String(data.content || ""), 150),
                imageUrl: data.media?.[0]?.url || null,
                gallery: Array.isArray(data.media) ? (data.media as Array<{ url: string }>).map(m => m.url) : null,
                mediaType: data.media?.[0]?.type || "image",
                link: articlePath({ id: docSnap.id, slug: data.slug }),
                createdAt,
                rankAt: createdAt,
            });
        });
    } catch (err) {
        console.error("Feed: Failed to fetch articles", err);
        // A feed missing its articles must not be cached
        throw err;
    }
}
