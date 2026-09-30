// ── Feed Types ─────────────────────────────────────────────────────────────
export type FeedItem = {
    id: string;
    type: "article" | "project" | "post";
    title: string;
    description: string;
    fullContent?: string;
    imageUrl: string | null;
    gallery?: string[] | null;
    mediaType: "image" | "video";
    videoUrl?: string | null;
    link: string;
    createdAt: string;
    author?: string;
    /** Photo of the post's author (community posts only) */
    authorPhoto?: string | null;
    /** True when the site owner wrote it, so the owner's photo is shown */
    byOwner?: boolean;
    userId?: string;
};
