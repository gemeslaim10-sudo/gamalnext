// Server only — the home page feed (projects, published articles, approved posts), ranked once and
// kept in the no-expiry cache. Publishing, editing or deleting any of them refreshes it.
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CACHE_TAGS, cached, readOrFallback } from "@/lib/cache";
import { fetchArticlesFeed, fetchProjectsFeed, fetchUserPostsFeed, type FeedItem } from "./feedHelpers";

export const FEED_PAGE_SIZE = 5;

const MS_PER_DAY = 1000 * 60 * 60 * 24;
/** Engagement only counts for recent items; older ones rank by age alone. */
const ENGAGEMENT_WINDOW_DAYS = 14;

async function engagement(item: FeedItem, now: number) {
    const ageInDays = (now - new Date(item.rankAt).getTime()) / MS_PER_DAY;
    if (ageInDays > ENGAGEMENT_WINDOW_DAYS) return 0;
    try {
        const [likes, comments] = await Promise.all([
            getCountFromServer(query(collection(db, "likes"), where("articleId", "==", item.id))),
            getCountFromServer(query(collection(db, "comments"), where("articleId", "==", item.id))),
        ]);
        return likes.data().count + comments.data().count;
    } catch {
        return 0;
    }
}

/**
 * Everything in the feed, best first: newer items score higher, and likes/comments buy extra time
 * (−10 points per day of age, +2 per interaction).
 */
async function buildRankedFeed(): Promise<FeedItem[]> {
    const items: FeedItem[] = [];
    await Promise.all([fetchArticlesFeed(items), fetchProjectsFeed(items), fetchUserPostsFeed(items)]);

    const now = Date.now();
    const scores = await Promise.all(items.map((item) => engagement(item, now)));
    const weight = (item: FeedItem, index: number) => -((now - new Date(item.rankAt).getTime()) / MS_PER_DAY) * 10 + scores[index] * 2;

    return items
        .map((item, index) => ({ item, weight: weight(item, index) }))
        .sort((a, b) => b.weight - a.weight)
        .map(({ item }) => item);
}

const readRankedFeed = cached(buildRankedFeed, "feed", [CACHE_TAGS.feed, CACHE_TAGS.projects, CACHE_TAGS.articles, CACHE_TAGS.posts]);

export interface FeedPage {
    items: FeedItem[];
    hasMore: boolean;
}

/** One page of the feed (1-based), or null when it couldn't be read. */
export async function getFeedPage(page: number): Promise<FeedPage | null> {
    const all = await readOrFallback("feed", readRankedFeed, null);
    if (!all) return null;
    const offset = (Math.max(1, Math.floor(page)) - 1) * FEED_PAGE_SIZE;
    return { items: all.slice(offset, offset + FEED_PAGE_SIZE), hasMore: offset + FEED_PAGE_SIZE < all.length };
}
