import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui";
import { getCategoryBadge } from "@/components/projects/categories";
import type { CopyKey } from "@/config/copy";
import type { ProjectData } from "../types";

export interface ProjectFact {
    label: string;
    value: ReactNode;
}

function hostname(url: string) {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
}

function ExternalValue({ href, children }: { href: string; children: ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-0 items-center justify-end gap-1 underline-offset-4 hover:underline"
        >
            <span className="truncate">{children}</span>
            <ArrowUpRight aria-hidden className="size-3.5 shrink-0 text-subtle" />
        </a>
    );
}

/** The facts we know about a project (only the ones that are filled in). `t` = the page's copy. */
export function getProjectFacts(project: ProjectData, t: (key: CopyKey) => string): ProjectFact[] {
    const facts: ProjectFact[] = [];
    const category = getCategoryBadge(project.category, t);
    // The video link only applies to video projects (same rule as before)
    const video = project.category === "video" ? project.videoUrl : undefined;

    if (category) facts.push({ label: t("projects.detailCategory"), value: <span className="block truncate">{category}</span> });
    if (project.link) {
        facts.push({ label: t("projects.detailWebsite"), value: <ExternalValue href={project.link}>{hostname(project.link)}</ExternalValue> });
    }
    if (video) facts.push({ label: t("projects.detailVideo"), value: <ExternalValue href={video}>{t("projects.watchVideo")}</ExternalValue> });
    return facts;
}

/** Key facts about a project as a small definition list. */
export default function ProjectFacts({ facts, title }: { facts: ProjectFact[]; title: string }) {
    if (facts.length === 0) return null;

    return (
        <Card padding="sm">
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            <dl className="mt-2 divide-y divide-border text-sm">
                {facts.map((fact, index) => (
                    // By position: two rows could share a label if the owner gives them the same text
                    <div key={index} className="flex items-center justify-between gap-4 py-2.5 last:pb-0">
                        <dt className="shrink-0 text-subtle">{fact.label}</dt>
                        <dd className="min-w-0 text-right text-foreground">{fact.value}</dd>
                    </div>
                ))}
            </dl>
        </Card>
    );
}
