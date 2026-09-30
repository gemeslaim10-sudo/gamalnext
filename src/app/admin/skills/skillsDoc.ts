import { BarChart, BarChart3, Code, Database, FileText, LineChart, Search, type LucideIcon } from "lucide-react";
import type { SkillItem, SoftwareItem, TechStackItem, ToolItem } from "@/components/sections/skills/data";

// site_content/skills: the four lists on the skills page (the services also show on the profile page).
// The item shapes are the ones the site reads (src/components/sections/skills/data.ts). Each editor
// saves only its own list, merged into the document, so the other lists are never touched.

export type { SkillItem, SoftwareItem, TechStackItem, ToolItem };

export const SKILLS_DOC = "site_content/skills" as const;

export interface SkillsLists {
    mainSkills: SkillItem[];
    techStack: TechStackItem[];
    software: SoftwareItem[];
    tools: ToolItem[];
}

export type SkillsListKey = keyof SkillsLists;

type Raw = Record<string, unknown>;

const text = (value: unknown) => (typeof value === "string" ? value : typeof value === "number" ? String(value) : "");

const objects = (value: unknown): Raw[] =>
    Array.isArray(value) ? value.filter((item): item is Raw => Boolean(item) && typeof item === "object" && !Array.isArray(item)) : [];

/** Every list with its texts filled in. Fields the dashboard doesn't edit (e.g. an old `color`) are kept as they are. */
export function normalizeSkills(raw: Raw | null): SkillsLists {
    return {
        mainSkills: objects(raw?.mainSkills).map((item) => ({
            ...item,
            title: text(item.title),
            description: text(item.description),
            // The site splits the tags text on commas; an old array of tags becomes that text
            tags: Array.isArray(item.tags) ? item.tags.map(text).filter(Boolean).join(", ") : text(item.tags),
            // The site shows the Code icon for a missing name too
            icon: text(item.icon) || "Code",
        })),
        techStack: objects(raw?.techStack).map((item) => ({ ...item, name: text(item.name), val: text(item.val) })),
        software: objects(raw?.software).map((item) => ({ ...item, name: text(item.name), level: text(item.level) })),
        tools: objects(raw?.tools).map((item) => ({ ...item, name: text(item.name), level: text(item.level) })),
    };
}

/** Icons a service card can have: the same names the site knows (src/components/sections/skills/MainSkillsGrid.tsx). */
export const SERVICE_ICONS: readonly { value: string; label: string; icon: LucideIcon }[] = [
    { value: "Code", label: "برمجة", icon: Code },
    { value: "Database", label: "أنظمة وبيانات", icon: Database },
    { value: "BarChart", label: "تحليل", icon: BarChart },
    { value: "BarChart3", label: "تقارير", icon: BarChart3 },
    { value: "LineChart", label: "نمو", icon: LineChart },
    { value: "FileText", label: "محتوى ومستندات", icon: FileText },
    { value: "Search", label: "بحث", icon: Search },
];

export const serviceIcon = (name: string) => SERVICE_ICONS.find((option) => option.value === name)?.icon ?? Code;

/** "95%" → "95" (the site reads the number); "" when the value isn't a plain percentage. */
export function percentNumber(val: string) {
    // "12." is allowed so a number box that's mid-typing isn't cleared
    const match = /^\s*(\d{1,3}(?:\.\d*)?)\s*%?\s*$/.exec(val);
    return match ? match[1] : "";
}

// Why an item can't be saved, or undefined when it's fine
export const serviceError = (item: SkillItem) => (item.title.trim() ? undefined : "اكتب عنوان الخدمة.");

export function techError(item: TechStackItem) {
    if (!item.name.trim()) return "اكتب اسم التقنية.";
    const percent = percentNumber(item.val);
    return percent !== "" && Number(percent) <= 100 ? undefined : "اكتب نسبة من 0 لـ 100.";
}

export const levelItemError = (item: SoftwareItem | ToolItem) => (item.name.trim() ? undefined : "اكتب الاسم.");
