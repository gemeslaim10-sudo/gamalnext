import type { CopySection } from "@/lib/copy/types";

export const skillsCopy = {
    id: "skills",
    title: "Skills page",
    description: "The service cards, tech stack and software list are edited in /admin/skills.",
    fields: [
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
        { key: "empty", label: "Skills page: message when nothing has been added yet", default: "Skills will be listed here soon." },
    ],
} as const satisfies CopySection;
