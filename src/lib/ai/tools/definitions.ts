import { FunctionDeclaration, SchemaType } from "@google/generative-ai";

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
