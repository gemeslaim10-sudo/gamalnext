import { getCollection, getDocument } from "@/lib/server-utils";
import { AIProject, AIArticle, AISkill, CollectLeadArgs } from "./types";

export const toolHandlers = {
    get_projects: async ({ category }: { category?: string }) => {
        const data = await getDocument<{ items?: AIProject[] }>("site_content", "projects");
        let items = data?.items || [];
        if (category) {
            items = items.filter((i) => i.category === category);
        }
        return items.slice(0, 5);
    },
    get_articles: async ({ limit = 5 }: { limit?: number }) => {
        const articles = await getCollection("articles");
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
        
        const [projectsData, articles, skillsData] = await Promise.all([
            getDocument<{ items?: AIProject[] }>("site_content", "projects"),
            getCollection<AIArticle>("articles"),
            getDocument<{ items?: AISkill[] }>("site_content", "skills")
        ]);

        const results: Array<{ type: string; content?: unknown; title?: string; link?: string }> = [];

        projectsData?.items?.filter((p) => 
            p.title?.toLowerCase().includes(q) || 
            p.description?.toLowerCase().includes(q) || 
            p.tags?.toLowerCase().includes(q)
        ).forEach((p) => results.push({ type: 'project', content: p }));

        articles?.filter((a) => 
            a.title?.toLowerCase().includes(q) || 
            a.description?.toLowerCase().includes(q)
        ).forEach((a) => results.push({ type: 'article', title: a.title, link: `/articles/${a.slug}` }));

        skillsData?.items?.filter((s) => 
            s.title?.toLowerCase().includes(q) || 
            s.description?.toLowerCase().includes(q)
        ).forEach((s) => results.push({ type: 'skill', content: s }));

        return results.slice(0, 10);
    },
    collect_lead: async (args: CollectLeadArgs) => {
        try {
            const { adminDb } = await import("@/lib/firebase-admin");
            const admin = (await import("firebase-admin")).default;
            const docRef = await adminDb.collection("leads").add({
                ...args,
                capturedAt: admin.firestore.FieldValue.serverTimestamp(),
                source: "ai_tool_calling"
            });
            return { success: true, leadId: docRef.id, message: "تم تسجيل اهتمامك بنجاح، فريق جمال سيتواصل معك قريباً." };
        } catch (e: unknown) {
            console.error("Tool capture failed:", e);
            return { success: false, error: e instanceof Error ? e.message : String(e) };
        }
    }
};
