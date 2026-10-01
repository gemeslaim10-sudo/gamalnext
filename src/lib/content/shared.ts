// Content rules shared by the server and the browser.
import { slugify } from "@/lib/utils";

/** The URL part of a project page: its title (project cards link by title), else the saved slug. */
export function projectSlug(project: { slug?: string; title?: string; name?: string }) {
    return slugify(String(project.title || project.name || "").trim()) || project.slug?.trim() || "";
}

/**
 * A project's real date as an ISO string: the month set in the dashboard ("2025-06"), or an older
 * full date. Nothing when none was entered — a project's date is never made up.
 */
export function projectDate(project: { date?: unknown; createdAt?: unknown }) {
    for (const value of [project.date, project.createdAt]) {
        const raw = typeof value === "string" ? value.trim() : "";
        if (!raw) continue;
        const time = Date.parse(/^\d{4}-\d{2}$/.test(raw) ? `${raw}-01T00:00:00Z` : raw);
        if (!Number.isNaN(time)) return new Date(time).toISOString();
    }
    return undefined;
}

/** A project's images as its page shows them: the main image first, then the gallery. */
export function projectImages(project: { image?: string; gallery?: unknown }) {
    const gallery = Array.isArray(project.gallery) ? project.gallery : [];
    return [project.image, ...gallery].filter((url): url is string => typeof url === "string" && url.trim() !== "");
}

/**
 * Every project's images as one set each, in the order of the projects page (untitled projects are
 * left out there too). The image viewer goes from one project's last image to the next one's first.
 */
export function projectGalleries(projects: { title?: string; name?: string; slug?: string; image?: string; gallery?: unknown }[]) {
    return projects
        .filter((project) => project.title || project.name)
        .map((project) => ({
            title: String(project.title || project.name || "").trim(),
            href: `/projects/${projectSlug(project)}`,
            items: projectImages(project).map((url) => ({ url, type: "image" as const })),
        }));
}

/** Articles waiting for (or refused in) review stay private. No status = published before moderation existed. */
export function isPublicArticle(article: { status?: unknown }) {
    return !article.status || article.status === "published" || article.status === "approved";
}
