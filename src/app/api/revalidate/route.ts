import { NextResponse, after } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminDb, verifyAuthUser } from "@/lib/firebase-admin";
import { ALLOWED_ADMINS } from "@/lib/constants";
import { CACHE_TAGS, isCacheTag, type CacheTag } from "@/lib/cache-tags";
import { submitToIndexNow } from "@/lib/seo/indexnow";

export const dynamic = "force-dynamic";

// Refreshes are immediate: the next visitor gets the new content, never the old copy
const EXPIRE_NOW = { expire: 0 };

// Members may refresh their own content a few times a minute (per server instance)
const MEMBER_LIMIT = 10;
const MEMBER_WINDOW_MS = 60_000;
const memberRequests = new Map<string, number[]>();

function withinMemberLimit(uid: string) {
    const now = Date.now();
    const recent = (memberRequests.get(uid) ?? []).filter((time) => now - time < MEMBER_WINDOW_MS);
    if (recent.length >= MEMBER_LIMIT) return false;
    recent.push(now);
    memberRequests.set(uid, recent);
    return true;
}

function expire(tags: Iterable<CacheTag>) {
    for (const tag of new Set(tags)) revalidateTag(tag, EXPIRE_NOW);
}

/**
 * Site content is cached with no time limit (src/lib/cache.ts); this is the only way to refresh it.
 * Body (all optional):
 * - `tags`: refresh just this content (admins). No tags and no ids = refresh everything ("Clear cache").
 * - `articleId` / `postId`: an article or post that was just created, edited or deleted. Admins may
 *   pass any; members only their own.
 * - `memberId`: a member saved or deleted their profile (their page at /users/…). Members may pass
 *   only their own id.
 */
export async function POST(req: Request) {
    let user;
    try {
        user = await verifyAuthUser(req);
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as { tags?: unknown; articleId?: unknown; postId?: unknown; memberId?: unknown };
    const isAdmin = Boolean(user.email && ALLOWED_ADMINS.includes(user.email));
    const articleId = typeof body.articleId === "string" ? body.articleId.trim() : "";
    const postId = typeof body.postId === "string" ? body.postId.trim() : "";
    const memberId = typeof body.memberId === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(body.memberId) ? body.memberId : "";
    const tags = Array.isArray(body.tags) ? body.tags.filter(isCacheTag) : [];

    if (memberId) {
        if (!isAdmin) {
            if (memberId !== user.uid) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            if (!withinMemberLimit(user.uid)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }
        expire([CACHE_TAGS.members]);
        revalidatePath(`/users/${memberId}`);
        return NextResponse.json({ ok: true, refreshed: "member" });
    }

    if (!articleId && !postId) {
        if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        if (tags.length > 0) {
            expire(tags);
            return NextResponse.json({ ok: true, refreshed: tags });
        }
        // Everything: all cached reads, and every page built from them
        expire([CACHE_TAGS.all]);
        revalidatePath("/", "layout");
        return NextResponse.json({ ok: true, refreshed: "all" });
    }

    if (!isAdmin) {
        if (!withinMemberLimit(user.uid)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        const [collectionName, id, ownerField] = articleId ? ["articles", articleId, "authorId"] : ["posts", postId, "userId"];
        const snap = await getAdminDb().collection(collectionName).doc(id).get();
        // A deleted document can't be checked any more; refreshing is harmless, so that's allowed (rate limited)
        if (snap.exists && snap.get(ownerField) !== user.uid) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
    }

    expire([articleId ? CACHE_TAGS.articles : CACHE_TAGS.posts, CACHE_TAGS.feed]);
    if (articleId) {
        revalidatePath(`/articles/${articleId}`);
        // Let Bing & co. know right away (live site only); runs after the response is sent
        after(() => submitToIndexNow([`/articles/${articleId}`, "/articles"]));
    }
    return NextResponse.json({ ok: true, refreshed: articleId ? "article" : "post" });
}
