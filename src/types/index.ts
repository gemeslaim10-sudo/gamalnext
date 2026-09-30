import type { User } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';
// ── Firebase Timestamp ──────────────────────────────────────────────────────
// Firestore timestamps can appear in multiple shapes depending on context
// (server component, client component, serialized, raw)
export type FirebaseTimestamp =
    | Timestamp
    | { seconds: number; nanoseconds?: number; toDate?: () => Date; toMillis?: () => number }
    | Date
    | string
    | number
    | null;
// ── Media ───────────────────────────────────────────────────────────────────
export interface MediaItem {
    url: string;
    type: 'image' | 'video';
}
// ── Article Types ───────────────────────────────────────────────────────────
/** Raw article from Firestore (before serialization) */
export interface ArticleRaw {
    id: string;
    title: string;
    summary?: string;
    content: string;
    media: MediaItem[];
    createdAt?: FirebaseTimestamp;
    updatedAt?: FirebaseTimestamp;
    authorId: string;
    authorName?: string;
    tags?: string[];
    /** "pending" while waiting for review; missing or "published" = public */
    status?: string;
    /** Readable address part: /articles/{slug} (older articles have none and use their id) */
    slug?: string;
}
/** Serialized article (timestamps converted to numbers for client components) */
export interface ArticleSerialized {
    id: string;
    title: string;
    summary?: string;
    content: string;
    media: MediaItem[];
    createdAt: number;
    updatedAt?: number | null;
    authorId: string;
    authorName?: string;
    tags?: string[];
    slug?: string;
}
/** Minimal article card type (used in listings, trending, related) */
export interface ArticleCard {
    id: string;
    title: string;
    summary?: string;
    content?: string;
    media?: MediaItem[];
    createdAt: FirebaseTimestamp;
}
// ── Review Types ────────────────────────────────────────────────────────────
export interface Review {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: FirebaseTimestamp;
    status?: string;
}
// ── Project Types ───────────────────────────────────────────────────────────
export interface ProjectItem {
    title: string;
    image?: string;
    images?: string[];
    tags?: string;
    link?: string;
    description?: string;
    category: string;
    slug?: string;
    // Case study (optional, from the dashboard)
    challenge?: string;
    solution?: string;
    /** One per line */
    features?: string;
    results?: string;
}
export interface ProjectsData {
    items: ProjectItem[];
    [key: string]: unknown;
}
// ── Notification Types ──────────────────────────────────────────────────────
export interface AppNotification {
    id: string;
    senderName: string;
    type: 'welcome' | 'like' | 'comment' | 'review_request' | 'article_approved';
    link: string;
    read: boolean;
    createdAt: FirebaseTimestamp;
}
// ── User Types ──────────────────────────────────────────────────────────────
/** Firebase Auth User - re-export for convenience */
export type AppUser = User;
/** User profile from Firestore */
export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    photoURL?: string;
    bio?: string;
    lastLoginAt?: FirebaseTimestamp;
    createdAt?: FirebaseTimestamp;
}
// ── Branding ────────────────────────────────────────────────────────────────
export interface BrandingSettings {
    siteName?: string;
    siteLogo?: string;
    ownerBio?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    emailAddress?: string;
    whatsappNumber?: string;
    phoneDisplay?: string;
    ownerLocation?: string;
    [key: string]: unknown;
}
// ── Utility: Firebase Error ─────────────────────────────────────────────────
export interface FirebaseError extends Error {
    code: string;
}
// ── Timestamp Helpers ───────────────────────────────────────────────────────
export { getTimestampMs, formatTimestamp } from '@/lib/utils/timestamp';
