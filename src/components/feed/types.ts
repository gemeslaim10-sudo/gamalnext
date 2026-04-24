// ── Feed Types ─────────────────────────────────────────────────────────────
export type FeedItem = {
    id: string;
    type: "article" | "project" | "tool" | "post";
    title: string;
    description: string;
    fullContent?: string;
    imageUrl: string | null;
    gallery?: string[];
    mediaType: "image" | "video";
    videoUrl?: string | null;
    link: string;
    createdAt: string;
    author?: string;
};

export interface FeedAd {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    whatsappMessage: string;
    whatsappNumber: string;
}
