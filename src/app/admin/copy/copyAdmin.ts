import {
    Code,
    FolderOpen,
    House,
    KeyRound,
    Mail,
    Newspaper,
    PanelBottom,
    PanelTop,
    TriangleAlert,
    Type,
    UserRound,
    type LucideIcon,
} from "lucide-react";
import { COPY_SECTIONS, mergeCopy } from "@/config/copy";
import type { CopyField, CopySection, CopyValues } from "@/lib/copy/types";

// site_content/copy = { values: { "nav.home": "…", … } }. Which texts exist, their defaults and their
// sections are defined in code (src/config/copy), so the hub, the counts and the search never need
// the database; only a section editor reads the document.

export const COPY_DOC = "site_content/copy" as const;

/** The saved texts over the defaults: exactly what the site shows. */
export function normalizeCopy(raw: Record<string, unknown> | null): CopyValues {
    const values = raw?.values;
    return mergeCopy(values && typeof values === "object" && !Array.isArray(values) ? (values as Record<string, unknown>) : null);
}

/** Full key of a text, e.g. "nav.home" */
export const copyKey = (section: CopySection, field: CopyField) => `${section.id}.${field.key}`;

/** Id of a text's box on the page (keys contain dots) */
export const copyInputId = (key: string) => `copy-${key.replace(/\./g, "-")}`;

export const findCopySection = (id: string) => COPY_SECTIONS.find((section) => section.id === id);

/** A section editor, optionally opened at one text */
export const copySectionHref = (section: CopySection, field?: CopyField) =>
    `/admin/copy/${section.id}${field ? `?field=${encodeURIComponent(field.key)}` : ""}`;

export interface CopySectionInfo {
    title: string;
    description: string;
    icon: LucideIcon;
    /** Where the rest of that page's content is edited */
    related?: readonly { label: string; href: string }[];
}

// The section definitions are written for developers, in English; this is how the dashboard names them
const SECTION_INFO: Record<string, CopySectionInfo> = {
    nav: {
        title: "القائمة العلوية",
        description: "روابط القائمة وأزرار الدخول والخروج وقائمة الحساب ورسائل الإشعارات.",
        icon: PanelTop,
    },
    home: {
        title: "الصفحة الرئيسية",
        description: "المنشورات وخانة كتابة منشور والرسائل اللي بتظهر للزوار.",
        icon: House,
        related: [{ label: "عنوان ووصف جوجل", href: "/admin/seo" }],
    },
    profile: {
        title: "صفحة البروفايل",
        description: "أزرار المقدمة والأرقام، وعناوين أقسام الخدمات والمقالات وآراء العملاء وفورم التقييم.",
        icon: UserRound,
        related: [
            { label: "الواجهة", href: "/admin/content" },
            { label: "الخدمات", href: "/admin/skills/services" },
            { label: "آراء العملاء", href: "/admin/reviews" },
        ],
    },
    skills: {
        title: "صفحة المهارات",
        description: "عنوان الصفحة وعناوين أقسام التقنيات والبرامج والأدوات.",
        icon: Code,
        related: [{ label: "الخدمات والمهارات", href: "/admin/skills" }],
    },
    projects: {
        title: "المشاريع",
        description: "صفحة المشاريع والفلاتر وصفحة المشروع وأسماء التصنيفات.",
        icon: FolderOpen,
        related: [{ label: "المشاريع", href: "/admin/projects" }],
    },
    blog: {
        title: "المدونة",
        description: "صفحة المقالات وصفحة المقال والتعليقات وتعديل المقال وصفحة العضو.",
        icon: Newspaper,
        related: [{ label: "المقالات", href: "/admin/articles" }],
    },
    contact: {
        title: "صفحة التواصل",
        description: "العناوين الصغيرة فوق بيانات التواصل.",
        icon: Mail,
        related: [
            { label: "بيانات التواصل", href: "/admin/settings/contact" },
            { label: "فورم التواصل", href: "/admin/leads/capture" },
        ],
    },
    account: {
        title: "الحسابات",
        description: "نافذة الدخول وصفحة الإعدادات وكتابة مقال وتعديل منشور ومحرر الصور.",
        icon: KeyRound,
    },
    errors: {
        title: "صفحات الأخطاء",
        description: "صفحة 404 وصفحة «حصلت مشكلة».",
        icon: TriangleAlert,
    },
    footer: {
        title: "الفوتر",
        description: "سطر حقوق النشر في آخر كل صفحة.",
        icon: PanelBottom,
    },
};

/** Dashboard name, description and icon of a section (a new section shows its code title until it's added above). */
export function sectionInfo(section: CopySection): CopySectionInfo {
    return SECTION_INFO[section.id] ?? { title: section.title, description: section.description ?? "", icon: Type };
}

/** "12 نص", with the right Arabic form for the number */
export function textCount(count: number) {
    if (count === 1) return "نص واحد";
    if (count === 2) return "نصّين";
    if (count >= 3 && count <= 10) return `${count} نصوص`;
    return `${count} نص`;
}

// ── Parts of big sections ─────────────────────────────────────────────────────

export interface CopyGroup {
    id: string;
    label: string;
    fields: CopyField[];
}

// A big section is split by where its texts appear; most labels start with it ("Write page: title")
const SPLIT_SECTIONS_ABOVE = 40;
const MIN_GROUP_SIZE = 3;

const GROUP_NAMES: Record<string, string> = {
    "Log in window": "نافذة الدخول",
    "Log in required box": "رسالة طلب الدخول",
    "Settings page": "صفحة الإعدادات",
    "Write page": "كتابة مقال",
    "Edit post page": "تعديل منشور",
    "Image editor": "محرر الصور",
    "Blog page": "صفحة المدونة",
    "Article page": "صفحة المقال",
    "Edit article": "تعديل مقال",
    Comments: "التعليقات",
    "Member page": "صفحة العضو",
    "Article media": "صور وفيديوهات المقال",
    Toast: "رسائل التنبيه",
};

const placeOf = (field: CopyField) => {
    const colon = field.label.indexOf(":");
    return colon > 0 ? field.label.slice(0, colon).trim() : "";
};

/** The parts of a big section in the order they first appear, or null for a section short enough to show whole. */
export function copyGroups(section: CopySection): CopyGroup[] | null {
    if (section.fields.length <= SPLIT_SECTIONS_ABOVE) return null;

    const sizes = new Map<string, number>();
    for (const field of section.fields) sizes.set(placeOf(field), (sizes.get(placeOf(field)) ?? 0) + 1);

    const groups = new Map<string, CopyGroup>();
    const other: CopyField[] = [];
    for (const field of section.fields) {
        const place = placeOf(field);
        if (!place || (sizes.get(place) ?? 0) < MIN_GROUP_SIZE) {
            other.push(field);
            continue;
        }
        const group = groups.get(place) ?? { id: place, label: GROUP_NAMES[place] ?? place, fields: [] };
        group.fields.push(field);
        groups.set(place, group);
    }
    return [...groups.values(), ...(other.length > 0 ? [{ id: "other", label: "نصوص تانية", fields: other }] : [])];
}

// ── Search ────────────────────────────────────────────────────────────────────

export const normalizeQuery = (query: string) => query.trim().toLowerCase();

/** Matches where the text appears, its key, its default, its hint and (when known) its current value. */
export function copyFieldMatches(section: CopySection, field: CopyField, query: string, current?: string) {
    return [field.label, copyKey(section, field), field.default, field.hint ?? "", current ?? ""].some((text) =>
        text.toLowerCase().includes(query)
    );
}

/** {placeholders} of the default that the value dropped (the site fills them in, e.g. {name}). */
export function missingPlaceholders(field: CopyField, value: string) {
    if (!value.trim()) return [];
    const tokens = new Set(field.default.match(/\{\w+\}/g) ?? []);
    return [...tokens].filter((token) => !value.includes(token));
}
