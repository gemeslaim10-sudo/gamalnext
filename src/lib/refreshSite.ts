import { auth } from "@/lib/firebase-app";
import type { CacheTag } from "@/lib/cache-tags";

export interface RefreshOptions {
    /** Refresh only this content. Leave out to refresh everything (the dashboard's "Clear cache"). */
    tags?: CacheTag[];
    /** An article a signed-in member just created, edited or deleted (members may refresh only their own) */
    articleId?: string;
    /** A post a signed-in member just edited or deleted */
    postId?: string;
    /** The signed-in member saved or deleted their profile (their page at /users/…) */
    memberId?: string;
}

/**
 * Site content is cached with no time limit, so anything that changes what visitors see must call
 * this afterwards: dashboard saves (admins, any content) and members changing their own articles,
 * posts or profile. Resolves to false when the refresh didn't happen; content then updates on the
 * next "Clear cache".
 */
export async function refreshSite(options: RefreshOptions = {}) {
    try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return false;
        const res = await fetch("/api/revalidate", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(options),
        });
        return res.ok;
    } catch (error) {
        console.error("Site refresh failed:", error);
        return false;
    }
}
