// Content rules shared by the server and the browser.
import { slugify } from "@/lib/utils";

/** The URL part of a project page: its title (project cards link by title), else the saved slug. */
export function projectSlug(project: { slug?: string; title?: string; name?: string }) {
    return slugify(String(project.title || project.name || "").trim()) || project.slug?.trim() || "";
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
