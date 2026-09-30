import { DEFAULT_PRICING } from "./defaults";
import {
    SECTION_KEYS,
    type PricingAddon,
    type PricingContactNumber,
    type PricingContent,
    type PricingFaqItem,
    type PricingInfoCard,
    type PricingItem,
    type PricingLabels,
} from "./types";

// ── Reading stored data ───────────────────────────────────────────────────────
// Firestore data is untyped, so everything read from the document goes through
// `normalizePricing`: missing top-level texts fall back to the defaults (e.g. a field
// added after the document was saved), while values the owner cleared stay empty.

type Raw = Record<string, unknown>;

const asRecord = (value: unknown): Raw =>
    value !== null && typeof value === "object" && !Array.isArray(value) ? (value as Raw) : {};

const text = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);

const flag = (value: unknown, fallback: boolean) => (typeof value === "boolean" ? value : fallback);

/** A non-negative amount, or null. Accepts numeric strings such as "3,000". */
export function toAmount(value: unknown): number | null {
    if (typeof value === "number") return Number.isFinite(value) && value >= 0 ? value : null;
    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value.replace(/[,\s]/g, ""));
        return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
    }
    return null;
}

/** Maps a stored list, falling back to the defaults only when the field is missing entirely. */
function list<T extends { id: string }>(value: unknown, fallback: T[], prefix: string, map: (raw: Raw, id: string) => T): T[] {
    if (!Array.isArray(value)) return fallback;
    const seen = new Set<string>();
    return value.map((entry, index) => {
        const raw = asRecord(entry);
        let id = text(raw.id).trim() || `${prefix}-${index + 1}`;
        if (seen.has(id)) id = `${id}-${index + 1}`;
        seen.add(id);
        return map(raw, id);
    });
}

const toItem = (raw: Raw, id: string): PricingItem => ({
    id,
    name: text(raw.name),
    price: toAmount(raw.price),
    customQuote: flag(raw.customQuote, false),
    priceFrom: flag(raw.priceFrom, false),
    description: text(raw.description),
    pages: text(raw.pages),
    hosting: text(raw.hosting),
    hostingCost: text(raw.hostingCost),
    featured: flag(raw.featured, false),
    visible: flag(raw.visible, true),
});

const toAddon = (raw: Raw, id: string): PricingAddon => ({
    id,
    name: text(raw.name),
    description: text(raw.description),
    originalPrice: toAmount(raw.originalPrice),
    price: toAmount(raw.price),
    customQuote: flag(raw.customQuote, false),
    featured: flag(raw.featured, false),
    visible: flag(raw.visible, true),
});

const toInfoCard = (raw: Raw, id: string): PricingInfoCard => ({
    id,
    title: text(raw.title),
    text: text(raw.text),
    visible: flag(raw.visible, true),
});

const toFaqItem = (raw: Raw, id: string): PricingFaqItem => ({
    id,
    question: text(raw.question),
    answer: text(raw.answer),
    visible: flag(raw.visible, true),
});

const toContactNumber = (raw: Raw, id: string): PricingContactNumber => ({
    id,
    label: text(raw.label),
    number: text(raw.number),
    whatsapp: flag(raw.whatsapp, false),
});

/** Turns the raw Firestore document into complete, typed page content. */
export function normalizePricing(data: unknown, defaults: PricingContent = DEFAULT_PRICING): PricingContent {
    const raw = asRecord(data);
    const seo = asRecord(raw.seo);
    const header = asRecord(raw.header);
    const offer = asRecord(raw.offer);
    const labels = asRecord(raw.labels);
    const sections = asRecord(raw.sections);
    const contact = asRecord(raw.contact);

    const normalizedLabels = Object.fromEntries(
        (Object.keys(defaults.labels) as (keyof PricingLabels)[]).map((key) => [key, text(labels[key], defaults.labels[key])])
    ) as unknown as PricingLabels;

    const normalizedSections = Object.fromEntries(
        SECTION_KEYS.map((key) => {
            const section = asRecord(sections[key]);
            return [
                key,
                {
                    title: text(section.title, defaults.sections[key].title),
                    description: text(section.description, defaults.sections[key].description),
                },
            ];
        })
    ) as PricingContent["sections"];

    return {
        seo: {
            title: text(seo.title, defaults.seo.title),
            description: text(seo.description, defaults.seo.description),
            keywords: text(seo.keywords, defaults.seo.keywords),
        },
        header: {
            eyebrow: text(header.eyebrow, defaults.header.eyebrow),
            title: text(header.title, defaults.header.title),
            description: text(header.description, defaults.header.description),
        },
        offer: {
            enabled: flag(offer.enabled, defaults.offer.enabled),
            text: text(offer.text, defaults.offer.text),
        },
        labels: normalizedLabels,
        sections: normalizedSections,
        packages: list(raw.packages, defaults.packages, "package", toItem),
        addons: list(raw.addons, defaults.addons, "addon", toAddon),
        services: list(raw.services, defaults.services, "service", toItem),
        infoCards: list(raw.infoCards, defaults.infoCards, "info", toInfoCard),
        faq: list(raw.faq, defaults.faq, "faq", toFaqItem),
        contact: {
            countryCode: text(contact.countryCode, defaults.contact.countryCode),
            numbers: list(contact.numbers, defaults.contact.numbers, "number", toContactNumber),
            email: text(contact.email, defaults.contact.email),
        },
    };
}

// ── Display helpers ───────────────────────────────────────────────────────────

/** Items the visitor should see: switched on and named. */
export function isListed(item: { name: string; visible: boolean }) {
    return item.visible && item.name.trim() !== "";
}

/** The amount to show, or null when the item shows the "custom quote" label instead. */
export function fixedPrice(item: { price: number | null; customQuote: boolean }): number | null {
    return item.customQuote ? null : item.price;
}

const amountFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

/** 3000 → "3,000" */
export function formatAmount(amount: number) {
    return amountFormat.format(amount);
}

/** 3000, "USD" → "USD 3,000" (non-breaking space, so the two never wrap apart). */
export function formatPrice(amount: number, currency: string) {
    const value = formatAmount(amount);
    return currency.trim() ? `${currency.trim()} ${value}` : value;
}

/** Whole-number discount, or null when there isn't a real one. */
export function discountPercent(originalPrice: number | null, price: number | null): number | null {
    if (originalPrice === null || price === null || originalPrice <= 0 || price >= originalPrice) return null;
    return Math.round((1 - price / originalPrice) * 100);
}

/** "{percent}% off" + { percent: 70 } → "70% off" */
export function fillTemplate(template: string, values: Record<string, string | number>) {
    return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/**
 * Builds call and WhatsApp links for a number written the way visitors read it.
 * Local numbers ("01024531452") get the country code ("20") instead of the leading zero.
 */
export function phoneLinks(number: string, countryCode: string) {
    const latin = number
        .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
        .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
        .trim();
    let digits = latin.replace(/\D/g, "");
    if (!digits) return null;

    const code = countryCode.replace(/\D/g, "");
    let international = true;
    if (!latin.startsWith("+")) {
        if (digits.startsWith("00")) digits = digits.slice(2);
        else if (digits.startsWith("0")) {
            if (code) digits = code + digits.slice(1);
            else international = false;
        }
    }

    return {
        tel: international ? `tel:+${digits}` : `tel:${digits}`,
        whatsapp: `https://wa.me/${digits}`,
        /** Digits used in the links, e.g. "201024531452" */
        digits,
    };
}

/** Unique enough id for a list item created in the dashboard. */
export function newId(prefix: string) {
    return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
