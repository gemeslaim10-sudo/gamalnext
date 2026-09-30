import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { servicesFor } from "@/lib/services/server";
import { Page } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCopy } from "@/lib/copy/server";
import { getProjects, projectImage, projectSlug, type Project } from "@/lib/content/server";
import { projectGalleries, projectImages } from "@/lib/content/shared";
import { absoluteUrl, getSiteOpenGraph, getSiteSeo } from "@/lib/seo/server";
import { ORGANIZATION_ID, breadcrumbs, pageGraph } from "@/lib/seo/structured-data";
import { cn, slugify, textDirStyle } from "@/lib/utils";

import RelatedProjects from "./RelatedProjects";
import ProjectHeader from "./components/ProjectHeader";
import ProjectFacts, { getProjectFacts } from "./components/ProjectFacts";
import ProjectGallery from "./components/ProjectGallery";


type Props = { params: Promise<{ slug: string }> };

/** Every project page is built ahead of time; new projects are built on their first visit. */
export async function generateStaticParams() {
    const projects = (await getProjects()) ?? [];
    return projects.filter((project) => project.urlSlug).map((project) => ({ slug: project.urlSlug }));
}

// Cached with the rest of the site content; shared by generateMetadata and the page
const getProjectData = cache(async (slug: string) => {
    const projects = await getProjects();
    // A failed read must not be cached as "not found"
    if (!projects) throw new Error("Projects couldn't be read");

    const searchSlug = decodeURIComponent(slug);

    // Old feed links used the position (e.g. proj-1)
    const idxMatch = searchSlug.match(/^proj-(\d+)$/);
    if (idxMatch) {
        const idx = parseInt(idxMatch[1], 10);
        if (projects[idx]) return { project: projects[idx], allProjects: projects };
    }

    // Find matching project by slug, id, or slugified title
    const project =
        projects.find((p: Project) => {
            const titleSlug = p.title || p.name ? decodeURIComponent(slugify(p.title || p.name || "")) : "";
            const pSlug = p.slug ? decodeURIComponent(p.slug) : titleSlug;
            return pSlug === searchSlug || titleSlug === searchSlug || p.id === searchSlug;
        }) || null;

    return { project, allProjects: projects };
});

/**
 * Search description of a project without one: only what the project data says (its name and
 * technologies), so every project page has its own description instead of the generic one.
 */
function factualDescription(project: Project, name: string, businessName: string, ownerName: string) {
    const tech = String(project.tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 4);
    const built = tech.length > 1 ? `, built with ${tech.slice(0, -1).join(", ")} and ${tech.at(-1)}` : tech.length === 1 ? `, built with ${tech[0]}` : "";
    return excerpt(`${name}: a project by ${businessName} (${ownerName})${built}. Screenshots and details of the work.`);
}

/** First `max` characters of a text on one line, for the search description. */
function excerpt(text: string, max = 160) {
    const flat = text.replace(/\s+/g, " ").trim();
    return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const [{ project }, t, site] = await Promise.all([getProjectData(slug), getCopy(), getSiteSeo()]);

    if (!project) {
        return { title: t("projects.notFoundTitle"), robots: { index: false, follow: true } };
    }

    const name: string = String(project.title || project.name || "").trim() || t("projects.title");
    const image = projectImage(project);

    return {
        title: name,
        description: project.description ? excerpt(String(project.description)) : factualDescription(project, name, site.businessName, site.ownerName),
        ...(project.tags ? { keywords: String(project.tags).split(",").map((tag) => tag.trim()).filter(Boolean) } : {}),
        // One address per project, whichever link was followed (old feed links used the position)
        alternates: { canonical: `/projects/${projectSlug(project)}` },
        // Shared links (X follows): this title and description, plus the project's image when it has one
        openGraph: { ...(await getSiteOpenGraph()), url: `/projects/${projectSlug(project)}`, ...(image ? { images: [image] } : {}) },
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
    const allImages = projectImages(project);
    const facts = getProjectFacts(project, t);

    const path = `/projects/${projectSlug(project)}`;

    // Every project's images: the viewer goes from this project's last image straight on to the
    // next project's first one (and back)
    const galleries = projectGalleries(allProjects);
    const current = galleries.findIndex((gallery) => gallery.href === path);
    const sequence = current >= 0 ? { groups: galleries, current } : undefined;

    // Case study sections (only the ones written in the dashboard) and the matching service pages
    const features = String(project.features || "")
        .split("\n")
        .map((line) => line.replace(/^\s*[-*•]\s*/, "").trim())
        .filter(Boolean);
    const caseStudy = [
        { title: t("projects.challengeTitle"), text: String(project.challenge || "").trim() },
        { title: t("projects.solutionTitle"), text: String(project.solution || "").trim() },
    ].filter((part) => part.text);
    const results = String(project.results || "").trim();
    const services = await servicesFor("projects", [title, project.tags, project.category, project.description]);
    const jsonLd = pageGraph(
        {
            "@type": "CreativeWork",
            "@id": `${absoluteUrl(path)}#project`,
            name: title,
            url: absoluteUrl(path),
            description: project.description ? String(project.description) : undefined,
            image: allImages,
            keywords: tags.join(", "),
            genre: project.category ? String(project.category) : undefined,
            creator: { "@id": ORGANIZATION_ID },
            publisher: { "@id": ORGANIZATION_ID },
            // The services this project shows (their pages describe them)
            about: services.map((service) => ({ "@id": `${absoluteUrl(service.href)}#service` })),
            sameAs: typeof project.link === "string" && /^https?:\/\//.test(project.link) ? project.link : undefined,
            inLanguage: "en",
        },
        breadcrumbs([
            { name: t("nav.home"), path: "/" },
            { name: t("projects.title"), path: "/projects" },
            { name: title, path },
        ])
    );

    return (
        <Page>
            <JsonLd data={jsonLd} />
            <ProjectHeader project={project} title={title} tags={tags} />

            <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
                <div className={cn("min-w-0 space-y-8", facts.length > 0 ? "lg:col-span-2" : "lg:col-span-3")}>
                    <ProjectGallery title={title} images={allImages} sequence={sequence} />

                    {typeof project.embedCode === "string" && project.embedCode && (
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

                    {caseStudy.map((part) => (
                        <section key={part.title} className="max-w-content">
                            <h2 className="text-base font-semibold text-foreground">{part.title}</h2>
                            <p style={textDirStyle(part.text)} className="mt-2 whitespace-pre-line break-words text-[15px] leading-7 text-muted">
                                {part.text}
                            </p>
                        </section>
                    ))}

                    {features.length > 0 && (
                        <section className="max-w-content">
                            <h2 className="text-base font-semibold text-foreground">{t("projects.featuresTitle")}</h2>
                            <ul className="mt-2 list-disc space-y-1 ps-5 text-[15px] leading-7 text-muted">
                                {features.map((feature) => (
                                    <li key={feature} style={textDirStyle(feature)}>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {results && (
                        <section className="max-w-content">
                            <h2 className="text-base font-semibold text-foreground">{t("projects.resultsTitle")}</h2>
                            <p style={textDirStyle(results)} className="mt-2 whitespace-pre-line break-words text-[15px] leading-7 text-muted">
                                {results}
                            </p>
                        </section>
                    )}

                    {services.length > 0 && (
                        <section className="max-w-content rounded-card border border-border bg-surface p-5">
                            <h2 className="text-base font-semibold text-foreground">{t("projects.relatedServices")}</h2>
                            <ul className="mt-3 space-y-3">
                                {services.map((service) => (
                                    <li key={service.href}>
                                        <Link href={service.href} className="group inline-flex items-center gap-1.5 font-medium text-foreground hover:underline hover:underline-offset-4">
                                            {service.name}
                                            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                                        </Link>
                                        {service.summary && <p className="mt-0.5 text-sm leading-relaxed text-muted">{service.summary}</p>}
                                    </li>
                                ))}
                            </ul>
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
