import { ArrowRight } from "lucide-react";
import { ButtonLink, Section } from "@/components/ui";
import ProjectCard from "@/components/projects/ProjectCard";
import { getCopy } from "@/lib/copy/server";
import type { ProjectData } from "./types";

const RELATED_COUNT = 3;

interface RelatedProjectsProps {
    project: ProjectData;
    allProjects: ProjectData[];
}

export default async function RelatedProjects({ project, allProjects }: RelatedProjectsProps) {
    // Every other titled project, same category first
    const others = allProjects.filter((p) => p !== project && (p.title || p.name));
    const related = [
        ...others.filter((p) => p.category && p.category === project.category),
        ...others.filter((p) => !p.category || p.category !== project.category),
    ].slice(0, RELATED_COUNT);

    if (related.length === 0) return null;

    const t = await getCopy();

    return (
        <Section
            title={t("projects.relatedTitle")}
            action={
                <ButtonLink href="/projects" variant="ghost">
                    {t("projects.viewAll")}
                    <ArrowRight />
                </ButtonLink>
            }
            className="mt-10 border-t border-border pb-0 sm:mt-14 sm:pb-0"
        >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p, index) => (
                    <ProjectCard
                        key={p.id || `${p.title || p.name}-${index}`}
                        project={{
                            // Every related project has a title or a name (filtered above)
                            title: p.title || p.name || "",
                            image: p.image || p.imageUrl || p.images?.[0],
                            description: p.description,
                            category: p.category,
                        }}
                        // Two columns show two cards; the third would sit alone on its own row
                        className={index === 2 ? "sm:max-lg:hidden" : undefined}
                    />
                ))}
            </div>
        </Section>
    );
}
