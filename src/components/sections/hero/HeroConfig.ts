import type { CopyKey } from '@/config/copy';

/** Shape of site_content/hero, edited in /admin/content. */
export interface HeroData {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    whatsappNumber: string;
    resumeLink: string;
    avatarImage: string;
}

/** Used only when the hero document can't be read. The real content lives in Firestore. */
export const defaultHeroData: HeroData = {
    heroTitle: "GTech",
    heroSubtitle: "Business systems and websites for companies and institutions",
    heroDescription:
        "Business analysis, ERP and CRM systems, websites and hosting — built around how your organization works. Plus WordPress sites, and professional Shopify themes at a fraction of Shopify Theme Store prices.",
    whatsappNumber: "201024531452",
    resumeLink: "#projects",
    avatarImage: ""
};

/** Headline numbers under the intro: editable texts (/admin/copy → Profile page); an empty number hides the stat. */
export const HERO_STATS: readonly (readonly [value: CopyKey, label: CopyKey])[] = [
    ["profile.stat1Value", "profile.stat1Label"],
    ["profile.stat2Value", "profile.stat2Label"],
    ["profile.stat3Value", "profile.stat3Label"],
    ["profile.stat4Value", "profile.stat4Label"],
];
