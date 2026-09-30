import { cache } from "react";
import { CACHE_TAGS, cached, readDoc, readOrFallback } from "@/lib/cache";
import { COPY_DEFAULTS, mergeCopy, type CopyKey } from "@/config/copy";
import { formatCopy, type CopyValues } from "./types";

const readCopy = cached(
    async () => (await readDoc<{ values?: Record<string, unknown> }>("site_content", "copy"))?.values ?? null,
    "copy",
    [CACHE_TAGS.copy]
);

/**
 * The site texts (cached until the dashboard saves or clears the cache; shared by the layout, pages
 * and metadata). If the database can't be read, every text falls back to its default — but a slow
 * read never shows defaults, because the page waits for this before rendering.
 */
export const getSiteCopy = cache(async (): Promise<CopyValues> => mergeCopy(await readOrFallback("site copy", readCopy, null)));

/** `t` for server components and generateMetadata: `const t = await getCopy(); t("projects.title")`. */
export async function getCopy() {
    const values = await getSiteCopy();
    return (key: CopyKey, vars?: Record<string, string | number>) => formatCopy(values[key] ?? COPY_DEFAULTS[key] ?? key, vars);
}
