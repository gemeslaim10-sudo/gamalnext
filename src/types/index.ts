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

// ── Chat Types ──────────────────────────────────────────────────────────────
export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'assistant' | 'ai';
    timestamp: FirebaseTimestamp;
}

export interface ChatSession {
    id: string;
    userName?: string;
    userEmail?: string;
    lastMessage?: string;
    lastMessageAt: FirebaseTimestamp;
    messageCount?: number;
    startedAt?: FirebaseTimestamp;
    userContext?: Record<string, unknown>;
}

// ── Branding ────────────────────────────────────────────────────────────────
export interface BrandingSettings {
    siteName?: string;
    siteLogo?: string;
    [key: string]: unknown;
}

// ── Utility: Firebase Error ─────────────────────────────────────────────────
export interface FirebaseError extends Error {
    code: string;
}

// ── Timestamp Helpers ───────────────────────────────────────────────────────
/** Safely extract milliseconds from any Firebase timestamp shape */
export function getTimestampMs(ts: FirebaseTimestamp | undefined): number {
    if (!ts) return 0;
    if (typeof ts === 'number') return ts;
    if (typeof ts === 'string') return new Date(ts).getTime();
    if (ts instanceof Date) return ts.getTime();
    if (typeof ts === 'object') {
        if ('toMillis' in ts && typeof ts.toMillis === 'function') return ts.toMillis();
        if ('toDate' in ts && typeof ts.toDate === 'function') return ts.toDate().getTime();
        if ('seconds' in ts && typeof ts.seconds === 'number') return ts.seconds * 1000;
    }
    return 0;
}

/** Format a Firebase timestamp to a localized date string */
export function formatTimestamp(ts: FirebaseTimestamp | undefined, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions): string {
    const ms = getTimestampMs(ts);
    if (!ms) return '';
    const defaultOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(ms).toLocaleDateString(locale, options || defaultOptions);
}
