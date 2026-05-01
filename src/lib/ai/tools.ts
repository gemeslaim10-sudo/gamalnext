import { getCollection, getDocument } from "@/lib/server-utils";
import { FunctionDeclaration, SchemaType } from "@google/generative-ai";

/**
 * AI Tool definitions for Gemini Function Calling
 */
export const aiTools: FunctionDeclaration[] = [
    {
        name: "get_projects",
        description: "Fetch a list of recent projects, portfolio items, and case studies developed by Gamal Tech or Gamal Abd Al-Ati.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                category: {
                    type: SchemaType.STRING,
                    description: "Optional: Filter by category ('design', 'video', 'software')"
                }
            }
        }
    },
    {
        name: "get_articles",
        description: "Fetch the latest blog posts and articles about technology, architecture, or web development on the site.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                limit: {
                    type: SchemaType.NUMBER,
                    description: "Number of articles to return (default is 5)"
                }
            }
        }
    },
    {
        name: "get_site_info",
        description: "Fetch general site configuration, contact details, and core services offered.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {}
        }
    },
    {
        name: "search_knowledge_base",
        description: "Search for specific information across all site content (skills, articles, projects) using keywords.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                query: {
                    type: SchemaType.STRING,
                    description: "The search query (e.g. 'React', 'architecture designs')"
                }
            },
            required: ["query"]
        }
    },
    {
        name: "collect_lead",
        description: "Registers a potential customer's contact information when they express interest in a service or hiring جمال.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                name: { type: SchemaType.STRING, description: "The caller's name" },
                phone: { type: SchemaType.STRING, description: "Phone number or WhatsApp" },
                field: { type: SchemaType.STRING, description: "Their business field or project focus" },
                service: { type: SchemaType.STRING, description: "The specific service they want (e.g. 'E-commerce', 'SEO')" }
            },
            required: ["name", "phone"]
        }
    }
];

interface AIProject {
    title?: string;
    description?: string;
    tags?: string;
    category?: string;
}

interface AIArticle {
    title?: string;
    description?: string;
    slug?: string;
}

interface AISkill {
    title?: string;
    description?: string;
}

interface CollectLeadArgs {
    name: string;
    phone: string;
    field?: string;
    service?: string;
}

/**
 * Implementation of AI Tools
 */
export const toolHandlers = {
    get_projects: async ({ category }: { category?: string }) => {
        const data = await getDocument<{ items?: AIProject[] }>("site_content", "projects");
        let items = data?.items || [];
        if (category) {
            items = items.filter((i) => i.category === category);
        }
        return items.slice(0, 5); // Return top 5
    },
    get_articles: async ({ limit = 5 }: { limit?: number }) => {
        const articles = await getCollection("articles");
        // Sort by date if available, otherwise just slice
        return articles.slice(0, limit);
    },
    get_site_info: async () => {
        const hero = await getDocument("site_content", "hero");
        const skills = await getDocument("site_content", "skills");
        return { 
            heroData: hero, 
            availableSkills: skills,
            contact: "يمكن مراسلتنا عبر الواتساب أو البريد الموجود في الموقع."
        };
    },
    search_knowledge_base: async ({ query }: { query: string }) => {
        const q = query.toLowerCase();
        
        // Parallel fetching
        const [projectsData, articles, skillsData] = await Promise.all([
            getDocument<{ items?: AIProject[] }>("site_content", "projects"),
            getCollection<AIArticle>("articles"),
            getDocument<{ items?: AISkill[] }>("site_content", "skills")
        ]);

        const results: Array<{ type: string; content?: unknown; title?: string; link?: string }> = [];

        // Search Projects
        projectsData?.items?.filter((p) => 
            p.title?.toLowerCase().includes(q) || 
            p.description?.toLowerCase().includes(q) || 
            p.tags?.toLowerCase().includes(q)
        ).forEach((p) => results.push({ type: 'project', content: p }));

        // Search Articles
        articles?.filter((a) => 
            a.title?.toLowerCase().includes(q) || 
            a.description?.toLowerCase().includes(q)
        ).forEach((a) => results.push({ type: 'article', title: a.title, link: `/articles/${a.slug}` }));

        // Search Skills
        skillsData?.items?.filter((s) => 
            s.title?.toLowerCase().includes(q) || 
            s.description?.toLowerCase().includes(q)
        ).forEach((s) => results.push({ type: 'skill', content: s }));

        return results.slice(0, 10);
    },
    collect_lead: async (args: CollectLeadArgs) => {
        try {
            const { db } = await import("@/lib/firebase");
            const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
            const docRef = await addDoc(collection(db, "leads"), {
                ...args,
                capturedAt: serverTimestamp(),
                source: "ai_tool_calling"
            });
            return { success: true, leadId: docRef.id, message: "تم تسجيل اهتمامك بنجاح، فريق جمال سيتواصل معك قريباً." };
        } catch (e: unknown) {
            console.error("Tool capture failed:", e);
            return { success: false, error: e instanceof Error ? e.message : String(e) };
        }
    }
};
