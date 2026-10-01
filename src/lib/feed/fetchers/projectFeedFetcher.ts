import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { projectDate, projectSlug } from "@/lib/content/shared";
import type { FeedItem, ProjectItem } from "../types";

const DAY_MS = 86400000;

export async function fetchProjectsFeed(allFeed: FeedItem[]) {
    try {
        const projectsSnap = await getDocs(
            query(collection(db, "site_content"))
        );
        const projectsDoc = projectsSnap.docs.find(d => d.id === "projects");
        const projectsList: ProjectItem[] = projectsDoc?.data()?.items || [];
        const now = Date.now();
        projectsList.forEach((p, idx) => {
            const date = projectDate(p);
            allFeed.push({
                id: p.id || p.slug || `proj-${idx}`,
                type: "project",
                title: p.title || p.name || "Untitled Project",
                // Only the project's own words: without a description the card shows the title and pictures
                description: p.summary || p.description || "",
                fullContent: p.description || p.summary || "",
                imageUrl: p.image || p.imageUrl || p.gallery?.[0] || null,
                gallery: p.gallery || (p.image ? [p.image] : null),
                mediaType: p.videoUrl ? "video" : "image",
                videoUrl: p.videoUrl || null,
                // Same address as the project cards and the sitemap (one URL per project)
                link: `/projects/${projectSlug(p) || `proj-${idx}`}`,
                // The date set in the dashboard, if any: a project without one shows no date
                createdAt: date,
                // Undated projects keep the dashboard order near the top of the feed, a day apart
                rankAt: date ?? new Date(now - idx * DAY_MS).toISOString(),
            });
        });
    } catch (err) {
        console.error("Feed: Failed to fetch projects", err);
        // A feed missing its projects must not be cached
        throw err;
    }
}
