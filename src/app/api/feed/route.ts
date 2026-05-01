import { NextResponse } from "next/server";
import { 
    STATIC_TOOLS, 
    FeedItem, 
    fetchArticlesFeed, 
    fetchProjectsFeed, 
    fetchUserPostsFeed 
} from "@/lib/feed/feedHelpers";

import { collection, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    const allFeed: FeedItem[] = [...STATIC_TOOLS];

    await Promise.all([
        fetchArticlesFeed(allFeed),
        fetchProjectsFeed(allFeed),
        fetchUserPostsFeed(allFeed)
    ]);

    // Fetch interaction counts for sorting
    await Promise.all(allFeed.map(async (item) => {
        try {
            const [likesSnap, commentsSnap] = await Promise.all([
                getCountFromServer(query(collection(db, "likes"), where("articleId", "==", item.id))),
                getCountFromServer(query(collection(db, "comments"), where("articleId", "==", item.id)))
            ]);
            // @ts-expect-error: Temporary field for sorting
            item.interactionScore = likesSnap.data().count + commentsSnap.data().count;
        } catch {
            // @ts-expect-error: Temporary field for sorting
            item.interactionScore = 0;
        }
    }));

    // Sort by interactionScore descending, then by date descending
    allFeed.sort((a, b) => {
        // @ts-expect-error: Temporary field for sorting
        const scoreDiff = (b.interactionScore || 0) - (a.interactionScore || 0);
        if (scoreDiff !== 0) return scoreDiff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Paginate
    const paginatedFeed = allFeed.slice(offset, offset + pageSize);
    const hasMore = offset + pageSize < allFeed.length;

    return NextResponse.json({ items: paginatedFeed, hasMore });
}
