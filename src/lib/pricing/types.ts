// Content model of the pricing page, stored as one Firestore document: `site_content/pricing`.
// Every text the visitor sees on /pricing lives here and is edited from /admin/pricing.

/** A website package or a custom-quote service, shown as a card. */
export interface PricingItem {
    id: string;
    name: string;
    /** Price in the page currency. `null` means there is no fixed price. */
    price: number | null;
    /** Shows the "custom quote" label (and a "request a quote" button) instead of a price */
    customQuote: boolean;
    /** The price is where it starts (systems priced by scope): the "from" label shows before it */
    priceFrom?: boolean;
    /** Short note under the price */
    description: string;
    // Spec list — an empty value hides that row
    pages: string;
    hosting: string;
    hostingCost: string;
    /** Subtle emphasis: stronger border, a badge and the primary button */
    featured: boolean;
    visible: boolean;
}

/** Keys of the spec rows shown on a card. They double as keys of their labels in `PricingLabels`. */
export const SPEC_KEYS = ["pages", "hosting", "hostingCost"] as const;
export type SpecKey = (typeof SPEC_KEYS)[number];

/** A paid extra, usually with a limited-time discount. */
export interface PricingAddon {
    id: string;
    name: string;
    description: string;
    /** Price before the discount. Empty (or not higher than `price`) = no discount shown. */
    originalPrice: number | null;
    price: number | null;
    customQuote: boolean;
    featured: boolean;
    visible: boolean;
}

export interface PricingInfoCard {
    id: string;
    title: string;
    text: string;
    visible: boolean;
}

export interface PricingFaqItem {
    id: string;
    question: string;
    answer: string;
    visible: boolean;
}

export interface PricingContactNumber {
    id: string;
    /** e.g. "Primary" */
    label: string;
    /** As the visitor should read it, e.g. "01024531452" or "+20 102 453 1452" */
    number: string;
    /** Adds a WhatsApp button next to the call button */
    whatsapp: boolean;
}

export interface PricingSectionText {
    title: string;
    description: string;
}

export interface PricingLabels extends Record<SpecKey, string> {
    /** Shown before every amount, e.g. "USD" */
    currency: string;
    /** Before a starting price, e.g. "From" */
    priceFrom: string;
    customQuote: string;
    request: string;
    requestQuote: string;
    featured: string;
    /** Link from a priced item to its service page, e.g. "Learn more" */
    learnMore: string;
    /** Discount badge; `{percent}` is replaced with the computed discount */
    discount: string;
    /** Read by screen readers before a struck-through price */
    originalPrice: string;
    call: string;
    whatsapp: string;
    email: string;
    sendEmail: string;
}

export interface PricingContent {
    seo: {
        title: string;
        description: string;
        /** Comma separated */
        keywords: string;
    };
    header: {
        /** Small line above the title, e.g. the brand */
        eyebrow: string;
        title: string;
        description: string;
    };
    offer: {
        enabled: boolean;
        text: string;
    };
    labels: PricingLabels;
    sections: Record<PricingSectionKey, PricingSectionText>;
    packages: PricingItem[];
    addons: PricingAddon[];
    services: PricingItem[];
    infoCards: PricingInfoCard[];
    faq: PricingFaqItem[];
    contact: {
        /** Calling code without "+", used to turn local numbers (01…) into tel: and wa.me links */
        countryCode: string;
        numbers: PricingContactNumber[];
        /** Optional; hidden when empty */
        email: string;
    };
}

export const SECTION_KEYS = ["packages", "addons", "services", "info", "faq", "contact"] as const;
export type PricingSectionKey = (typeof SECTION_KEYS)[number];
