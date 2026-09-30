// Registry of every editable UI text on the public site.
// Add a field to the right section file and it automatically shows up in /admin/copy,
// gets a typed key (e.g. t("projects.title")), and falls back to its default on read errors.
import type { CopySection, CopyValues } from "@/lib/copy/types";
import { navigationCopy, footerCopy } from "./navigation";
import { homeCopy } from "./home";
import { profileCopy } from "./profile";
import { skillsCopy } from "./skills";
import { projectsCopy } from "./projects";
import { blogCopy } from "./blog";
import { contactCopy } from "./contact";
import { accountCopy } from "./account";
import { errorsCopy } from "./errors";

const SECTIONS = [
    navigationCopy,
    homeCopy,
    profileCopy,
    skillsCopy,
    projectsCopy,
    blogCopy,
    contactCopy,
    accountCopy,
    errorsCopy,
    footerCopy,
] as const;

type KeysOf<S> = S extends { id: infer Id extends string; fields: readonly (infer F)[] }
    ? F extends { key: infer K extends string }
        ? `${Id}.${K}`
        : never
    : never;

/** Every valid copy key, e.g. "nav.home" | "projects.title" | … */
export type CopyKey = KeysOf<(typeof SECTIONS)[number]>;

export const COPY_SECTIONS: readonly CopySection[] = SECTIONS;

export const COPY_DEFAULTS: CopyValues = Object.fromEntries(
    SECTIONS.flatMap((section) =>
        (section.fields as readonly { key: string; default: string }[]).map((field) => [`${section.id}.${field.key}`, field.default])
    )
);

/** Stored values win; keys missing from the database (e.g. newly added texts) use their default. */
export function mergeCopy(stored: Record<string, unknown> | null | undefined): CopyValues {
    const merged: CopyValues = { ...COPY_DEFAULTS };
    if (stored) {
        for (const [key, value] of Object.entries(stored)) {
            if (typeof value === "string" && key in COPY_DEFAULTS) merged[key] = value;
        }
    }
    return merged;
}
