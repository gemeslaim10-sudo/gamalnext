// Content rules shared by the server and the browser.
import { slugify } from "@/lib/utils";

/** The URL part of a project page: its title (project cards link by title), else the saved slug. */
export function projectSlug(project: { slug?: string; title?: string; name?: string }) {
    return slugify(String(project.title || project.name || "").trim()) || project.slug?.trim() || "";
}

/** Articles waiting for (or refused in) review stay private. No status = published before moderation existed. */
export function isPublicArticle(article: { status?: unknown }) {
    return !article.status || article.status === "published" || article.status === "approved";
}
