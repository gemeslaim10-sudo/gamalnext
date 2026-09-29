import type { CopyKey } from "@/config/copy";

// Project categories as stored in Firestore (site_content/projects → items[].category).
// The ids never change; the names shown are site copy (/admin/copy):
// `label` names the filter chip on /projects, `badge` names the category on a single project.
export const PROJECT_CATEGORIES = [
    { id: "design", label: "projects.filterDesign", badge: "projects.categoryDesign" },
    { id: "video", label: "projects.filterVideo", badge: "projects.categoryVideo" },
    { id: "software", label: "projects.filterSoftware", badge: "projects.categorySoftware" },
] as const satisfies readonly { id: string; label: CopyKey; badge: CopyKey }[];

/** `t` from useCopy() (client) or getCopy() (server). */
type Translate = (key: CopyKey) => string;

/** Display name of a category id; unknown ids are shown as they are. */
export function getCategoryBadge(category: string | undefined, t: Translate): string {
    if (!category) return "";
    const known = PROJECT_CATEGORIES.find((c) => c.id === category);
    return known ? t(known.badge) : category;
}
