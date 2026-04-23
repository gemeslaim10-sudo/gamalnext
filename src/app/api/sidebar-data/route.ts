import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // Fetch latest articles (title + id only)
        const articlesSnap = await getDocs(
            query(collection(db, "articles"), orderBy("createdAt", "desc"), limit(20))
        );
        const articles = articlesSnap.docs.map(d => ({
            id: d.id,
            title: d.data().title || "Untitled",
        }));

        // Fetch projects (title + id + thumbnail)
        const projectsSnap = await getDocs(
            query(collection(db, "projects"), limit(20))
        );
        const projects = projectsSnap.docs.map(d => ({
            id: d.id,
            title: d.data().title || d.data().name || "Untitled",
            imageUrl: d.data().imageUrl || d.data().images?.[0] || "",
        }));

        return NextResponse.json({ articles, projects });
    } catch (error) {
        console.error("Sidebar data API error:", error);
        return NextResponse.json({ articles: [], projects: [] });
    }
}
