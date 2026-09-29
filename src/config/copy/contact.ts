import type { CopySection } from "@/lib/copy/types";

export const contactCopy = {
    id: "contact",
    title: "Contact page",
    description:
        "The page title and description, the form texts and the “Contact details” heading are edited in /admin/leads/capture. Your phone, email, links and location come from /admin/settings.",
    fields: [
        { key: "seoTitle", label: "Google title of the contact page", default: "Contact" },
        {
            key: "seoDescription",
            label: "Google description of the contact page",
            type: "textarea",
            default:
                "Get in touch with GTech about business analysis, an ERP or CRM system, a website, hosting, a Shopify theme or a WordPress site.",
        },
        { key: "whatsappLabel", label: "Contact details: label above the WhatsApp number", default: "WhatsApp" },
        { key: "emailLabel", label: "Contact details: label above the email address", default: "Email" },
        { key: "githubLabel", label: "Contact details: label above the GitHub link", default: "GitHub" },
        { key: "linkedinLabel", label: "Contact details: label above the LinkedIn link", default: "LinkedIn" },
        { key: "locationLabel", label: "Contact details: label above your location", default: "Location" },
    ],
} as const satisfies CopySection;
