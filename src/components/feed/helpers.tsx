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

/** "Sep 30, 2026"; projects are dated to the month ("Jun 2025", read in UTC so the month never shifts). */
export const formatFeedDate = (date: string, precision: "day" | "month" = "day") =>
    new Date(date).toLocaleDateString(
        "en-US",
        precision === "month" ? { month: "short", year: "numeric", timeZone: "UTC" } : { month: "short", day: "numeric", year: "numeric" }
    );