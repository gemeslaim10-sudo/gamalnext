import { NextResponse } from "next/server";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

interface ProjectItem {
    id?: string;
    slug?: string;
    title?: string;
    name?: string;
    summary?: string;
    description?: string;
    image?: string;
    imageUrl?: string;
    gallery?: string[];
    videoUrl?: string;
    createdAt?: string;
    [key: string]: unknown;
}

interface FeedItem {
    id: string;
    type: string;
    title: string;
    description: string;
    fullContent?: string;
    imageUrl: string | null;
    gallery?: string[] | null;
    mediaType: string;
    videoUrl?: string | null;
    link: string;
    createdAt: string;
    author?: string;
}

const STATIC_TOOLS: FeedItem[] = [
    {
        id: "tool-qr",
        type: "tool",
        title: "QR Code Generator",
        description: "Generate high-quality QR codes instantly for URLs, text, and contacts. Free and secure.",
        fullContent: "Generate high-quality QR codes instantly for URLs, text, and contacts. Free and secure. This tool is built entirely in the browser, meaning your data never leaves your device.",
        imageUrl: "https://images.unsplash.com/photo-1622556498246-755f44ca76f3?auto=format&fit=crop&q=80&w=800",
        gallery: null,
        mediaType: "image",
        link: "/tools/utils/qr-generator",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
        id: "tool-unit",
        type: "tool",
        title: "Unit Converter",
        description: "A comprehensive unit converter for length, weight, temperature, and more.",
        fullContent: "A comprehensive unit converter for length, weight, temperature, and more. Essential for developers, students, and engineers who frequently need to convert between metric and imperial systems instantly.",
        imageUrl: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&q=80&w=800",
        gallery: null,
        mediaType: "image",
        link: "/tools/utils/unit-converter",
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    {
        id: "tool-pass",
        type: "tool",
        title: "Secure Password Generator",
        description: "Generate cryptographically secure passwords locally on your device without sending any data to the server.",
        fullContent: "Generate cryptographically secure passwords locally on your device without sending any data to the server. Customize length, complexity, and character sets to meet any security requirement.",
        imageUrl: "https://images.unsplash.com/photo-1614064641913-6b71a25712c4?auto=format&fit=crop&q=80&w=800",
        gallery: null,
        mediaType: "image",
        link: "/tools/security/password-generator",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    }
];

function parseDate(createdAt: unknown): string {
    if (!createdAt) return new Date().toISOString();
    if (typeof createdAt === "object" && createdAt !== null) {
        const ts = createdAt as { toDate?: () => Date; seconds?: number };
        if (typeof ts.toDate === "function") return ts.toDate().toISOString();
        if (ts.seconds) return new Date(ts.seconds * 1000).toISOString();
    }
    if (typeof createdAt === "string") return createdAt;
    return new Date().toISOString();
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    const allFeed: FeedItem[] = [...STATIC_TOOLS];

    // Fetch Articles
    try {
        const articlesQ = query(collection(db, "articles"), orderBy("createdAt", "desc"));
        const articlesSnap = await getDocs(articlesQ);
        articlesSnap.docs.forEach(docSnap => {
            const data = docSnap.data();
            allFeed.push({
                id: docSnap.id,
                type: "article",
                title: data.title || "Untitled Article",
                description: data.summary || (data.content ? (data.content as string).substring(0, 150) + "..." : ""),
                fullContent: data.content || data.summary || "",
                imageUrl: data.media?.[0]?.url || null,
                gallery: Array.isArray(data.media) ? (data.media as Array<{ url: string }>).map(m => m.url) : null,
                mediaType: data.media?.[0]?.type || "image",
                link: `/articles/${docSnap.id}`,
                createdAt: parseDate(data.createdAt),
            });
        });
    } catch (err) {
        console.error("Feed: Failed to fetch articles", err);
    }

    // Fetch Projects
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

    // Fetch Approved User Posts
    try {
        const postsSnap = await getDocs(
            query(collection(db, "posts"), where("status", "==", "approved"))
        );
        postsSnap.docs.forEach(docSnap => {
            const data = docSnap.data();
            allFeed.push({
                id: docSnap.id,
                type: "post",
                title: `${data.userName || "User"} shared a post`,
                description: data.content && (data.content as string).length > 200
                    ? (data.content as string).substring(0, 200) + "..."
                    : data.content || "",
                fullContent: data.content || "",
                imageUrl: data.mediaUrl || (data.gallery as string[])?.[0] || null,
                gallery: Array.isArray(data.gallery) ? data.gallery as string[] : null,
                mediaType: data.mediaType || "image",
                link: `/explore#${docSnap.id}`,
                createdAt: parseDate(data.createdAt),
                author: data.userName || "User",
            });
        });
    } catch (err) {
        console.error("Feed: Failed to fetch user posts", err);
    }

    // Sort by date descending
    allFeed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Paginate
    const paginatedFeed = allFeed.slice(offset, offset + pageSize);
    const hasMore = offset + pageSize < allFeed.length;

    return NextResponse.json({ items: paginatedFeed, hasMore });
}
