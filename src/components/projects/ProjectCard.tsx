"use client";

import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { Badge, Card, FadeImage, Skeleton } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";
import { cn, slugify } from "@/lib/utils";
import { getCategoryBadge } from "./categories";

export interface ProjectCardData {
    title: string;
    image?: string;
    description?: string;
    category?: string;
}

interface ProjectCardProps {
    project: ProjectCardData;
    className?: string;
}

/** The one project card used on /projects, the profile page and related projects. */
export default function ProjectCard({ project, className }: ProjectCardProps) {
    const t = useCopy();
    const category = getCategoryBadge(project.category, t);

    return (
        <Card padding="none" interactive className={cn("reveal relative flex flex-col overflow-hidden", className)}>
            <div className="relative aspect-[16/10] shrink-0 border-b border-border bg-surface-hover">
                {project.image ? (
                    <FadeImage
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover object-top"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center text-subtle">
                        <ImageIcon aria-hidden className="size-6" />
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col items-start gap-2 p-4">
                <h3 dir="auto" className="line-clamp-2 w-full text-base font-semibold leading-snug text-foreground">
                    {/* The link covers the whole card, so the card is one click target */}
                    <Link
                        href={`/projects/${slugify(project.title)}`}
                        className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-foreground"
                    >
                        {project.title}
                    </Link>
                </h3>
                {category && <Badge>{category}</Badge>}
                {project.description && (
                    <p dir="auto" className="line-clamp-2 w-full text-sm leading-relaxed text-muted">
                        {project.description}
                    </p>
                )}
            </div>
        </Card>
    );
}

/** Same footprint as a ProjectCard, shown while projects load on the client. */
export function ProjectCardSkeleton({ className }: { className?: string }) {
    return (
        <Card padding="none" className={cn("overflow-hidden", className)} aria-hidden>
            <Skeleton className="aspect-[16/10] rounded-none" />
            <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
            </div>
        </Card>
    );
}
