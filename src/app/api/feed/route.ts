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

    // Sort by a blended score of Recency + Engagement
    // Posts lose score as they age, but gain score from likes/comments
    const NOW = Date.now();
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    allFeed.sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        
        // Calculate age in days (how old is the post?)
        const ageInDaysA = (NOW - timeA) / MS_PER_DAY;
        const ageInDaysB = (NOW - timeB) / MS_PER_DAY;

        // @ts-expect-error: Temporary field for sorting
        const scoreA = a.interactionScore || 0;
        // @ts-expect-error: Temporary field for sorting
        const scoreB = b.interactionScore || 0;

        // Formula: Time weight + Engagement weight
        // Newer posts get a high baseline score that decays over time.
        // Engagement adds bonus points to combat the decay.
        // E.g., 1 interaction = 2 hours of "youth"
        
        // Let's use a simple penalty: -10 points per day old, +2 points per interaction
        // Starting score is normalized to 0 for "right now"
        const weightA = -(ageInDaysA * 10) + (scoreA * 2);
        const weightB = -(ageInDaysB * 10) + (scoreB * 2);

        // Sort descending (highest weight first)
        return weightB - weightA;
    });

    // Paginate
    const paginatedFeed = allFeed.slice(offset, offset + pageSize);
    const hasMore = offset + pageSize < allFeed.length;

    return NextResponse.json({ items: paginatedFeed, hasMore });
}
