// Server only: live facts from the website (contact info, pricing, projects, skills, articles),
// read with the Admin SDK and cached for a minute. Every part is optional — a missing or broken
// document just leaves that part out of the prompt.
import { getAdminDb } from "@/lib/firebase-admin";
import { CACHE_TAGS, cached } from "@/lib/cache";
import { NAV_LINKS } from "@/config/navigation";
import { slugify } from "@/lib/utils";

export interface SiteFacts {
    owner: {
        name?: string;
        title?: string;
        bio?: string;
        location?: string;
        availability?: string;
        siteName?: string;
        siteDescription?: string;
        whatsappNumber?: string;
        phoneDisplay?: string;
        email?: string;
        linkedin?: string;
        github?: string;
    };
    /** Readable lines built from `site_content/pricing`; empty when there's no pricing yet */
    pricing: string[];
    /** Same without package specs and FAQ, for backup models with small limits */
    pricingCompact: string[];
    projects: { title: string; category?: string; link: string; tags?: string; summary?: string; liveUrl?: string }[];
    skills: string[];
    articles: { title: string; link: string; summary?: string }[];
    pages: { label: string; href: string }[];
    /** The owner's own phone numbers (digits), so they're never mistaken for a visitor's */
    ownerPhones: string[];
}

type Doc = Record<string, unknown> | undefined;

async function readContentDoc(id: string): Promise<Doc> {
    const snap = await getAdminDb().collection("site_content").doc(id).get();
    return snap.exists ? snap.data() : undefined;
}

async function readLatestArticles(): Promise<Record<string, unknown>[]> {
    const snap = await getAdminDb().collection("articles").orderBy("createdAt", "desc").limit(15).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Record<string, unknown>);
}

// Cached with the rest of the site content (no time limit; dashboard saves and "Clear cache" refresh it)
const cachedContentDoc = cached(
    readContentDoc,
    "ai-site-content",
    [CACHE_TAGS.settings, CACHE_TAGS.pricing, CACHE_TAGS.projects, CACHE_TAGS.skills]
);
const cachedLatestArticles = cached(readLatestArticles, "ai-latest-articles", [CACHE_TAGS.articles]);

/** What each page in the site navigation is for (the nav itself decides which pages exist). */
const PAGE_LABELS: Record<string, string> = {
    "/": "Home",
    "/profile": "About the owner",
    "/projects": "Portfolio projects",
    "/skills": "Skills",
    "/articles": "Blog articles",
    "/pricing": "Pricing and packages",
    "/contact": "Contact",
};

/** `fresh` skips the cache (the admin test page). */
export async function loadSiteFacts({ fresh = false }: { fresh?: boolean } = {}): Promise<SiteFacts> {
    const contentDoc = fresh ? readContentDoc : cachedContentDoc;
    const [settings, pricing, projects, skills, articles] = await Promise.all([
        safe(() => contentDoc("settings")),
        safe(() => contentDoc("pricing")),
        safe(() => contentDoc("projects")),
        safe(() => contentDoc("skills")),
        safe(() => (fresh ? readLatestArticles() : cachedLatestArticles())),
    ]);

    const value: SiteFacts = {
        owner: readOwner(settings),
        pricing: formatPricing(pricing, false),
        pricingCompact: formatPricing(pricing, true),
        projects: readProjects(projects),
        skills: readSkills(skills),
        articles: readArticles(articles),
        pages: NAV_LINKS.filter((l) => !l.external && (l.href !== "/pricing" || pricing)).map((l) => ({
            label: PAGE_LABELS[l.href] || l.href,
            href: l.href,
        })),
        ownerPhones: readOwnerPhones(settings, pricing),
    };
    return value;
}

async function safe<T>(read: () => Promise<T>): Promise<T | undefined> {
    try {
        return await read();
    } catch (error) {
        console.error("[assistant] Site data read failed:", error);
        return undefined;
    }
}

// ── Readers ───────────────────────────────────────────────────────────────────

function text(value: unknown, max = 400): string | undefined {
    if (typeof value === "number") return String(value);
    if (typeof value !== "string") return undefined;
    const clean = value.replace(/\s+/g, " ").trim();
    if (!clean) return undefined;
    return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

function isHidden(item: Record<string, unknown>): boolean {
    return item.hidden === true || item.visible === false || item.published === false || item.active === false || item.enabled === false;
}

function readOwner(d: Doc): SiteFacts["owner"] {
    if (!d) return {};
    return {
        name: text(d.ownerName, 80),
        title: text(d.ownerTitle, 120),
        bio: text(d.ownerBio, 600),
        location: text(d.ownerLocation, 120),
        availability: text(d.availabilityStatus, 80),
        siteName: text(d.siteName, 120),
        siteDescription: text(d.siteDescription, 400),
        whatsappNumber: text(d.whatsappNumber, 30)?.replace(/\D/g, ""),
        phoneDisplay: text(d.phoneDisplay, 40),
        email: text(d.emailAddress, 120),
        linkedin: text(d.linkedinUrl, 200),
        github: text(d.githubUrl, 200),
    };
}

function readOwnerPhones(settings: Doc, pricing: Doc): string[] {
    const numbers = [settings?.whatsappNumber, settings?.phoneDisplay];
    const contact = pricing?.contact;
    if (contact && typeof contact === "object" && Array.isArray((contact as Record<string, unknown>).numbers)) {
        for (const n of (contact as { numbers: unknown[] }).numbers) {
            if (n && typeof n === "object") numbers.push((n as Record<string, unknown>).number);
        }
    }
    const digits = numbers.map((n) => (typeof n === "string" || typeof n === "number" ? String(n).replace(/\D/g, "") : "")).filter((n) => n.length >= 7);
    return [...new Set(digits)];
}

function readProjects(d: Doc): SiteFacts["projects"] {
    const items = Array.isArray(d?.items) ? (d.items as Record<string, unknown>[]) : [];
    return items
        .filter((p) => p && typeof p === "object" && !isHidden(p))
        .map((p) => {
            const title = text(p.title ?? p.name, 120) || "";
            const slug = text(p.slug, 160) || slugify(title);
            return {
                title,
                category: text(p.category, 60),
                link: `/projects/${slug}`,
                tags: text(p.tags, 160),
                summary: text(p.description, 180),
                liveUrl: typeof p.link === "string" && /^https?:\/\//.test(p.link) ? p.link.trim() : undefined,
            };
        })
        .filter((p) => p.title && p.link !== "/projects/");
}

function readSkills(d: Doc): string[] {
    if (!d) return [];
    const lines: string[] = [];
    const list = (value: unknown) => (Array.isArray(value) ? (value as Record<string, unknown>[]) : []).filter((x) => x && typeof x === "object");

    for (const skill of list(d.mainSkills)) {
        const title = text(skill.title, 100);
        if (!title) continue;
        const description = text(skill.description, 200);
        const tags = text(skill.tags, 160);
        lines.push(`${title}${description ? `: ${description}` : ""}${tags ? ` (${tags})` : ""}`);
    }
    const tech = list(d.techStack).map((t) => text(t.name, 40)).filter(Boolean);
    if (tech.length) lines.push(`Technologies: ${tech.join(", ")}`);
    const software = list(d.software).map((t) => text(t.name, 40)).filter(Boolean);
    if (software.length) lines.push(`Tools: ${software.join(", ")}`);
    return lines;
}

function readArticles(docs: Record<string, unknown>[] | undefined): SiteFacts["articles"] {
    if (!docs) return [];
    return docs
        .filter((a) => !isHidden(a) && !["pending", "rejected", "draft"].includes(String(a.status || "")))
        .map((a) => ({
            title: text(a.title, 160) || "",
            link: `/articles/${a.id}`,
            summary: text(a.excerpt ?? a.summary, 160),
        }))
        .filter((a) => a.title)
        .slice(0, 8);
}

// ── Pricing ───────────────────────────────────────────────────────────────────
// The pricing document is edited on /admin/pricing. Its exact shape may change, so this reads
// any list of priced items it finds (packages, plans, services…) instead of one fixed schema.

const NAME_KEYS = ["name", "title", "label", "plan", "packageName"];
const PRICE_KEYS = ["price", "priceLabel", "priceText", "amount", "cost", "startingAt", "startingPrice", "priceFrom", "from", "monthlyPrice", "yearlyPrice", "oneTimePrice"];
const CURRENCY_KEYS = ["currency", "currencySymbol"];
const PERIOD_KEYS = ["period", "billing", "interval", "per", "unit", "billingPeriod"];
const DESCRIPTION_KEYS = ["description", "subtitle", "summary", "tagline", "details"];
const FEATURE_KEYS = ["features", "includes", "included", "items", "bullets", "perks", "deliverables"];
const TIME_KEYS = ["delivery", "deliveryTime", "timeline", "turnaround", "duration"];
const NOTE_KEYS = ["note", "notes", "disclaimer", "footnote", "terms"];

function firstText(item: Record<string, unknown>, keys: string[], max = 160): string | undefined {
    for (const key of keys) {
        const value = text(item[key], max);
        if (value) return value;
    }
    return undefined;
}

function listText(value: unknown): string[] {
    if (typeof value === "string") return value.split(/\n|;/).map((s) => s.trim()).filter(Boolean);
    if (!Array.isArray(value)) return [];
    return value
        .map((v) => {
            if (typeof v === "string") return v;
            if (!v || typeof v !== "object") return undefined;
            const entry = v as Record<string, unknown>;
            if (entry.included === false || entry.available === false) return undefined;
            return firstText(entry, [...NAME_KEYS, "text", "value"]);
        })
        .filter((v): v is string => !!v && v.trim().length > 0)
        .map((v) => v.trim());
}

/** Price as text, whether it's stored as "5,000 EGP", 5000 or { amount, currency }. */
function priceText(item: Record<string, unknown>): string | undefined {
    for (const key of PRICE_KEYS) {
        const value = item[key];
        const plain = text(value, 60);
        if (plain) return plain;
        if (value && typeof value === "object" && !Array.isArray(value)) {
            const p = value as Record<string, unknown>;
            const amount = firstText(p, ["amount", "value", "price", "label", "text"], 40);
            if (amount) return [amount, firstText(p, CURRENCY_KEYS, 10), firstText(p, PERIOD_KEYS, 30)].filter(Boolean).join(" ");
        }
    }
    return undefined;
}

function formatPriced(item: Record<string, unknown>, group?: string): string | null {
    const name = firstText(item, NAME_KEYS, 100);
    if (!name) return null;
    const price = priceText(item);
    const features = FEATURE_KEYS.flatMap((key) => listText(item[key])).slice(0, 12);
    const description = firstText(item, DESCRIPTION_KEYS, 220);
    if (!price && !features.length && !description) return null;

    const currency = firstText(item, CURRENCY_KEYS, 10);
    const period = firstText(item, PERIOD_KEYS, 30);
    const time = firstText(item, TIME_KEYS, 60);
    const note = firstText(item, NOTE_KEYS, 200);

    let line = `- ${group ? `${group} › ` : ""}${name}`;
    if (price) line += `: ${price}${currency && !price.includes(currency) ? ` ${currency}` : ""}${period ? ` / ${period}` : ""}`;
    if (description) line += ` — ${description}`;
    if (features.length) line += `. Includes: ${features.join("; ")}`;
    if (time) line += ` (time: ${time})`;
    if (note) line += ` [note: ${note}]`;
    return line;
}

function formatPricing(d: Doc, compact: boolean): string[] {
    if (!d) return [];
    if (Array.isArray(d.packages) || Array.isArray(d.services) || Array.isArray(d.addons)) return formatPricingPage(d, compact);
    return formatPricingGeneric(d);
}

/** The /pricing page document: packages, add-ons, custom-quote services, info cards and FAQ. */
function formatPricingPage(d: Record<string, unknown>, compact: boolean): string[] {
    const obj = (v: unknown) => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
    const list = (v: unknown) => (Array.isArray(v) ? (v as unknown[]).map(obj).filter((x) => Object.keys(x).length && x.visible !== false) : []);
    const labels = obj(d.labels);
    const sections = obj(d.sections);
    const currency = text(labels.currency, 12) || "";
    const heading = (key: string, fallback: string) => text(obj(sections[key]).title, 80) || fallback;
    const money = (v: unknown) => {
        if (typeof v === "number" && Number.isFinite(v)) return `${v.toLocaleString("en-US")}${currency ? ` ${currency}` : ""}`;
        return text(v, 40);
    };
    const priceOf = (item: Record<string, unknown>) => {
        const price = money(item.price);
        if (item.customQuote === true || !price) return "custom quote (priced by scope)";
        if (item.priceFrom === true) return `from ${price} (final price depends on scope)`;
        const original = money(item.originalPrice);
        const hasDiscount = typeof item.originalPrice === "number" && typeof item.price === "number" && item.originalPrice > item.price;
        return hasDiscount ? `${price} (discounted from ${original})` : price;
    };
    const specs = (item: Record<string, unknown>) => {
        if (compact) {
            const cost = text(item.hostingCost, 40);
            return cost ? ` (hosting cost: ${cost})` : "";
        }
        const parts = [
            ["pages", "pages"],
            ["hosting", "hosting"],
            ["hostingCost", "hosting cost"],
        ]
            .map(([key, label]) => (text(item[key], 60) ? `${label}: ${text(item[key], 60)}` : null))
            .filter(Boolean);
        return parts.length ? ` (${parts.join("; ")})` : "";
    };

    const lines: string[] = [];
    if (currency) lines.push(`All prices are in ${currency}.`);
    const offer = obj(d.offer);
    if (offer.enabled === true && text(offer.text, 200)) lines.push(`Current offer: ${text(offer.text, 200)}`);

    const packages = list(d.packages);
    if (packages.length) {
        lines.push(`### ${heading("packages", "Website packages")}`);
        for (const p of packages) {
            const name = text(p.name, 100);
            if (!name) continue;
            const description = text(p.description, 220);
            lines.push(`- ${name}: ${priceOf(p)}${description ? ` — ${description}` : ""}${specs(p)}${p.featured === true ? " [recommended]" : ""}`);
        }
    }

    const addons = list(d.addons);
    if (addons.length) {
        lines.push(`### ${heading("addons", "Paid add-ons")} (added to a package)`);
        for (const a of addons) {
            const name = text(a.name, 100);
            if (!name) continue;
            const description = text(a.description, 200);
            lines.push(`- ${name}: ${priceOf(a)}${description ? ` — ${description}` : ""}`);
        }
    }

    const services = list(d.services);
    if (services.length) {
        lines.push(`### ${heading("services", "Custom-quote services")}`);
        for (const s of services) {
            const name = text(s.name, 100);
            if (!name) continue;
            const description = text(s.description, 220);
            lines.push(`- ${name}: ${priceOf(s)}${description ? ` — ${description}` : ""}${specs(s)}`);
        }
    }

    const info = list(d.infoCards);
    if (info.length) {
        lines.push(`### ${heading("info", "Good to know")}`);
        for (const card of info) {
            const body = text(card.text, 300);
            if (body) lines.push(`- ${text(card.title, 80) ? `${text(card.title, 80)}: ` : ""}${body}`);
        }
    }

    const faq = compact ? [] : list(d.faq);
    if (faq.length) {
        lines.push(`### ${heading("faq", "Frequently asked questions")}`);
        for (const item of faq) {
            const q = text(item.question, 200);
            const a = text(item.answer, 400);
            if (q && a) lines.push(`- Q: ${q} A: ${a}`);
        }
    }

    const contact = obj(d.contact);
    const numbers = list(contact.numbers)
        .map((n) => (text(n.number, 30) ? `${text(n.number, 30)}${text(n.label, 30) ? ` (${text(n.label, 30)}${n.whatsapp === true ? ", WhatsApp" : ""})` : n.whatsapp === true ? " (WhatsApp)" : ""}` : null))
        .filter(Boolean);
    if (numbers.length) lines.push(`Phone numbers on the pricing page: ${numbers.join(", ")}`);

    return lines;
}

function formatPricingGeneric(d: Record<string, unknown>): string[] {
    const lines: string[] = [];
    const topNotes = [...DESCRIPTION_KEYS, ...NOTE_KEYS, "currency"].map((k) => (text(d[k], 300) ? `${k}: ${text(d[k], 300)}` : null)).filter(Boolean) as string[];

    const walk = (value: unknown, group: string | undefined, depth: number) => {
        if (depth > 3 || lines.length >= 60) return;
        if (Array.isArray(value)) {
            for (const entry of value) {
                if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
                const item = entry as Record<string, unknown>;
                if (isHidden(item)) continue;
                const line = formatPriced(item, group);
                if (line) lines.push(line);
                // Nested lists, e.g. a category with its own packages
                const childGroup = firstText(item, NAME_KEYS, 80) || group;
                for (const [key, child] of Object.entries(item)) {
                    if (Array.isArray(child) && !FEATURE_KEYS.includes(key)) walk(child, childGroup, depth + 1);
                }
            }
            return;
        }
        if (value && typeof value === "object") {
            for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
                if (Array.isArray(child) && !FEATURE_KEYS.includes(key)) walk(child, group, depth + 1);
                else if (child && typeof child === "object" && !Array.isArray(child)) walk(child, group, depth + 1);
            }
        }
    };

    walk(d, undefined, 0);
    return [...topNotes.map((n) => `- ${n}`), ...lines];
}
