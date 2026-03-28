import { getCollection, getDocument } from "@/lib/server-utils";

/**
 * AI Tool definitions for Gemini Function Calling
 */
export const aiTools = [
    {
        name: "get_projects",
        description: "Fetch a list of recent projects, portfolio items, and case studies developed by Gamal Tech or Gamal Abd Al-Ati.",
        parameters: {
            type: "OBJECT",
            properties: {
                category: {
                    type: "STRING",
                    description: "Optional: Filter by category ('design', 'video', 'software')"
                }
            }
        }
    },
    {
        name: "get_articles",
        description: "Fetch the latest blog posts and articles about technology, architecture, or web development on the site.",
        parameters: {
            type: "OBJECT",
            properties: {
                limit: {
                    type: "NUMBER",
                    description: "Number of articles to return (default is 5)"
                }
            }
        }
    },
    {
        name: "get_site_info",
        description: "Fetch general site configuration, contact details, and core services offered.",
        parameters: {
            type: "OBJECT",
            properties: {}
        }
    },
    {
        name: "search_knowledge_base",
        description: "Search for specific information across all site content (skills, articles, projects) using keywords.",
        parameters: {
            type: "OBJECT",
            properties: {
                query: {
                    type: "STRING",
                    description: "The search query (e.g. 'React', 'architecture designs')"
                }
            },
            required: ["query"]
        }
    }
];

/**
 * Implementation of AI Tools
 */
export const toolHandlers = {
    get_projects: async ({ category }: { category?: string }) => {
        const data: any = await getDocument("site_content", "projects");
        let items = data?.items || [];
        if (category) {
            items = items.filter((i: any) => i.category === category);
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
        const [projectsData, articles, skillsData]: any = await Promise.all([
            getDocument("site_content", "projects"),
            getCollection("articles"),
            getDocument("site_content", "skills")
        ]);

        const results: any[] = [];

        // Search Projects
        projectsData?.items?.filter((p: any) => 
            p.title?.toLowerCase().includes(q) || 
            p.description?.toLowerCase().includes(q) || 
            p.tags?.toLowerCase().includes(q)
        ).forEach((p: any) => results.push({ type: 'project', content: p }));

        // Search Articles
        articles?.filter((a: any) => 
            a.title?.toLowerCase().includes(q) || 
            a.description?.toLowerCase().includes(q)
        ).forEach((a: any) => results.push({ type: 'article', title: a.title, link: `/articles/${a.slug}` }));

        // Search Skills
        skillsData?.items?.filter((s: any) => 
            s.title?.toLowerCase().includes(q) || 
            s.description?.toLowerCase().includes(q)
        ).forEach((s: any) => results.push({ type: 'skill', content: s }));

        return results.slice(0, 10);
    }
};
