// Server only — the service pages' content (cached until the dashboard saves) and what each page
// links to: its prices, related projects and related articles (all from the same cached reads).
import { cache } from "react";
import { CACHE_TAGS, cached, readDoc, readOrFallback } from "@/lib/cache";
import { getProjects, getPublicArticles, projectImage } from "@/lib/content/server";
import { loadPricing } from "@/lib/pricing/server";
import { SERVICES_DOC, hasPage, keywordList, matchesKeywords, normalizeServices, servicePath } from "./content";
import type { ServiceItem, ServiceLang, ServicesContent } from "./types";

const readServices = cached(
    async () => readDoc<Record<string, unknown>>(SERVICES_DOC.collection, SERVICES_DOC.id),
    "services",
    [CACHE_TAGS.services]
);

/** The whole services document (the starting content when it can't be read). */
export const getServicesContent = cache(async (): Promise<ServicesContent> =>
    normalizeServices(await readOrFallback("services", readServices, null))
);

/** Services with a page in this language, in the dashboard's order. */
export async function getServicePages(lang: ServiceLang) {
    return (await getServicesContent()).items.filter((item) => hasPage(item, lang));
}

export async function getServicePage(slug: string, lang: ServiceLang) {
    return (await getServicePages(lang)).find((item) => item.slug === slug) ?? null;
}

export interface ServicePrice {
    id: string;
    name: string;
    price: number;
    /** The price is where it starts */
    from: boolean;
    currency: string;
}

/** The pricing items this service shows, with their current prices (fixed-price ones only). */
export async function servicePrices(item: ServiceItem): Promise<ServicePrice[]> {
    const result = await loadPricing();
    if (result.status !== "ok") return [];
    const { packages, services, labels } = result.content;
    const listed = [...packages, ...services].filter((entry) => entry.visible && entry.name.trim());
    return item.pricingIds.flatMap((id) => {
        const entry = listed.find((candidate) => candidate.id === id);
        if (!entry || entry.customQuote || !entry.price) return [];
        return [{ id, name: entry.name.trim(), price: entry.price, from: Boolean(entry.priceFrom), currency: labels.currency.trim() }];
    });
}

export interface RelatedProject {
    title: string;
    href: string;
    image?: string;
    tags: string[];
}

/** Projects whose title, tags or category contain one of the service's project keywords. */
export async function relatedProjects(item: ServiceItem, limit = 6): Promise<RelatedProject[]> {
    const keywords = keywordList(item.projectKeywords);
    if (keywords.length === 0) return [];
    const projects = (await getProjects()) ?? [];
    return projects
        .filter((project) => (project.title || project.name) && project.urlSlug)
        .filter((project) => matchesKeywords(keywords, [project.title, project.name, project.tags, project.category, project.description]))
        .slice(0, limit)
        .map((project) => ({
            title: String(project.title || project.name).trim(),
            href: `/projects/${project.urlSlug}`,
            image: projectImage(project),
            tags: String(project.tags || "")
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
                .slice(0, 3),
        }));
}

export interface RelatedArticle {
    id: string;
    slug?: string;
    title: string;
    summary?: string;
    content?: string;
    media?: { url: string; type: "image" | "video" }[];
    createdAt: number;
}

/** Published articles whose tags or title contain one of these keywords. */
export async function relatedArticles(keywordsText: string, limit = 3): Promise<RelatedArticle[]> {
    const keywords = keywordList(keywordsText);
    if (keywords.length === 0) return [];
    const articles = (await getPublicArticles()) ?? [];
    return articles
        .filter((article) => matchesKeywords(keywords, [...(article.tags ?? []), article.title]))
        .slice(0, limit)
        .map((article) => ({
            id: article.id,
            slug: article.slug,
            title: article.title,
            summary: article.summary,
            content: article.summary ? undefined : (article.content || "").slice(0, 400),
            media: article.media?.slice(0, 1),
            createdAt: article.createdAt,
        }));
}

export interface ServiceLink {
    name: string;
    summary: string;
    href: string;
}

/**
 * Service pages that match an article's tags or a project's tags (for "Related services" links),
 * using each service's article or project keywords.
 */
export async function servicesFor(kind: "articles" | "projects", texts: (string | undefined | null)[], lang: ServiceLang = "en", limit = 2) {
    const pages = await getServicePages(lang);
    return pages
        .filter((item) => matchesKeywords(keywordList(kind === "articles" ? item.articleKeywords : item.projectKeywords), texts))
        .slice(0, limit)
        .map((item): ServiceLink => ({ name: item[lang].name, summary: item[lang].summary, href: servicePath(item.slug, lang) }));
}
