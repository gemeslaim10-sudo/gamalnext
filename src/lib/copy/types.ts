// Site copy = every fixed UI text on the public site (titles, labels, buttons, empty states, SEO).
// Each text has a key, a label for the dashboard, and an English default. The owner edits them in
// /admin/copy; the defaults are only used when the database can't be read (never while loading).

export type CopyFieldType = "text" | "textarea";

export interface CopyField {
    /** Unique within its section, e.g. "title" → full key "projects.title" */
    key: string;
    /** Where the text appears, shown in the dashboard */
    label: string;
    default: string;
    type?: CopyFieldType;
    /** Extra guidance in the dashboard, e.g. which {placeholders} are available */
    hint?: string;
}

export interface CopySection {
    id: string;
    /** Dashboard group title */
    title: string;
    description?: string;
    fields: readonly CopyField[];
}

export type CopyValues = Record<string, string>;

/** Replaces {placeholders} with values, e.g. format("Hi {name}", { name: "Sara" }). */
export function formatCopy(text: string, vars?: Record<string, string | number>) {
    if (!vars) return text;
    return text.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}
