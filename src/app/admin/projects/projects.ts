import { CodeXml, Film, Palette, type LucideIcon } from "lucide-react";

// Projects are one array in ONE document, `site_content/projects` ({ items: [...] }). The list page
// and each editor share one cached read of it; every save writes the whole updated `items` array
// (the only way to change an array item), keeping the other projects — and any fields this
// dashboard doesn't know about — exactly as they are.

export const PROJECTS_PATH = "site_content/projects";

/** A project as stored. Older items may carry extra fields (slug, images…), which are kept on save. */
export type StoredProject = Record<string, unknown>;

export interface ProjectsDoc {
    items: StoredProject[];
}

/** Defined at module level so every projects screen shares one cached copy (see useAdminDoc). */
export function normalizeProjects(raw: Record<string, unknown> | null): ProjectsDoc {
    const items: unknown[] = raw && Array.isArray(raw.items) ? raw.items : [];
    return { items: items.filter((item): item is StoredProject => Boolean(item) && typeof item === "object" && !Array.isArray(item)) };
}

/** The fields the editor shows. */
export interface ProjectForm {
    title: string;
    category: string;
    tags: string;
    description: string;
    image: string;
    gallery: string[];
    /** Software projects: the live site */
    link: string;
    /** Video projects */
    videoUrl: string;
    embedCode: string;
    // Case study (optional): shown as sections on the project page when filled
    challenge: string;
    solution: string;
    /** One per line */
    features: string;
    /** Real results only */
    results: string;
}

const text = (value: unknown) => (typeof value === "string" ? value : "");

export function toForm(item: StoredProject): ProjectForm {
    return {
        title: text(item.title),
        category: text(item.category) || "software",
        tags: text(item.tags),
        description: text(item.description),
        image: text(item.image),
        gallery: Array.isArray(item.gallery) ? item.gallery.filter((url): url is string => typeof url === "string") : [],
        link: text(item.link),
        videoUrl: text(item.videoUrl),
        embedCode: text(item.embedCode),
        challenge: text(item.challenge),
        solution: text(item.solution),
        features: text(item.features),
        results: text(item.results),
    };
}

/** A new project starts as software, like before. Module-level so the draft stays stable. */
export const EMPTY_PROJECT: ProjectForm = {
    title: "",
    category: "software",
    tags: "",
    description: "",
    image: "",
    gallery: [],
    link: "",
    videoUrl: "",
    embedCode: "",
    challenge: "",
    solution: "",
    features: "",
    results: "",
};

/**
 * The stored item after editing: the original item with the edited fields on top. Optional fields
 * (gallery, video) are only written when they have a value or already existed, so projects don't
 * collect empty fields they never had.
 */
export function applyForm(original: StoredProject, form: ProjectForm): StoredProject {
    const next: StoredProject = {
        ...original,
        title: form.title.trim(),
        category: form.category,
        tags: form.tags.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        link: form.link.trim(),
    };
    const optional: [key: string, value: string | string[], empty: boolean][] = [
        ["gallery", form.gallery, form.gallery.length === 0],
        ["videoUrl", form.videoUrl.trim(), !form.videoUrl.trim()],
        ["embedCode", form.embedCode.trim(), !form.embedCode.trim()],
        ["challenge", form.challenge.trim(), !form.challenge.trim()],
        ["solution", form.solution.trim(), !form.solution.trim()],
        ["features", form.features.trim(), !form.features.trim()],
        ["results", form.results.trim(), !form.results.trim()],
    ];
    for (const [key, value, empty] of optional) {
        if (!empty || key in original) next[key] = value;
    }
    return next;
}

export const PROJECT_CATEGORIES: { id: string; label: string; icon: LucideIcon }[] = [
    { id: "software", label: "برمجة", icon: CodeXml },
    { id: "design", label: "تصميم", icon: Palette },
    { id: "video", label: "فيديو", icon: Film },
];

export function categoryOf(id: unknown) {
    return PROJECT_CATEGORIES.find((category) => category.id === id);
}
