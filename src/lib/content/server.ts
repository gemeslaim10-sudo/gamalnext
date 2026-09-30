// Server only — the site's public content, read through the no-expiry cache (src/lib/cache.ts).
// Every getter returns `null`/`[]` only when the data really is missing; database errors are
// logged and turned into the caller's fallback without being cached.
import { cache } from "react";
import { orderBy, where } from "firebase/firestore";
import { CACHE_TAGS, cached, readCollection, readDoc, readOrFallback as safely } from "@/lib/cache";
import { isPublicArticle, projectSlug } from "./shared";
import { getTimestampMs } from "@/lib/utils/timestamp";
import type { ArticleRaw, ArticleSerialized, ProjectItem, Review } from "@/types";
import { LEAD_CAPTURE_DOC, normalizeLeadCapture, type LeadCaptureSettings } from "@/components/leads/settings";
import { defaultHeroData, type HeroData } from "@/components/sections/hero/HeroConfig";

// ── Projects ──────────────────────────────────────────────────────────────────

export interface Project extends ProjectItem {
    /** URL part: the title (same as the project cards), else the saved slug */
    urlSlug: string;
    name?: string;
    imageUrl?: string;
    gallery?: string[];
    videoUrl?: string;
    summary?: string;
    createdAt?: unknown;
    [key: string]: unknown;
}

const readProjects = cached(
    async () => ((await readDoc<{ items?: ProjectItem[] }>("site_content", "projects"))?.items ?? []) as Project[],
    "projects",
    [CACHE_TAGS.projects]
);

/** All projects in the dashboard order. `null` when the database couldn't be read. */
export const getProjects = cache(async (): Promise<Project[] | null> => {
    const items = await safely("projects", readProjects, null);
    return items?.map((item) => ({ ...item, urlSlug: projectSlug(item) })) ?? null;
});

export { projectSlug };

/** First image of a project, if any. */
export function projectImage(project: Project): string | undefined {
    return project.image || project.imageUrl || project.images?.[0] || project.gallery?.[0] || undefined;
}

// ── Articles ──────────────────────────────────────────────────────────────────

export { isPublicArticle } from "./shared";

const readArticles = cached(async () => readCollection<ArticleRaw>("articles"), "articles", [CACHE_TAGS.articles]);

/** Published articles, newest first, with timestamps as milliseconds. `null` when the database couldn't be read. */
export const getPublicArticles = cache(async (): Promise<ArticleSerialized[] | null> => {
    const articles = await safely("articles", readArticles, null);
    if (!articles) return null;
    return articles
        .filter(isPublicArticle)
        .map((article) => ({
            ...article,
            createdAt: getTimestampMs(article.createdAt) || 0,
            updatedAt: getTimestampMs(article.updatedAt) || null,
        }))
        .sort((a, b) => b.createdAt - a.createdAt) as ArticleSerialized[];
});

const readArticle = cached(async (id: string) => readDoc<ArticleRaw>("articles", id), "article", [CACHE_TAGS.articles]);

/** One article (any status — the page decides what to show). `undefined` when the database couldn't be read. */
export const getArticle = cache(async (id: string): Promise<ArticleRaw | null | undefined> =>
    safely(`article ${id}`, () => readArticle(id), undefined)
);

// ── Reviews ───────────────────────────────────────────────────────────────────

const readReviews = cached(
    async () => readCollection<Review>("reviews", where("status", "==", "approved"), orderBy("createdAt", "desc")),
    "reviews",
    [CACHE_TAGS.reviews]
);

/** Approved reviews, newest first (timestamps as milliseconds). */
export const getApprovedReviews = cache(async (): Promise<Review[]> => {
    const reviews = await safely("reviews", readReviews, []);
    return reviews.map((review) => ({ ...review, createdAt: getTimestampMs(review.createdAt) || 0 }));
});

// ── Hero ──────────────────────────────────────────────────────────────────────

const readHero = cached(async () => readDoc<HeroData>("site_content", "hero"), "hero", [CACHE_TAGS.hero]);

/** Profile page hero (defaults when missing or unreadable). */
export const getHero = cache(async (): Promise<HeroData> => (await safely("hero", readHero, null)) ?? defaultHeroData);

// ── Lead popup / contact page texts ───────────────────────────────────────────

const readLeadCapture = cached(
    async () => readDoc<Record<string, unknown>>(LEAD_CAPTURE_DOC.collection, LEAD_CAPTURE_DOC.id),
    "lead-capture",
    [CACHE_TAGS.leadCapture]
);

/** Lead popup and contact form texts (code defaults when missing or unreadable). */
export const getLeadCaptureSettings = cache(
    async (): Promise<LeadCaptureSettings> => normalizeLeadCapture(await safely("lead capture settings", readLeadCapture, null))
);
