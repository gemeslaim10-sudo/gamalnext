import { defaultHeroData } from "@/components/sections/hero/HeroConfig";

// site_content/hero: the intro at the top of the profile page (read by src/components/sections/HeroClient.tsx).
// Empty fields fall back to the site settings there (name, title, bio, photo). The document also holds
// an old `whatsappNumber` the site no longer reads (the number lives in the settings); it's left untouched.

export const HERO_DOC = "site_content/hero" as const;

export const HERO_FIELDS = ["avatarImage", "heroTitle", "heroSubtitle", "heroDescription", "resumeLink"] as const;

export type HeroField = (typeof HERO_FIELDS)[number];
export type HeroValues = Record<HeroField, string>;

const toText = (value: unknown) => (typeof value === "string" ? value : "");

/** A missing document shows what visitors see (the site's defaults). */
export function normalizeHero(raw: Record<string, unknown> | null): HeroValues {
    const source: Record<string, unknown> = raw ?? { ...defaultHeroData };
    const values = Object.fromEntries(HERO_FIELDS.map((key) => [key, toText(source[key])])) as HeroValues;
    // An anchor like the old "#projects" default means "no CV button" on the site, same as empty
    if (/^\/?#/.test(values.resumeLink.trim())) values.resumeLink = "";
    return values;
}

// Keeps the example path in the message below readable inside the right-to-left sentence
const LEFT_TO_RIGHT_MARK = String.fromCharCode(0x200e);

/** Why a value can't be saved, or undefined when it's fine. */
export function heroError(key: HeroField, raw: string): string | undefined {
    const value = raw.trim();
    if (key === "resumeLink" && value && !/^(https?:\/\/\S+|\/\S*)$/i.test(value)) {
        return `اكتب رابط كامل بيبدأ بـ https://، أو مسار ملف في الموقع زي ${LEFT_TO_RIGHT_MARK}/cv.pdf`;
    }
    return undefined;
}
