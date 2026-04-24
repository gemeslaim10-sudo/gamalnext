import { NextResponse } from "next/server";
import { 
    STATIC_TOOLS, 
    FeedItem, 
    fetchArticlesFeed, 
    fetchProjectsFeed, 
    fetchUserPostsFeed 
} from "@/lib/feed/feedHelpers";

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

    // Sort by date descending
    allFeed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Paginate
    const paginatedFeed = allFeed.slice(offset, offset + pageSize);
    const hasMore = offset + pageSize < allFeed.length;

    return NextResponse.json({ items: paginatedFeed, hasMore });
}
