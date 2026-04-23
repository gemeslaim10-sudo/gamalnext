import { NextResponse } from "next/server";
import { getCollection, getDocument } from "@/lib/server-utils";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // Fetch latest articles
        const rawArticles: any[] = await getCollection("articles");
        const articles = rawArticles
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
            .slice(0, 20)
            .map(d => ({
                id: d.id,
                title: d.title || "Untitled",
            }));

        // Fetch projects from site_content document
        const projectsDoc: any = await getDocument("site_content", "projects");
        const projectsList = projectsDoc?.items || [];
        const projects = projectsList
            .slice(0, 20)
            .map((p: any, idx: number) => ({
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
