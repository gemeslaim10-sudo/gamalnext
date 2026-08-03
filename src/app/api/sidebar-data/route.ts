import { NextResponse } from "next/server";
import { getCollection, getDocument } from "@/lib/server-utils";

interface ArticleData {
    id: string;
    title?: string;
    createdAt?: { seconds: number; nanoseconds: number };
}

interface ProjectData {
    id?: string;
    title?: string;
    name?: string;
    image?: string;
    imageUrl?: string;
    images?: string[];
    slug?: string;
}

interface ProjectsDoc {
    items?: ProjectData[];
}

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // Fetch latest articles
        const rawArticles = await getCollection<ArticleData>("articles", {
            orderByField: "createdAt",
            orderDirection: "desc",
            limitCount: 20
        });
        const articles = rawArticles
            .map(d => ({
                id: d.id,
                title: d.title || "Untitled",
            }));

        // Fetch projects from site_content document
        const projectsDoc = await getDocument<ProjectsDoc>("site_content", "projects");
        const projectsList = projectsDoc?.items || [];
        const projects = projectsList
            .slice(0, 20)
            .map((p, idx: number) => ({
                id: p.id || `proj-${idx}`,
                title: p.title || p.name || "Untitled",
                imageUrl: p.image || p.imageUrl || p.images?.[0] || "",
                slug: p.slug || p.id || `proj-${idx}`,
            }));

        return NextResponse.json({ articles, projects });
    } catch (error) {
        console.error("Sidebar data API error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : String(error), articles: [], projects: [] });
    }
}
