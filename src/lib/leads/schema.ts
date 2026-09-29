// Shared lead model — safe to import on the client and the server.
// Every place that collects a lead (popup, contact form, pricing, chat assistant)
// goes through `POST /api/leads` or `saveLead()`, so all leads look the same.

export type LeadSource = "popup" | "contact" | "pricing" | "chat" | "other";

export type LeadStatus = "new" | "contacted" | "closed";

export interface LeadInput {
    name: string;
    phone: string;
    /** What the visitor needs, e.g. a pricing package name or a service */
    service?: string;
    /** Free text the visitor typed (optional) */
    message?: string;
    source: LeadSource;
    /** Page the lead was captured on, e.g. "/pricing" */
    page?: string;
}

export interface LeadRecord extends LeadInput {
    id: string;
    status: LeadStatus;
    userId?: string | null;
    userEmail?: string | null;
    sessionId?: string | null;
    capturedAt?: unknown;
    updatedAt?: unknown;
}

export const LEAD_LIMITS = {
    nameMin: 2,
    nameMax: 80,
    phoneMinDigits: 7,
    phoneMaxDigits: 15,
    serviceMax: 120,
    messageMax: 1000,
} as const;

/**
 * Keeps digits and a leading "+"; turns Arabic/Persian digits into Latin ones.
 * Egyptian mobiles typed the local way (01xxxxxxxxx) become +201xxxxxxxxx so call and
 * WhatsApp links work — most visitors are in Egypt. Other local formats are left as typed.
 */
export function normalizePhone(raw: string): string {
    const latin = String(raw || "")
        .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
        .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
        .trim();
    const hasPlus = latin.startsWith("+") || latin.startsWith("00");
    const digits = latin.replace(/\D/g, "").replace(/^00/, "");
    if (!hasPlus && /^01[0125]\d{8}$/.test(digits)) return `+20${digits.slice(1)}`;
    if (!hasPlus && /^201[0125]\d{8}$/.test(digits)) return `+${digits}`;
    return (hasPlus ? "+" : "") + digits;
}

export function isValidPhone(raw: string): boolean {
    const digits = normalizePhone(raw).replace(/\D/g, "");
    return digits.length >= LEAD_LIMITS.phoneMinDigits && digits.length <= LEAD_LIMITS.phoneMaxDigits;
}

export type LeadFieldErrors = Partial<Record<"name" | "phone" | "service" | "message", string>>;

/** Returns field errors (empty object when valid). Messages are plain English defaults. */
export function validateLead(input: Pick<LeadInput, "name" | "phone" | "service" | "message">): LeadFieldErrors {
    const errors: LeadFieldErrors = {};
    const name = (input.name || "").trim();
    if (name.length < LEAD_LIMITS.nameMin) errors.name = "Please enter your name.";
    else if (name.length > LEAD_LIMITS.nameMax) errors.name = "That name is too long.";
    if (!isValidPhone(input.phone || "")) errors.phone = "Please enter a valid phone number.";
    if ((input.service || "").length > LEAD_LIMITS.serviceMax) errors.service = "Please shorten this.";
    if ((input.message || "").length > LEAD_LIMITS.messageMax) errors.message = "Please shorten your message.";
    return errors;
}

/** Links the owner uses to reach a lead. */
export function leadContactLinks(phone: string) {
    const digits = normalizePhone(phone).replace(/\D/g, "");
    return {
        call: `tel:+${digits}`,
        whatsapp: `https://wa.me/${digits}`,
        telegram: `https://t.me/+${digits}`,
    };
}
