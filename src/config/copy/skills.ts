import type { CopySection } from "@/lib/copy/types";

export const skillsCopy = {
    id: "skills",
    title: "Skills page",
    description: "The service cards, tech stack and software list are edited in /admin/skills.",
    fields: [
        { key: "seoTitle", label: "Google title of the skills page", default: "Services & skills" },
        {
            key: "seoDescription",
            label: "Google description of the skills page",
            type: "textarea",
            default:
                "The services GTech offers — business analysis, ERP and CRM systems, websites (Next.js and WordPress), Shopify themes and hosting — and the tools behind them.",
        },
        { key: "title", label: "Skills page: title", default: "Skills" },
        {
            key: "description",
            label: "Skills page: text under the title",
            type: "textarea",
            default: "The services GTech offers and the tools behind them.",
        },
        { key: "techStackTitle", label: "Skills page: title above the tech stack", default: "Tech stack" },
        { key: "softwareTitle", label: "Skills page: title above the software list", default: "Software proficiency" },
        { key: "toolsTitle", label: "Skills page: title above the daily tools", default: "Daily productivity tools" },
        {
            key: "toolsList",
            label: "Skills page: daily tools",
            type: "textarea",
            default: "GeminiPro | 60%",
            hint: "One tool per line, written as name | level (for example: ChatGPT | Daily). Leave empty to hide this block.",
        },
        { key: "empty", label: "Skills page: message when nothing has been added yet", default: "Skills will be listed here soon." },
    ],
} as const satisfies CopySection;
