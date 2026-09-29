import { cache } from "react";
import type { Metadata } from "next";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import { Page } from "@/components/ui";
import { getCopy } from "@/lib/copy/server";
import { getSiteOpenGraph } from "@/lib/seo/server";
import { cn, slugify, textDirStyle } from "@/lib/utils";

import RelatedProjects from "./RelatedProjects";
import ProjectHeader from "./components/ProjectHeader";
import ProjectFacts, { getProjectFacts } from "./components/ProjectFacts";
import ProjectGallery from "./components/ProjectGallery";
import type { ProjectData } from "./types";

export const revalidate = 3600; // Cache for 1 hour

type Props = { params: Promise<{ slug: string }> };

// Cached per request: generateMetadata and the page share one read
const getProjectData = cache(async (slug: string) => {
    try {
        const snap = await getDoc(doc(db, "site_content", "projects"));
        if (!snap.exists()) return { project: null, allProjects: [] };
        const data = snap.data();
        const projects = data.items || [];

        const searchSlug = decodeURIComponent(slug);

        // Handle sidebar generated IDs (e.g. proj-1)
        const idxMatch = searchSlug.match(/^proj-(\d+)$/);
        if (idxMatch) {
            const idx = parseInt(idxMatch[1], 10);
            if (projects[idx]) return { project: projects[idx], allProjects: projects };
        }

        // Find matching project by slug, id, or slugified title
        const project = projects.find((p: ProjectData) => {
            const titleSlug = p.title || p.name ? decodeURIComponent(slugify(p.title || p.name || '')) : '';
            const pSlug = p.slug ? decodeURIComponent(p.slug) : titleSlug;
            return pSlug === searchSlug || titleSlug === searchSlug || p.id === searchSlug;
        }) || null;

        return { project, allProjects: projects };
    } catch (e) {
        console.error("Error fetching project:", e);
        return { project: null, allProjects: [] };
    }
});

/** First `max` characters of a text on one line, for the search description. */
function excerpt(text: string, max = 160) {
    const flat = text.replace(/\s+/g, " ").trim();
    return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const [{ project }, t] = await Promise.all([getProjectData(slug), getCopy()]);

    if (!project) {
        return { title: t("projects.notFoundTitle") };
    }

    const name: string = String(project.title || project.name || "").trim() || t("projects.title");
    const image: string | undefined = project.image || project.imageUrl || project.images?.[0];

    return {
        title: t("projects.projectSeoTitle", { title: name }),
        description: project.description ? excerpt(project.description) : t("projects.seoDescription"),
        // Shared links (X follows): the site-wide card with this title and description, plus the
        // project's image when it has one. The key is left out otherwise (an undefined value would
        // erase the site-wide card instead of inheriting it).
        ...(image && { openGraph: { ...(await getSiteOpenGraph()), images: [image] } }),
    };
}

export default async function ProjectDetailsPage({ params }: Props) {
    const { slug } = await params;
    const [{ project, allProjects }, t] = await Promise.all([getProjectData(slug), getCopy()]);

    if (!project) {
        notFound();
    }

    const title: string = project.title || project.name || "";
    const tags = project.tags
        ? project.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : [];

    // Main image first, then the gallery
    const allImages = [project.image, ...(project.gallery || [])].filter(Boolean) as string[];
    const facts = getProjectFacts(project, t);

    return (
        <Page>
            <ProjectHeader project={project} title={title} tags={tags} />

            <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
                <div className={cn("min-w-0 space-y-8", facts.length > 0 ? "lg:col-span-2" : "lg:col-span-3")}>
                    <ProjectGallery title={title} images={allImages} />

                    {project.embedCode && (
                        <div
                            className="aspect-video overflow-hidden rounded-card border border-border bg-surface-hover [&_iframe]:size-full"
                            dangerouslySetInnerHTML={{ __html: project.embedCode }}
                        />
                    )}

                    {project.description && (
                        <section className="max-w-content">
                            <h2 className="text-base font-semibold text-foreground">{t("projects.aboutTitle")}</h2>
                            <p
                                style={textDirStyle(project.description)}
                                className="mt-2 whitespace-pre-line break-words text-[15px] leading-7 text-muted"
                            >
                                {project.description}
                            </p>
                        </section>
                    )}
                </div>

                {facts.length > 0 && (
                    <aside className="lg:sticky lg:top-20 lg:self-start">
                        <ProjectFacts facts={facts} title={t("projects.detailsTitle")} />
                    </aside>
                )}
            </div>

            <RelatedProjects project={project} allProjects={allProjects} />
        </Page>
    );
}
