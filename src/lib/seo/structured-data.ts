// Server only — schema.org structured data (JSON-LD) that tells Google and AI assistants who GTech
// is, what it offers, its prices and how to contact it. Built from the dashboard data, so it always
// matches what the pages show.
import { SITE_URL } from "@/lib/constants";
import { loadPricing } from "@/lib/pricing/server";
import { isListed } from "@/lib/pricing/utils";
import type { PricingContent } from "@/lib/pricing/types";
import { getSkillsData } from "@/components/sections/skills/data";
import { SHARE_IMAGE, absoluteUrl, clean, getSiteSeo, type SiteSeo } from "./server";
import { splitList } from "./settings";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

type Node = Record<string, unknown>;

/** Drops empty values (undefined, "", [], {}) so the output only states real facts. */
export function compact<T>(value: T): T {
    if (Array.isArray(value)) {
        return value.map(compact).filter((item) => !isEmpty(item)) as T;
    }
    if (value && typeof value === "object") {
        const entries = Object.entries(value as Record<string, unknown>)
            .map(([key, item]) => [key, compact(item)] as const)
            .filter(([, item]) => !isEmpty(item));
        return Object.fromEntries(entries) as T;
    }
    return value;
}

function isEmpty(value: unknown) {
    if (value === undefined || value === null || value === "") return true;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value as object).length === 0;
    return false;
}

/** The pricing currency as an ISO code (the label is free text, e.g. "USD"). */
function currencyCode(pricing: PricingContent | null) {
    const label = pricing?.labels.currency.trim().toUpperCase() ?? "";
    return /^[A-Z]{3}$/.test(label) ? label : "USD";
}

async function publishedPricing() {
    const result = await loadPricing();
    return result.status === "ok" ? result.content : null;
}

/** "USD 300 – 2,600" from the fixed-price packages, unless the owner typed a price range. */
function priceRange(site: SiteSeo, pricing: PricingContent | null) {
    const typed = clean(site.seo.business.priceRange);
    if (typed) return typed;
    const prices = (pricing?.packages ?? []).filter(isListed).flatMap((item) => (item.price ? [item.price] : []));
    if (prices.length === 0) return undefined;
    const format = (value: number) => value.toLocaleString("en-US");
    const [min, max] = [Math.min(...prices), Math.max(...prices)];
    return `${currencyCode(pricing)} ${format(min)}${max > min ? ` – ${format(max)}` : ""}`;
}

/** Other profiles of the business/owner (GitHub, LinkedIn, and the ones listed in /admin/seo). */
function profiles(site: SiteSeo) {
    const links = [clean(site.settings?.githubUrl), clean(site.settings?.linkedinUrl), ...site.seo.business.sameAs.map(clean)];
    return [...new Set(links.filter((link): link is string => Boolean(link && /^https?:\/\//.test(link))))];
}

/** Services the business offers: the "What I do" list, else the badges from Settings. */
async function serviceNames(site: SiteSeo) {
    const skills = await getSkillsData();
    const names = (skills.mainSkills ?? []).map((item) => clean(item.title)).filter((name): name is string => Boolean(name));
    return names.length > 0 ? names : splitList(site.settings?.ownerBadges ? String(site.settings.ownerBadges) : "");
}

/** Company + founder + website, on every page (pages add their own nodes that point here by @id). */
export async function siteGraph() {
    const [site, pricing] = await Promise.all([getSiteSeo(), publishedPricing()]);
    const services = await serviceNames(site);
    const business = site.seo.business;
    const areaServed = splitList(business.areaServed);
    const languages = splitList(business.languages);
    const sameAs = profiles(site);
    const currency = currencyCode(pricing);
    const offers = [...(pricing?.packages ?? []), ...(pricing?.services ?? [])].filter(isListed);
    const summary = site.fill(business.summary) || clean(site.settings?.siteDescription) || site.description;

    const organization: Node = {
        "@type": "LocalBusiness",
        "@id": ORGANIZATION_ID,
        name: site.businessName,
        alternateName: splitList(site.fill(business.alternateNames)),
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: absoluteUrl("/icon.png"), width: 192, height: 192 },
        image: site.logo ?? absoluteUrl(SHARE_IMAGE.url),
        description: summary,
        telephone: site.phone,
        email: site.email,
        address: {
            "@type": "PostalAddress",
            streetAddress: clean(business.streetAddress),
            addressLocality: clean(business.city),
            addressRegion: clean(business.region),
            postalCode: clean(business.postalCode),
            addressCountry: clean(business.country)?.toUpperCase(),
        },
        areaServed,
        founder: { "@id": PERSON_ID },
        foundingDate: clean(business.foundingYear),
        sameAs,
        hasMap: clean(business.mapUrl),
        openingHours: clean(business.openingHours),
        priceRange: priceRange(site, pricing),
        knowsAbout: services,
        contactPoint: [
            {
                "@type": "ContactPoint",
                contactType: "sales",
                telephone: site.phone,
                email: site.email,
                url: absoluteUrl("/contact"),
                areaServed,
                availableLanguage: languages,
            },
            site.whatsapp && {
                "@type": "ContactPoint",
                contactType: "customer support",
                name: "WhatsApp",
                telephone: `+${site.whatsapp}`,
                url: `https://wa.me/${site.whatsapp}`,
                availableLanguage: languages,
            },
        ],
        hasOfferCatalog: offers.length > 0 && {
            "@type": "OfferCatalog",
            name: `${site.businessName} services and prices`,
            url: absoluteUrl("/pricing"),
            itemListElement: offers.map((item) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: item.name, description: clean(item.description) },
                ...(item.price && !item.customQuote ? offerPrice(item.price, currency, item.priceFrom) : {}),
                url: absoluteUrl("/pricing"),
            })),
        },
    };

    const person: Node = {
        "@type": "Person",
        "@id": PERSON_ID,
        name: site.ownerName,
        url: absoluteUrl("/profile"),
        image: site.logo,
        jobTitle: site.ownerTitle,
        worksFor: { "@id": ORGANIZATION_ID },
        telephone: site.phone,
        email: site.email,
        knowsAbout: services,
        sameAs: profiles(site).filter((link) => !link.includes("wa.me")),
    };

    const website: Node = {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: site.siteName,
        alternateName: splitList(site.fill(business.alternateNames)),
        description: site.homeDescription,
        inLanguage: "en",
        publisher: { "@id": ORGANIZATION_ID },
    };

    return compact({ "@context": "https://schema.org", "@graph": [organization, person, website] });
}

// ── Page nodes ────────────────────────────────────────────────────────────────

export interface Crumb {
    name: string;
    path: string;
}

export function breadcrumbs(items: Crumb[]): Node {
    return {
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: absoluteUrl(item.path),
        })),
    };
}

/** Wraps page nodes in a document that also references the site-wide company. */
export function pageGraph(...nodes: (Node | false | null | undefined)[]) {
    return compact({ "@context": "https://schema.org", "@graph": nodes.filter(Boolean) });
}

/** A web page of this site, with its type (ProfilePage, ContactPage, CollectionPage…). */
export function webPage(type: string, path: string, name: string, description: string | undefined, extra: Node = {}): Node {
    return {
        "@type": type,
        "@id": `${absoluteUrl(path)}#page`,
        url: absoluteUrl(path),
        name,
        description,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORGANIZATION_ID },
        inLanguage: "en",
        ...extra,
    };
}

export function itemList(items: { name: string; url: string; image?: string; description?: string }[], itemType = "CreativeWork"): Node {
    return {
        "@type": "ItemList",
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(item.url),
            item: { "@type": itemType, name: item.name, url: absoluteUrl(item.url), image: item.image, description: item.description },
        })),
    };
}

export function faqPage(path: string, items: { question: string; answer: string }[]): Node | null {
    if (items.length === 0) return null;
    return {
        "@type": "FAQPage",
        "@id": `${absoluteUrl(path)}#faq`,
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
    };
}

/** Services with the company as provider (skills page "What I do", pricing custom-quote services). */
/** An offer's price: exact, or where it starts (`from`). */
function offerPrice(price: number, currency: string, from?: boolean) {
    return from
        ? { priceSpecification: { "@type": "PriceSpecification", minPrice: price, priceCurrency: currency } }
        : { price, priceCurrency: currency };
}

export function serviceNodes(
    items: { name: string; description?: string; price?: number | null; priceFrom?: boolean; currency?: string }[],
    url: string
): Node[] {
    return items.map((item) => ({
        "@type": "Service",
        name: item.name,
        description: item.description,
        provider: { "@id": ORGANIZATION_ID },
        url: absoluteUrl(url),
        ...(item.price ? { offers: { "@type": "Offer", ...offerPrice(item.price, item.currency ?? "USD", item.priceFrom), url: absoluteUrl(url) } } : {}),
    }));
}
