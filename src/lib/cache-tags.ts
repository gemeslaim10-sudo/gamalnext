// Cache tag names — safe to import on the client (the cache itself lives in src/lib/cache.ts).

/**
 * Every cached read carries `site` (clearing it refreshes everything) plus the narrower tags of
 * what it contains, so a save can refresh just the affected content.
 */
export const CACHE_TAGS = {
    all: "site",
    settings: "settings",
    copy: "copy",
    seo: "seo",
    hero: "hero",
    skills: "skills",
    projects: "projects",
    articles: "articles",
    posts: "posts",
    reviews: "reviews",
    pricing: "pricing",
    leadCapture: "lead-capture",
    ai: "ai",
    feed: "feed",
    /** Public member profiles (/users/…) */
    members: "members",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export const ALL_CACHE_TAGS: readonly CacheTag[] = Object.values(CACHE_TAGS);

export function isCacheTag(value: unknown): value is CacheTag {
    return typeof value === "string" && (ALL_CACHE_TAGS as readonly string[]).includes(value);
}
