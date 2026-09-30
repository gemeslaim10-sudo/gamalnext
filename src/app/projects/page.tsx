import type { Metadata } from "next";
import Projects from "@/components/projects/Projects";
import { Page, PageHeader } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCopy } from "@/lib/copy/server";
import { getProjects, projectImage } from "@/lib/content/server";
import { getSiteSeo, pageMetadata } from "@/lib/seo/server";
import { breadcrumbs, itemList, pageGraph, webPage } from "@/lib/seo/structured-data";
import type { ProjectsData } from "@/types";

// Title, description and keywords: /admin/seo → Pages → Projects
export async function generateMetadata(): Promise<Metadata> {
    return pageMetadata("projects");
}

export default async function ProjectsPage() {
    const [projects, t, site] = await Promise.all([getProjects(), getCopy(), getSiteSeo()]);
    const titled = (projects ?? []).filter((project) => project.title || project.name);

    return (
        <Page>
            <PageHeader title={t("projects.title")} description={t("projects.description")} />
            {/* Without server data (read failed) the list shows a skeleton and loads on the client */}
            <Projects initialData={projects ? ({ items: projects } as ProjectsData) : undefined} />
            <JsonLd
                data={pageGraph(
                    webPage("CollectionPage", "/projects", t("projects.title"), site.fill(site.seo.pages.projects.description), {
                        mainEntity: itemList(
                            titled.map((project) => ({
                                name: String(project.title || project.name),
                                url: `/projects/${project.urlSlug}`,
                                image: projectImage(project),
                                description: project.description ? String(project.description).slice(0, 200) : undefined,
                            }))
                        ),
                    }),
                    breadcrumbs([
                        { name: t("nav.home"), path: "/" },
                        { name: t("projects.title"), path: "/projects" },
                    ])
                )}
            />
        </Page>
    );
}
