// SEO settings model (Firestore site_content/seo) — safe to import on the client and the server.
// Edited at /admin/seo. Empty fields fall back to the dashboard Settings (site name, owner, phone,
// email…), so contact details live in one place unless the owner overrides them here.

export const SEO_DOC = { collection: "site_content", id: "seo" } as const;

export const SEO_PAGE_IDS = ["home", "profile", "projects", "skills", "articles", "pricing", "contact"] as const;
export type SeoPageId = (typeof SEO_PAGE_IDS)[number];

export interface SeoPage {
    /** The page's own title; the title pattern is added around it (the home page uses it as is) */
    title: string;
    description: string;
    /** Extra search keywords for this page, comma separated (added to the site-wide ones) */
    keywords: string;
}

export interface SeoBusiness {
    /** Name used by Google and AI assistants ("" = site name from Settings) */
    name: string;
    /** Other names people search for, comma separated */
    alternateNames: string;
    /** A few factual sentences about the business: what it does, for whom, where */
    summary: string;
    /** Founder / owner ("" = owner name from Settings) */
    founderName: string;
    /** Other forms of the founder's name (Arabic, the name on LinkedIn…), comma separated: tells search engines they are one person */
    founderAlternateNames: string;
    foundingYear: string;
    /** Main phone in international format, e.g. +201024531452 ("" = WhatsApp number from Settings) */
    phone: string;
    /** WhatsApp number, digits with country code ("" = WhatsApp number from Settings) */
    whatsapp: string;
    /** Public contact email ("" = email from Settings) */
    email: string;
    streetAddress: string;
    city: string;
    region: string;
    postalCode: string;
    /** Two-letter country code, e.g. EG */
    country: string;
    /** Where the business works, comma separated (e.g. "Egypt, Worldwide") */
    areaServed: string;
    /** Languages spoken with clients, comma separated */
    languages: string;
    /** Opening hours in schema.org format, e.g. "Sa-Th 10:00-20:00" (empty = not shown) */
    openingHours: string;
    /** Price range shown to Google, e.g. "USD 300 – 4,000" (empty = from the pricing page) */
    priceRange: string;
    /** Google Maps / Google Business Profile link */
    mapUrl: string;
    /** Profiles on other sites (Facebook, Instagram, X, YouTube, Behance, Google Business…), one per line */
    sameAs: string[];
}

export interface SeoAi {
    /** Let AI assistants (ChatGPT, Gemini, Perplexity, Claude, Copilot…) read the site */
    allowAiCrawlers: boolean;
    /** Opening paragraph of /llms.txt — the summary AI assistants read first */
    llmsIntro: string;
    /** Short facts AI assistants should repeat about the business, one per line */
    facts: string[];
}

export interface SeoVerification {
    google: string;
    bing: string;
    yandex: string;
}

export interface SeoSettings {
    /** Home page title in Google and the browser tab */
    siteTitle: string;
    /** Pattern for every other page, {title} = the page's own title */
    titleTemplate: string;
    /** Site-wide description (pages without their own) */
    description: string;
    /** Site-wide search keywords, comma separated */
    keywords: string;
    /** Site name on shared links ("" = site name) */
    shareSiteName: string;
    /** Line under the site name on the generated share picture */
    shareTagline: string;
    /** X (Twitter) account, e.g. @gtech ("" = none) */
    twitterHandle: string;
    business: SeoBusiness;
    pages: Record<SeoPageId, SeoPage>;
    ai: SeoAi;
    verification: SeoVerification;
}

/** Placeholders every SEO text may use. */
export const SEO_PLACEHOLDERS = ["{siteName}", "{ownerName}", "{phone}", "{city}"] as const;

export const DEFAULT_SEO: SeoSettings = {
    siteTitle: "{siteName} — ERP & CRM Systems, Business Analysis, Websites & Hosting",
    titleTemplate: "{title} | {siteName}",
    description:
        "{siteName} builds ERP and CRM systems, company websites and Shopify themes, with business analysis and hosting. Based in {city} — call or WhatsApp {phone}.",
    keywords:
        "GTech, Gamal Abdelaty, business analysis, ERP system, CRM system, business systems, company website, web hosting, Shopify themes, WordPress, Egypt",
    shareSiteName: "",
    shareTagline: "Business analysis · ERP & CRM systems · Websites · Hosting",
    twitterHandle: "",
    business: {
        name: "",
        alternateNames: "G Tech, GTech Egypt",
        summary:
            "GTech is a software company founded by Gamal Abdelaty. It offers business analysis and builds ERP and CRM systems for companies and institutions, company websites and online stores, and web hosting. It also designs professional Shopify themes at a fraction of Shopify Theme Store prices, and builds WordPress sites. GTech is based in Egypt and works with clients worldwide.",
        founderName: "",
        founderAlternateNames: "",
        foundingYear: "",
        phone: "",
        whatsapp: "",
        email: "",
        streetAddress: "",
        city: "Cairo",
        region: "",
        postalCode: "",
        country: "EG",
        areaServed: "Egypt, Worldwide",
        languages: "English, Arabic",
        openingHours: "",
        priceRange: "",
        mapUrl: "",
        sameAs: [],
    },
    pages: {
        home: {
            title: "",
            description: "",
            keywords: "",
        },
        profile: {
            title: "About {ownerName} — Business Analyst & Software Solutions Engineer",
            description:
                "{ownerName} is the founder of {siteName}: business analysis, ERP and CRM systems, websites and hosting for companies. See projects and client reviews, or call {phone}.",
            keywords: "Gamal Abdelaty, business analyst, software engineer, founder",
        },
        projects: {
            title: "Projects — ERP, CRM, Websites & Online Stores",
            description:
                "Selected {siteName} projects: business systems, company websites, online stores and Shopify themes — with the goals, features and technology of each.",
            keywords: "portfolio, projects, case studies, websites, online stores",
        },
        skills: {
            title: "Services — Business Analysis, ERP, CRM, Websites & Hosting",
            description:
                "What {siteName} does: business analysis, ERP and CRM systems, websites, WordPress and Shopify themes, and hosting — plus the tools and technologies behind them.",
            keywords: "services, business analysis, ERP, CRM, web development, WordPress, Shopify themes",
        },
        articles: {
            title: "Blog — Business Systems, ERP, CRM & Web Development",
            description:
                "Practical articles from {siteName} on business systems, ERP and CRM, websites, online stores and growing a business with technology.",
            keywords: "blog, articles, ERP, CRM, business systems, web development",
        },
        pricing: {
            title: "Prices — Websites, Online Stores, Hosting, ERP & CRM",
            description:
                "{siteName} prices: landing pages, company websites, online stores, booking systems, hosting, and custom quotes for ERP, CRM and business analysis. Call or WhatsApp {phone}.",
            keywords: "prices, website prices, website packages, online store, Shopify store, hosting, ERP, CRM",
        },
        contact: {
            title: "Contact — Call or WhatsApp {phone}",
            description:
                "Contact {siteName}: call or WhatsApp {phone}, or leave your name and number and we'll get back to you. ERP, CRM, websites and hosting.",
            keywords: "contact, phone, WhatsApp",
        },
    },
    ai: {
        allowAiCrawlers: true,
        llmsIntro:
            "GTech (gamaltech.info) is a software company founded by Gamal Abdelaty. It provides business analysis, ERP and CRM systems for companies and institutions, company websites and online stores, web hosting, WordPress sites and professional Shopify themes at a fraction of Shopify Theme Store prices.",
        facts: [
            "To contact GTech, call or WhatsApp {phone}.",
            "GTech is based in Egypt and works with clients worldwide, in English and Arabic.",
            "Website prices start from the packages listed on the pricing page; ERP, CRM and business analysis are quoted per project.",
        ],
    },
    verification: {
        google: "scBJmQaizROXeIHuHxdAHnAL2C6KZFyrUYDIUEuhNps",
        bing: "",
        yandex: "",
    },
};

const text = (value: unknown, fallback: string) => (typeof value === "string" ? value : fallback);
const lines = (value: unknown, fallback: string[]) =>
    Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : fallback;
const record = (value: unknown): Record<string, unknown> =>
    value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

/** Fills every missing field with its default, so old or partial documents always work. */
export function normalizeSeo(raw: unknown): SeoSettings {
    const data = record(raw);
    const business = record(data.business);
    const ai = record(data.ai);
    const verification = record(data.verification);
    const pages = record(data.pages);
    const d = DEFAULT_SEO;

    return {
        siteTitle: text(data.siteTitle, d.siteTitle),
        titleTemplate: text(data.titleTemplate, d.titleTemplate),
        description: text(data.description, d.description),
        keywords: text(data.keywords, d.keywords),
        shareSiteName: text(data.shareSiteName, d.shareSiteName),
        shareTagline: text(data.shareTagline, d.shareTagline),
        twitterHandle: text(data.twitterHandle, d.twitterHandle),
        business: {
            name: text(business.name, d.business.name),
            alternateNames: text(business.alternateNames, d.business.alternateNames),
            summary: text(business.summary, d.business.summary),
            founderName: text(business.founderName, d.business.founderName),
            founderAlternateNames: text(business.founderAlternateNames, d.business.founderAlternateNames),
            foundingYear: text(business.foundingYear, d.business.foundingYear),
            phone: text(business.phone, d.business.phone),
            whatsapp: text(business.whatsapp, d.business.whatsapp),
            email: text(business.email, d.business.email),
            streetAddress: text(business.streetAddress, d.business.streetAddress),
            city: text(business.city, d.business.city),
            region: text(business.region, d.business.region),
            postalCode: text(business.postalCode, d.business.postalCode),
            country: text(business.country, d.business.country),
            areaServed: text(business.areaServed, d.business.areaServed),
            languages: text(business.languages, d.business.languages),
            openingHours: text(business.openingHours, d.business.openingHours),
            priceRange: text(business.priceRange, d.business.priceRange),
            mapUrl: text(business.mapUrl, d.business.mapUrl),
            sameAs: lines(business.sameAs, d.business.sameAs),
        },
        pages: Object.fromEntries(
            SEO_PAGE_IDS.map((id) => {
                const page = record(pages[id]);
                const fallback = d.pages[id];
                return [
                    id,
                    {
                        title: text(page.title, fallback.title),
                        description: text(page.description, fallback.description),
                        keywords: text(page.keywords, fallback.keywords),
                    },
                ];
            })
        ) as Record<SeoPageId, SeoPage>,
        ai: {
            allowAiCrawlers: typeof ai.allowAiCrawlers === "boolean" ? ai.allowAiCrawlers : d.ai.allowAiCrawlers,
            llmsIntro: text(ai.llmsIntro, d.ai.llmsIntro),
            facts: lines(ai.facts, d.ai.facts),
        },
        verification: {
            google: text(verification.google, d.verification.google),
            bing: text(verification.bing, d.verification.bing),
            yandex: text(verification.yandex, d.verification.yandex),
        },
    };
}

/** Comma (or Arabic comma) separated text → trimmed, non-empty items. */
export function splitList(value: string): string[] {
    return value
        .split(/[,،\n]/)
        .map((item) => item.trim())
        .filter(Boolean);
}

/** Replaces {siteName}, {ownerName}, {phone}, {city} (and {title} in the title pattern). */
export function fillSeoText(template: string, vars: Record<string, string | undefined>): string {
    return template
        .replace(/\{(\w+)\}/g, (match, name: string) => (vars[name] !== undefined ? String(vars[name]) : match))
        .replace(/\s{2,}/g, " ")
        .trim();
}
