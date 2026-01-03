import { getDocument } from "@/lib/server-utils";
import FeaturedProjectsClient from "./FeaturedProjectsClient";

export default async function FeaturedProjects() {
    const projectsData = await getDocument("site_content", "projects");

    // Default fallback data if empty, using the structure from Projects.tsx
    const defaultProjects = [
        {
            title: 'Art Vision Portfolio',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'React, Netlify, Dashboard',
            link: 'https://artvisionviewportfolio.netlify.app/'
        },
        {
            title: 'Noorva Store',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'E-commerce, Supabase, React',
            link: 'https://noorvastore.netlify.app/'
        },
        {
            title: 'Zakaryia Law Firm',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'Corporate, CMS, Dynamic',
            link: 'https://zakaryialawfirm.netlify.app/'
        },
        {
            title: 'Framez Vision',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'Cloudflare, Media, Animation',
            link: 'https://framezvision.pages.dev/'
        }
    ];

    // Combine fetched data with defaults if fetched is empty or use fetched directly
    // Assuming structure: { items: [...] }
    const items = (projectsData as any)?.items || defaultProjects;

    return <FeaturedProjectsClient projects={items} />;
}
