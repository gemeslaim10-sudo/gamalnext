// Service pages content: reading the stored document safely. Shared by the site and the dashboard.
import rawDefaults from "./defaults.json";
import type { ServiceCopy, ServiceFaq, ServiceItem, ServiceLabels, ServiceLang, ServicesContent, ServicesIndexCopy, ServiceStep } from "./types";

export const SERVICES_DOC = { collection: "site_content", id: "services" } as const;
export const SERVICES_PATH = `${SERVICES_DOC.collection}/${SERVICES_DOC.id}` as const;

/**
 * The starting content. It seeded `site_content/services`, and the pages only fall back to it when
 * the database can't be read — the dashboard is the source of truth.
 */
export const DEFAULT_SERVICES = rawDefaults as ServicesContent;

type Raw = Record<string, unknown>;
const asRecord = (value: unknown): Raw => (value && typeof value === "object" && !Array.isArray(value) ? (value as Raw) : {});
/** A stored text; a field that was never saved (e.g. added after the last save) takes the fallback. */
const text = (raw: Raw, key: string, fallback = "") => (typeof raw[key] === "string" ? (raw[key] as string) : fallback);
const textList = (raw: Raw, key: string, fallback: string[] = []) =>
    Array.isArray(raw[key]) ? (raw[key] as unknown[]).filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean) : fallback;

function steps(raw: Raw, key: string, fallback: ServiceStep[] = []): ServiceStep[] {
    if (!Array.isArray(raw[key])) return fallback;
    return (raw[key] as unknown[])
        .map((entry) => ({ title: text(asRecord(entry), "title").trim(), text: text(asRecord(entry), "text").trim() }))
        .filter((step) => step.title || step.text);
}

function faqs(raw: Raw, key: string, fallback: ServiceFaq[] = []): ServiceFaq[] {
    if (!Array.isArray(raw[key])) return fallback;
    return (raw[key] as unknown[])
        .map((entry) => ({ question: text(asRecord(entry), "question").trim(), answer: text(asRecord(entry), "answer").trim() }))
        .filter((faq) => faq.question && faq.answer);
}

export const EMPTY_COPY: ServiceCopy = {
    name: "",
    label: "",
    summary: "",
    seoTitle: "",
    seoDescription: "",
    h1: "",
    intro: "",
    audienceTitle: "",
    audience: [],
    problemsTitle: "",
    problems: [],
    includesTitle: "",
    includes: [],
    processTitle: "",
    process: [],
    faqTitle: "",
    faqs: [],
    ctaTitle: "",
    ctaText: "",
};

function toCopy(value: unknown, fallback: ServiceCopy = EMPTY_COPY): ServiceCopy {
    const raw = asRecord(value);
    return {
        name: text(raw, "name", fallback.name),
        label: text(raw, "label", fallback.label),
        summary: text(raw, "summary", fallback.summary),
        seoTitle: text(raw, "seoTitle", fallback.seoTitle),
        seoDescription: text(raw, "seoDescription", fallback.seoDescription),
        h1: text(raw, "h1", fallback.h1),
        intro: text(raw, "intro", fallback.intro),
        audienceTitle: text(raw, "audienceTitle", fallback.audienceTitle),
        audience: textList(raw, "audience", fallback.audience),
        problemsTitle: text(raw, "problemsTitle", fallback.problemsTitle),
        problems: textList(raw, "problems", fallback.problems),
        includesTitle: text(raw, "includesTitle", fallback.includesTitle),
        includes: textList(raw, "includes", fallback.includes),
        processTitle: text(raw, "processTitle", fallback.processTitle),
        process: steps(raw, "process", fallback.process),
        faqTitle: text(raw, "faqTitle", fallback.faqTitle),
        faqs: faqs(raw, "faqs", fallback.faqs),
        ctaTitle: text(raw, "ctaTitle", fallback.ctaTitle),
        ctaText: text(raw, "ctaText", fallback.ctaText),
    };
}

/** URL-safe slug: lowercase latin letters, digits and dashes. */
export function cleanSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s-]+/g, "-")
        .replace(/^-|-$/g, "");
}

function toItem(value: unknown): ServiceItem | null {
    const raw = asRecord(value);
    const slug = cleanSlug(text(raw, "slug"));
    if (!slug) return null;
    // New fields added in code later get the default of the same service
    const defaults = DEFAULT_SERVICES.items.find((item) => item.slug === slug);
    return {
        slug,
        visible: typeof raw.visible === "boolean" ? raw.visible : true,
        pricingIds: textList(raw, "pricingIds", defaults?.pricingIds ?? []),
        projectKeywords: text(raw, "projectKeywords", defaults?.projectKeywords ?? ""),
        articleKeywords: text(raw, "articleKeywords", defaults?.articleKeywords ?? ""),
        en: toCopy(raw.en, defaults?.en),
        ar: toCopy(raw.ar, defaults?.ar),
    };
}

function toIndexCopy(value: unknown, fallback: ServicesIndexCopy): ServicesIndexCopy {
    const raw = asRecord(value);
    return {
        seoTitle: text(raw, "seoTitle", fallback.seoTitle),
        seoDescription: text(raw, "seoDescription", fallback.seoDescription),
        h1: text(raw, "h1", fallback.h1),
        intro: text(raw, "intro", fallback.intro),
    };
}

function toLabels(value: unknown, fallback: ServiceLabels): ServiceLabels {
    const raw = asRecord(value);
    return Object.fromEntries(
        (Object.keys(fallback) as (keyof ServiceLabels)[]).map((key) => [key, text(raw, key, fallback[key])])
    ) as unknown as ServiceLabels;
}

/** The stored document as the pages and the dashboard use it (no document = the starting content). */
export function normalizeServices(raw: Record<string, unknown> | null | undefined): ServicesContent {
    if (!raw) return DEFAULT_SERVICES;
    const index = asRecord(raw.index);
    const labels = asRecord(raw.labels);
    const seen = new Set<string>();
    const items = (Array.isArray(raw.items) ? raw.items : [])
        .map(toItem)
        .filter((item): item is ServiceItem => {
            if (!item || seen.has(item.slug)) return false;
            seen.add(item.slug);
            return true;
        });
    return {
        index: { en: toIndexCopy(index.en, DEFAULT_SERVICES.index.en), ar: toIndexCopy(index.ar, DEFAULT_SERVICES.index.ar) },
        labels: { en: toLabels(labels.en, DEFAULT_SERVICES.labels.en), ar: toLabels(labels.ar, DEFAULT_SERVICES.labels.ar) },
        items,
    };
}

/** A page exists in a language when it has a name and a main heading there. */
export function hasPage(item: ServiceItem, lang: ServiceLang) {
    const copy = item[lang];
    return item.visible && Boolean(copy.name.trim() && copy.h1.trim());
}

export function servicePath(slug: string, lang: ServiceLang = "en") {
    return `${lang === "ar" ? "/ar" : ""}/services/${slug}`;
}

export function servicesIndexPath(lang: ServiceLang = "en") {
    return lang === "ar" ? "/ar/services" : "/services";
}

/** Comma separated keywords → lowercase words to look for. */
export function keywordList(value: string) {
    return value
        .split(/[,،]/)
        .map((word) => word.trim().toLowerCase())
        .filter(Boolean);
}

/** Does any keyword appear in any of the texts (case-insensitive)? */
export function matchesKeywords(keywords: string[], texts: (string | undefined | null)[]) {
    if (keywords.length === 0) return false;
    const haystack = texts.filter(Boolean).join(" \n ").toLowerCase();
    return keywords.some((word) => haystack.includes(word));
}
