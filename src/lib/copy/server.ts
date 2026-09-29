import { cache } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COPY_DEFAULTS, mergeCopy, type CopyKey } from "@/config/copy";
import { formatCopy, type CopyValues } from "./types";

/**
 * The site texts for this request (read once per request, shared by the layout, pages and metadata).
 * If the database can't be read, every text falls back to its default — but a slow read never shows
 * defaults, because the page waits for this before rendering.
 */
export const getSiteCopy = cache(async (): Promise<CopyValues> => {
    try {
        const snap = await getDoc(doc(db, "site_content", "copy"));
        return mergeCopy(snap.exists() ? (snap.data().values as Record<string, unknown>) : null);
    } catch (error) {
        console.error("Failed to load site copy, using defaults:", error);
        return { ...COPY_DEFAULTS };
    }
});

/** `t` for server components and generateMetadata: `const t = await getCopy(); t("projects.title")`. */
export async function getCopy() {
    const values = await getSiteCopy();
    return (key: CopyKey, vars?: Record<string, string | number>) => formatCopy(values[key] ?? COPY_DEFAULTS[key] ?? key, vars);
}
