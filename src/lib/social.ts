import type { BrandingSettings } from "@/components/providers/BrandingProvider";

export type SocialKind = "whatsapp" | "email" | "github" | "linkedin";

export interface SocialLink {
    kind: SocialKind;
    label: string;
    href: string;
    /** Human readable value, e.g. the phone number or the email address */
    display: string;
}

/**
 * Builds the owner's contact links from the dashboard settings.
 * Used by the profile card, the footer and the contact page so they never drift apart.
 */
export function getSocialLinks(branding: BrandingSettings | null | undefined): SocialLink[] {
    if (!branding) return [];
    const links: SocialLink[] = [];

    const whatsapp = String(branding.whatsappNumber || "").replace(/[^\d]/g, "");
    if (whatsapp) {
        links.push({
            kind: "whatsapp",
            label: "WhatsApp",
            href: `https://wa.me/${whatsapp}`,
            display: String(branding.phoneDisplay || `+${whatsapp}`),
        });
    }
    if (branding.emailAddress) {
        links.push({ kind: "email", label: "Email", href: `mailto:${branding.emailAddress}`, display: branding.emailAddress });
    }
    if (branding.githubUrl) {
        links.push({ kind: "github", label: "GitHub", href: branding.githubUrl, display: stripProtocol(branding.githubUrl) });
    }
    if (branding.linkedinUrl) {
        links.push({ kind: "linkedin", label: "LinkedIn", href: branding.linkedinUrl, display: stripProtocol(branding.linkedinUrl) });
    }
    return links;
}

function stripProtocol(url: string) {
    return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
