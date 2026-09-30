// Server only — the public side of a member's account, for their page at /users/[id].
//
// Member documents are private (they hold the email): only the member and the admins can read
// them (firestore.rules). The page reads them here with the Admin SDK, and only the fields meant
// to be public ever reach the browser.
import { getAdminDb } from "@/lib/firebase-admin";
import { CACHE_TAGS, cached, readOrFallback } from "@/lib/cache";
import { getPublicArticles } from "@/lib/content/server";
import { markdownExcerpt } from "@/lib/articles/plainText";
import { getTimestampMs } from "@/lib/utils/timestamp";
import type { FirebaseTimestamp } from "@/types";
import type { ArticleCardData } from "@/components/articles/ArticleCard";

export interface PublicMember {
    name: string;
    photoURL?: string;
    bio?: string;
    location?: string;
    jobTitle?: string;
    socialStatus?: string;
    /** Sign-up date in ms; null when unknown */
    joinedAt: number | null;
}

// Firebase account ids; anything else can't be a member
const MEMBER_ID = /^[A-Za-z0-9_-]{1,128}$/;

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const optional = (value: unknown, max: number) => text(value, max) || undefined;

// Cached until the member saves their profile (or the dashboard clears the cache)
const readMember = cached(
    async (id: string): Promise<PublicMember | null> => {
        const snap = await getAdminDb().collection("users").doc(id).get();
        if (!snap.exists) return null;
        const data = snap.data() ?? {};
        return {
            name: text(data.name, 80),
            photoURL: optional(data.photoURL, 1000),
            bio: optional(data.bio, 2000),
            location: optional(data.location, 120),
            jobTitle: optional(data.jobTitle, 120),
            socialStatus: optional(data.socialStatus, 60),
            joinedAt: getTimestampMs(data.createdAt as FirebaseTimestamp | undefined) || null,
        };
    },
    "member",
    [CACHE_TAGS.members]
);

/** A member's public profile, or null when there's no such member (or it couldn't be read). */
export async function getPublicMember(id: string): Promise<PublicMember | null> {
    if (!MEMBER_ID.test(id)) return null;
    return readOrFallback(`member ${id}`, () => readMember(id), null);
}

/** The member's published articles, newest first — from the cached article list, so no extra reads. */
export async function getMemberArticles(id: string): Promise<ArticleCardData[]> {
    const articles = (await getPublicArticles()) ?? [];
    return articles
        .filter((article) => article.authorId === id)
        .map((article) => ({
            id: article.id,
            title: article.title,
            // The card shows the summary, else the plain start of the (Markdown) text
            summary: article.summary || markdownExcerpt(article.content || "", 150),
            media: article.media?.slice(0, 1),
            createdAt: article.createdAt,
        }));
}
