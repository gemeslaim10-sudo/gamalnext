import type { CopySection } from "@/lib/copy/types";

const SITE_NAME_HINT = "{siteName} = site name from Settings.";

export const seoCopy = {
    id: "seo",
    title: "SEO (page titles & descriptions for Google)",
    description:
        "Site-wide defaults for Google and for shared links. A page with its own Google title or description (set in its own section) uses that instead.",
    fields: [
        {
            key: "defaultTitle",
            label: "Site title in Google (pages without their own title)",
            default: "GTech — Business systems, ERP & CRM, websites and hosting",
            hint: SITE_NAME_HINT,
        },
        {
            key: "titleTemplate",
            label: "Title pattern for every page in Google and the browser tab",
            default: "{title} | GTech",
            hint: `{title} = the page's own title, e.g. “Projects | GTech”. ${SITE_NAME_HINT}`,
        },
        {
            key: "description",
            label: "Site description in Google (pages without their own description)",
            type: "textarea",
            default:
                "GTech offers business analysis and builds ERP and CRM systems for companies and institutions, along with websites and hosting — plus professional Shopify themes at much lower prices than the Shopify Theme Store, and WordPress sites.",
            hint: SITE_NAME_HINT,
        },
        {
            key: "keywords",
            label: "Search keywords (comma separated)",
            type: "textarea",
            default:
                "GTech, Gamal Abdelaty, business analysis, ERP systems, CRM systems, business systems, websites, web hosting, Shopify themes, WordPress",
        },
        {
            key: "ogSiteName",
            label: "Site name on shared links (WhatsApp, Facebook, LinkedIn, X)",
            default: "GTech",
            hint: SITE_NAME_HINT,
        },
        {
            key: "shareImageTagline",
            label: "Line under the site name on the shared-link picture",
            default: "Business analysis · ERP & CRM systems · Websites · Hosting",
            hint: "Shared links show each page's own title and description; the picture shows the site name, this line and your photo from Settings.",
        },
        {
            key: "twitterHandle",
            label: "X (Twitter) account shown on link previews",
            default: "",
            hint: "For example @yourname. Leave empty if you don't use X.",
        },
    ],
} as const satisfies CopySection;
