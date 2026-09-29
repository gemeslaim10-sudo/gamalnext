import { ArrowRight } from "lucide-react";
import { getDocument } from "@/lib/server-utils";
import { ButtonLink, Section } from "@/components/ui";
import { getCopy } from "@/lib/copy/server";
import ProjectCard, { type ProjectCardData } from "./ProjectCard";

type Project = ProjectCardData & {
    images?: string[];
    tags?: string;
    link?: string;
};

/** Six projects fill the grid evenly at two and three columns. */
const FEATURED_COUNT = 6;
const PHONE_LIMIT = 3;

export default async function FeaturedProjects() {
    const [projectsData, t] = await Promise.all([getDocument("site_content", "projects"), getCopy()]);

    // Default fallback data if empty, using the structure from Projects.tsx
    const defaultProjects: Project[] = [
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

    // Assuming structure: { items: [...] }
    const items = (projectsData as unknown as { items: Project[] })?.items || defaultProjects;
    const featured = items.filter((project) => project?.title).slice(0, FEATURED_COUNT);

    if (featured.length === 0) return null;

    return (
        <Section
            id="projects"
            title={t("projects.featuredTitle")}
            action={
                <ButtonLink href="/projects" variant="ghost">
                    {t("projects.viewAll")}
                    <ArrowRight />
                </ButtonLink>
            }
        >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((project, index) => (
                    <ProjectCard
                        key={`${project.title}-${index}`}
                        // Only what the card shows (it is a client component, so props are sent to the browser)
                        project={{
                            title: project.title,
                            image: project.image || project.images?.[0],
                            description: project.description,
                            category: project.category,
                        }}
                        // Phones get the first few only, like the articles section below
                        className={index >= PHONE_LIMIT ? "hidden sm:flex" : undefined}
                    />
                ))}
            </div>
        </Section>
    );
}
