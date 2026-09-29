import { ArrowUpRight } from "lucide-react";
import { BackLink, Badge, ButtonLink } from "@/components/ui";
import { getCategoryBadge } from "@/components/projects/categories";
import { getCopy } from "@/lib/copy/server";
import type { ProjectData } from "../types";

interface ProjectHeaderProps {
    project: ProjectData;
    title: string;
    tags: string[];
}

export default async function ProjectHeader({ project, title, tags }: ProjectHeaderProps) {
    const t = await getCopy();
    const category = getCategoryBadge(project.category, t);

    return (
        <>
            <BackLink href="/projects">{t("projects.backToProjects")}</BackLink>

            <header className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <h1 dir="auto" className="break-words text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        {title}
                    </h1>
                    {(category || tags.length > 0) && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {category && <Badge>{category}</Badge>}
                            {tags.map((tag, index) => (
                                <Badge key={`${tag}-${index}`} variant="outline">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {project.link && (
                    <ButtonLink href={project.link} external className="self-start sm:self-auto">
                        {t("projects.visitSite")}
                        <ArrowUpRight />
                    </ButtonLink>
                )}
            </header>
        </>
    );
}
