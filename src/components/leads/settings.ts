// Texts and behavior of the lead popup and the contact form, stored in `site_content/lead_capture`
// and edited at /admin/leads/capture. Safe to import on the server and the client.

export const LEAD_CAPTURE_DOC = { collection: "site_content", id: "lead_capture" } as const;

export interface LeadCaptureSettings {
    /** Show the welcome popup automatically (the "open-lead-modal" event works either way) */
    enabled: boolean;
    /** Seconds after the page loads before the popup appears */
    delaySeconds: number;

    // Popup greeting
    title: string;
    subtitle: string;

    // Form (shared by the popup and the contact page)
    nameLabel: string;
    namePlaceholder: string;
    nameError: string;
    phoneLabel: string;
    phonePlaceholder: string;
    phoneError: string;
    serviceLabel: string;
    servicePlaceholder: string;
    serviceSuggestions: string[];
    privacyNote: string;
    submitLabel: string;
    sendingLabel: string;
    errorMessage: string;
    maybeLaterLabel: string;

    // Thank-you state (shared). `{name}` in the title becomes the visitor's first name.
    successTitle: string;
    successMessage: string;
    whatsappLabel: string;
    closeLabel: string;

    // Contact page
    contactTitle: string;
    contactDescription: string;
    contactFormTitle: string;
    contactFormDescription: string;
    contactMessageLabel: string;
    contactMessagePlaceholder: string;
    contactSubmitLabel: string;
    contactDetailsTitle: string;
}

/** Seeded into Firestore; used in code only when the database can't be read. */
export const DEFAULT_LEAD_CAPTURE: LeadCaptureSettings = {
    enabled: true,
    delaySeconds: 3,

    title: "Welcome to GTech",
    subtitle: "I'm Gamal. Leave your name and number and I'll get back to you personally.",

    nameLabel: "Your name",
    namePlaceholder: "Full name",
    nameError: "Please enter your name.",
    phoneLabel: "Phone number",
    phonePlaceholder: "+20 1XX XXX XXXX",
    phoneError: "Please enter a valid phone number.",
    serviceLabel: "What do you need? (optional)",
    servicePlaceholder: "e.g. a website or an ERP system",
    serviceSuggestions: [
        "Business analysis",
        "ERP system",
        "CRM system",
        "Website",
        "Hosting",
        "Shopify theme",
        "WordPress website",
    ],
    privacyNote: "Your number is only used to contact you about your request.",
    submitLabel: "Send",
    sendingLabel: "Sending…",
    errorMessage: "Something went wrong. Please try again in a moment.",
    maybeLaterLabel: "Maybe later",

    successTitle: "Thank you, {name}!",
    successMessage: "I've received your details and will contact you soon.",
    whatsappLabel: "Chat on WhatsApp",
    closeLabel: "Close",

    contactTitle: "Contact",
    contactDescription: "We welcome discussing collaboration and strategic partnership opportunities.",
    contactFormTitle: "Leave your number",
    contactFormDescription: "I'll get back to you personally by phone, WhatsApp or Telegram.",
    contactMessageLabel: "Message (optional)",
    contactMessagePlaceholder: "Tell me briefly about your project or what you need.",
    contactSubmitLabel: "Send message",
    contactDetailsTitle: "Contact details",
};

export const LEAD_CAPTURE_LIMITS = {
    delayMax: 60,
    suggestionsMax: 20,
    suggestionMax: 60,
} as const;

type TextKey = { [K in keyof LeadCaptureSettings]: LeadCaptureSettings[K] extends string ? K : never }[keyof LeadCaptureSettings];

const TEXT_KEYS = (Object.keys(DEFAULT_LEAD_CAPTURE) as (keyof LeadCaptureSettings)[]).filter(
    (key): key is TextKey => typeof DEFAULT_LEAD_CAPTURE[key] === "string"
);

/**
 * Turns whatever is stored in Firestore into complete settings: unknown fields are dropped,
 * and a missing or empty text falls back to its default so the UI never shows a blank label.
 */
export function normalizeLeadCapture(raw: unknown): LeadCaptureSettings {
    const data = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    const settings: LeadCaptureSettings = { ...DEFAULT_LEAD_CAPTURE, serviceSuggestions: [...DEFAULT_LEAD_CAPTURE.serviceSuggestions] };

    for (const key of TEXT_KEYS) {
        const value = data[key];
        if (typeof value === "string" && value.trim()) settings[key] = value.trim();
    }

    if (typeof data.enabled === "boolean") settings.enabled = data.enabled;

    const delay = Number(data.delaySeconds);
    if (data.delaySeconds !== undefined && data.delaySeconds !== null && Number.isFinite(delay)) {
        settings.delaySeconds = Math.min(LEAD_CAPTURE_LIMITS.delayMax, Math.max(0, Math.round(delay)));
    }

    if (Array.isArray(data.serviceSuggestions)) {
        settings.serviceSuggestions = cleanSuggestions(data.serviceSuggestions);
    }

    return settings;
}

/** Trims, drops blanks and duplicates, and caps the list. */
export function cleanSuggestions(list: unknown[]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const item of list) {
        if (typeof item !== "string") continue;
        const value = item.trim().slice(0, LEAD_CAPTURE_LIMITS.suggestionMax);
        const key = value.toLowerCase();
        if (!value || seen.has(key)) continue;
        seen.add(key);
        result.push(value);
        if (result.length >= LEAD_CAPTURE_LIMITS.suggestionsMax) break;
    }
    return result;
}

/** Replaces `{name}` with the visitor's first name ("Thank you, {name}!" → "Thank you, Sara!"). */
export function fillName(template: string, fullName: string): string {
    const firstName = fullName.trim().split(/\s+/)[0] || "";
    if (firstName) return template.replace(/\{name\}/g, firstName);
    return template.replace(/[\s,]*\{name\}/g, "").trim();
}
