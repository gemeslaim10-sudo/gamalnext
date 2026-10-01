// Content model of the service pages (/services/…, /ar/services/…), stored as one Firestore
// document: `site_content/services`, edited from /admin/services.

export type ServiceLang = "en" | "ar";
export const SERVICE_LANGS: readonly ServiceLang[] = ["en", "ar"];

export interface ServiceStep {
    title: string;
    text: string;
}

export interface ServiceFaq {
    question: string;
    answer: string;
}

/** One service page in one language. */
export interface ServiceCopy {
    /** Short name for cards, links and breadcrumbs, e.g. "Custom ERP development" */
    name: string;
    /** A word or two for compact lists, e.g. "ERP systems" (the service links on the home page); empty = the name */
    label: string;
    /** One line under the name on cards and in the services list */
    summary: string;
    /** Search result title (the site name is added after it) */
    seoTitle: string;
    seoDescription: string;
    h1: string;
    /** Answer-first opening: what it is and who it's for. Paragraphs are separated by a blank line. */
    intro: string;
    audienceTitle: string;
    audience: string[];
    problemsTitle: string;
    problems: string[];
    includesTitle: string;
    includes: string[];
    processTitle: string;
    process: ServiceStep[];
    faqTitle: string;
    faqs: ServiceFaq[];
    ctaTitle: string;
    ctaText: string;
}

export interface ServiceItem {
    /** The address: /services/{slug} (and /ar/services/{slug}) */
    slug: string;
    visible: boolean;
    /** Ids of pricing packages/services (site_content/pricing) whose prices this page shows */
    pricingIds: string[];
    /** Comma separated words that pick related projects (matched in their titles, tags and categories) */
    projectKeywords: string;
    /** Comma separated words that pick related articles (matched in their tags and titles) */
    articleKeywords: string;
    en: ServiceCopy;
    /** The Arabic page; without an Arabic name and H1 there's no Arabic page */
    ar: ServiceCopy;
}

/** The services list page, per language. */
export interface ServicesIndexCopy {
    seoTitle: string;
    seoDescription: string;
    h1: string;
    intro: string;
}

/** Small texts repeated on every service page, per language. */
export interface ServiceLabels {
    home: string;
    services: string;
    startingFrom: string;
    /** Before a starting price, e.g. "From" */
    priceFrom: string;
    allPrices: string;
    relatedProjects: string;
    relatedArticles: string;
    otherServices: string;
    ctaButton: string;
    contactLink: string;
    learnMore: string;
    /** Link to the same page in the other language */
    otherLanguage: string;
}

export interface ServicesContent {
    index: Record<ServiceLang, ServicesIndexCopy>;
    labels: Record<ServiceLang, ServiceLabels>;
    items: ServiceItem[];
}
