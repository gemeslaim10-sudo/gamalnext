import type { CopyKey } from "@/config/copy";

// ── Feed Helpers ─────────────────────────────────────────────────────────────

/** Editable label for each feed item type (/admin/copy → Home page). */
export const getLabelKeyForType = (type: string): CopyKey => {
    switch (type) {
        case "article": return "home.typeArticle";
        case "post": return "home.typePost";
        default: return "home.typeProject";
    }
};

export const formatFeedDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });