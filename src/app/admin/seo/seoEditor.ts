// Shared pieces of the SEO editors (/admin/seo/*): the parts each editor owns, and the pure helpers
// behind the previews. No React here.
import { SITE_URL } from "@/lib/constants";
import {
    DEFAULT_SEO,
    SEO_PAGE_IDS,
    fillSeoText,
    type SeoAi,
    type SeoBusiness,
    type SeoPage,
    type SeoPageId,
    type SeoSettings,
    type SeoVerification,
} from "@/lib/seo/settings";

/** Values from Settings (site_content/settings) that empty SEO fields fall back to. */
export interface InheritedSettings {
    siteName: string;
    ownerName: string;
    /** The phone as written in Settings, e.g. +20 102 453 1452 */
    phoneDisplay: string;
    /** WhatsApp digits with the country code */
    whatsapp: string;
    email: string;
    siteLogo: string;
}

const trimmed = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/** Normalizes site_content/settings into the values SEO falls back to (a stable function for useAdminDoc). */
export function toInherited(raw: Record<string, unknown> | null): InheritedSettings {
    const data = raw ?? {};
    return {
        siteName: trimmed(data.siteName),
        ownerName: trimmed(data.ownerName),
        phoneDisplay: trimmed(data.phoneDisplay),
        whatsapp: trimmed(data.whatsappNumber).replace(/\D/g, ""),
        email: trimmed(data.emailAddress),
        siteLogo: trimmed(data.siteLogo),
    };
}

/** Placeholder values. `undefined` = unknown (Settings didn't load), so previews keep the {name}. */
export type SeoVars = Record<"siteName" | "ownerName" | "phone" | "city", string | undefined>;

// ── Parts ─────────────────────────────────────────────────────────────────────
// Each editor owns one part of site_content/seo. A part knows how to take its fields out of the
// settings, put an edited copy back (for the previews), and which fields to save.

export interface SeoPartSpec<P> {
    pick: (seo: SeoSettings) => P;
    /** The whole settings with the edited part in place */
    apply: (seo: SeoSettings, part: P) => SeoSettings;
    /** The fields this part saves, taken from tidied settings */
    patch: (clean: SeoSettings) => Record<string, unknown>;
}

function pickKeys<T extends object, K extends keyof T>(source: T, keys: readonly K[]): Pick<T, K> {
    return Object.fromEntries(keys.map((key) => [key, source[key]])) as Pick<T, K>;
}

function topLevelPart<K extends keyof SeoSettings>(keys: readonly K[]): SeoPartSpec<Pick<SeoSettings, K>> {
    return {
        pick: (seo) => pickKeys(seo, keys),
        apply: (seo, part) => ({ ...seo, ...part }),
        patch: (clean) => pickKeys(clean, keys),
    };
}

function businessPart<K extends keyof SeoBusiness>(keys: readonly K[]): SeoPartSpec<Pick<SeoBusiness, K>> {
    return {
        pick: (seo) => pickKeys(seo.business, keys),
        apply: (seo, part) => ({ ...seo, business: { ...seo.business, ...part } }),
        // Nested objects are merged when saving, so only these business fields are written
        patch: (clean) => ({ business: pickKeys(clean.business, keys) }),
    };
}

function aiPart<K extends keyof SeoAi>(keys: readonly K[]): SeoPartSpec<Pick<SeoAi, K>> {
    return {
        pick: (seo) => pickKeys(seo.ai, keys),
        apply: (seo, part) => ({ ...seo, ai: { ...seo.ai, ...part } }),
        patch: (clean) => ({ ai: pickKeys(clean.ai, keys) }),
    };
}

function pagePart(id: SeoPageId): SeoPartSpec<SeoPage> {
    return {
        pick: (seo) => seo.pages[id],
        apply: (seo, page) => ({ ...seo, pages: { ...seo.pages, [id]: page } }),
        patch: (clean) => ({ pages: { [id]: clean.pages[id] } }),
    };
}

export const SEO_PARTS = {
    basics: topLevelPart(["siteTitle", "titleTemplate", "description", "keywords"]),
    sharing: topLevelPart(["shareSiteName", "shareTagline", "twitterHandle"]),
    identity: businessPart(["name", "alternateNames", "summary", "founderName", "foundingYear"]),
    contact: businessPart(["phone", "whatsapp", "email"]),
    address: businessPart(["streetAddress", "city", "region", "postalCode", "country", "areaServed", "languages", "mapUrl"]),
    hours: businessPart(["openingHours", "priceRange"]),
    profiles: businessPart(["sameAs"]),
    ai: aiPart(["allowAiCrawlers", "llmsIntro"]),
    facts: aiPart(["facts"]),
    verification: {
        pick: (seo) => seo.verification,
        apply: (seo, verification) => ({ ...seo, verification }),
        patch: (clean) => ({ verification: clean.verification }),
    } satisfies SeoPartSpec<SeoVerification>,
};

export const SEO_PAGE_PARTS = Object.fromEntries(SEO_PAGE_IDS.map((id) => [id, pagePart(id)])) as Record<SeoPageId, SeoPartSpec<SeoPage>>;

export const SEO_PAGE_META: Record<SeoPageId, { label: string; path: string }> = {
    home: { label: "الصفحة الرئيسية", path: "/" },
    profile: { label: "نبذة عني (Profile)", path: "/profile" },
    projects: { label: "المشاريع", path: "/projects" },
    skills: { label: "الخدمات والمهارات", path: "/skills" },
    articles: { label: "المدونة والمقالات", path: "/articles" },
    pricing: { label: "الأسعار", path: "/pricing" },
    contact: { label: "التواصل", path: "/contact" },
};

export const SITE_HOST = new URL(SITE_URL).host;

/** Roughly what Google shows before cutting the text off. */
export const TITLE_LIMIT = 60;
export const DESCRIPTION_LIMIT = 160;

// The previews below mirror src/lib/seo/server.ts (getSiteSeo, pageMetadata), so keep them in step.

// What the site uses when Settings have no name
const FALLBACK_SITE_NAME = "GTech";
const FALLBACK_OWNER_NAME = "Gamal Abdelaty";

const digits = (value: string) => value.replace(/\D/g, "");

/** The phone empty SEO fields fall back to: Settings' display phone, else +WhatsApp. */
export function inheritedPhone(inherited: InheritedSettings | null, businessWhatsapp = "") {
    if (!inherited) return undefined;
    const whatsapp = digits(businessWhatsapp) || inherited.whatsapp;
    return inherited.phoneDisplay || (whatsapp ? `+${whatsapp}` : "");
}

export function seoVars(seo: SeoSettings, inherited: InheritedSettings | null): SeoVars {
    const own = (value: string) => value.trim() || undefined;
    return {
        siteName: inherited ? inherited.siteName || FALLBACK_SITE_NAME : undefined,
        ownerName: own(seo.business.founderName) ?? (inherited ? inherited.ownerName || FALLBACK_OWNER_NAME : undefined),
        phone: own(seo.business.phone) ?? inheritedPhone(inherited, seo.business.whatsapp),
        city: seo.business.city.trim(),
    };
}

/** A page title inside the title pattern, as Next.js does it ({title} = %s). A pattern without it gets the title in front. */
export function applyTitleTemplate(template: string, title: string, vars: SeoVars) {
    const pattern = fillSeoText(template, { ...vars, title: "%s" });
    const withSlot = !pattern ? `%s | ${vars.siteName ?? "{siteName}"}` : pattern.includes("%s") ? pattern : `%s | ${pattern}`;
    return withSlot.replace("%s", () => title);
}

/** The home page title: its own, else the site title. Pages without a title of their own show it too. */
function homeTitle(seo: SeoSettings, vars: SeoVars) {
    return fillSeoText(seo.pages.home.title, vars) || fillSeoText(seo.siteTitle || DEFAULT_SEO.siteTitle, vars) || (vars.siteName ?? "");
}

/** The title Google shows for a page: the home page uses its title as is, the others go in the pattern. */
export function pageTitle(seo: SeoSettings, id: SeoPageId, vars: SeoVars) {
    const home = homeTitle(seo, vars);
    if (id === "home") return home;
    const own = fillSeoText(seo.pages[id].title, vars);
    return own ? applyTitleTemplate(seo.titleTemplate, own, vars) : home;
}

/** A page's own description, or the site-wide one. */
export function pageDescription(seo: SeoSettings, id: SeoPageId, vars: SeoVars) {
    return fillSeoText(seo.pages[id].description, vars) || fillSeoText(seo.description, vars);
}

/** Characters as people count them (emoji and accents count once). */
export const textLength = (text: string) => Array.from(text).length;

/** Placeholder of a field that falls back to Settings. The value is isolated so numbers keep their order. */
export function inheritedPlaceholder(value: string | undefined) {
    return value ? `من الإعدادات: ⁦${value}⁩` : undefined;
}

/** Accepts the code itself or the whole `<meta … content="…">` tag the webmaster tools show. */
export function verificationCode(value: string) {
    const match = value.match(/content\s*=\s*["']([^"']*)["']/i);
    return match ? match[1].trim() : value;
}

export const isWebUrl = (value: string) => /^https?:\/\/[^\s/]+\.[^\s]+$/i.test(value.trim());

/** Trims every text and drops empty (or repeated) list rows, so the saved document is exactly what the site uses. */
export function tidySeo(seo: SeoSettings): SeoSettings {
    const tidy = (value: unknown): unknown => {
        if (typeof value === "string") return value.trim();
        if (Array.isArray(value)) return [...new Set(value.map(tidy).filter((item) => item !== ""))];
        if (value && typeof value === "object") {
            return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, tidy(item)]));
        }
        return value;
    };
    const clean = tidy(seo) as SeoSettings;
    return { ...clean, business: { ...clean.business, country: clean.business.country.toUpperCase() } };
}

/** Deep equality for plain JSON-like values (key order doesn't matter). */
export function isEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (Array.isArray(a) || Array.isArray(b)) {
        return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((item, index) => isEqual(item, b[index]));
    }
    if (a && b && typeof a === "object" && typeof b === "object") {
        const left = a as Record<string, unknown>;
        const right = b as Record<string, unknown>;
        const keys = Object.keys(left);
        return keys.length === Object.keys(right).length && keys.every((key) => isEqual(left[key], right[key]));
    }
    return false;
}
