import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { FeedItem, ProjectItem } from "../types";

export async function fetchProjectsFeed(allFeed: FeedItem[]) {
    try {
        const projectsSnap = await getDocs(
            query(collection(db, "site_content"))
        );
        const projectsDoc = projectsSnap.docs.find(d => d.id === "projects");
        const projectsList: ProjectItem[] = projectsDoc?.data()?.items || [];
        projectsList.forEach((p, idx) => {
            allFeed.push({
                id: p.id || p.slug || `proj-${idx}`,
                type: "project",
                title: p.title || p.name || "Untitled Project",
                description: p.summary || p.description || "Explore this amazing project.",
                fullContent: p.description || p.summary || "Explore this amazing project. Features cutting edge technologies and dynamic designs.",
                imageUrl: p.image || p.imageUrl || p.gallery?.[0] || null,
                gallery: p.gallery || (p.image ? [p.image] : null),
                mediaType: p.videoUrl ? "video" : "image",
                videoUrl: p.videoUrl || null,
                link: `/projects/${p.slug || p.id || `proj-${idx}`}`,
                createdAt: p.createdAt || new Date(Date.now() - idx * 86400000).toISOString(),
            });
        });
    } catch (err) {
        console.error("Feed: Failed to fetch projects", err);
    }
}
