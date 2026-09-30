// site_content/settings: the site identity and the owner's details. The public site reads these field
// names directly (BrandingProvider, SEO, contact links, the assistant), so they must never be renamed.

export const SETTINGS_DOC = "site_content/settings" as const;

export const SETTINGS_FIELDS = [
    "siteName",
    "siteDescription",
    "siteLogo",
    "ownerName",
    "ownerTitle",
    "ownerRole",
    "ownerBio",
    "ownerLocation",
    "availabilityStatus",
    "ownerBadges",
    "githubUrl",
    "linkedinUrl",
    "emailAddress",
    "whatsappNumber",
    "phoneDisplay",
] as const;

export type SettingsField = (typeof SETTINGS_FIELDS)[number];
export type SettingsValues = Record<SettingsField, string>;

const toText = (value: unknown) => (typeof value === "string" ? value : typeof value === "number" ? String(value) : "");

/** Every field as text ("" when it isn't saved yet), exactly as the site will show it. */
export function normalizeSettings(raw: Record<string, unknown> | null): SettingsValues {
    return Object.fromEntries(SETTINGS_FIELDS.map((key) => [key, toText(raw?.[key])])) as SettingsValues;
}

const REQUIRED: Partial<Record<SettingsField, string>> = {
    siteName: "اكتب اسم الموقع.",
    ownerName: "اكتب اسمك.",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEB_URL = /^https?:\/\/[^\s/]+\.[^\s]+$/i;

/** Why a value can't be saved, or undefined when it's fine. */
export function settingsError(key: SettingsField, raw: string): string | undefined {
    const value = raw.trim();
    if (!value) return REQUIRED[key];

    switch (key) {
        case "emailAddress":
            return EMAIL.test(value) ? undefined : "الإيميل مش مكتوب صح، مثال: name@example.com";
        case "whatsappNumber": {
            // The site keeps only the digits (wa.me/<digits>), so spaces and + are fine
            const digits = value.replace(/\D/g, "");
            if (/[^\d\s+()-]/.test(value) || digits.length < 8 || digits.length > 15) {
                return "اكتب الرقم بالأرقام بالصيغة الدولية، مثال: 201024531452";
            }
            return digits.startsWith("0") ? "ابدأ بكود الدولة من غير الصفر، مثلاً 20 لمصر." : undefined;
        }
        case "githubUrl":
        case "linkedinUrl":
            return WEB_URL.test(value) ? undefined : "اكتب الرابط كامل، بيبدأ بـ https://";
        default:
            return undefined;
    }
}
