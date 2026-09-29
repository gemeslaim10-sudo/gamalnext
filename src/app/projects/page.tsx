import type { Metadata } from "next";
import Projects from "@/components/projects/Projects";
import { Page, PageHeader } from "@/components/ui";
import { SITE_URL } from "@/lib/constants";
import { getDocument } from "@/lib/server-utils";
import { getCopy } from "@/lib/copy/server";
import type { ProjectsData } from "@/types";

// Shared links use the site-wide share card with this title and description (see the root layout)
export async function generateMetadata(): Promise<Metadata> {
    const t = await getCopy();
    return {
        title: t("projects.seoTitle"),
        description: t("projects.seoDescription"),
        alternates: {
            canonical: './',
        },
    };
}

export const revalidate = 0; // Revalidate immediately (dynamic)

export default async function ProjectsPage() {
    const [projectsData, t] = await Promise.all([
        getDocument<ProjectsData>("site_content", "projects"),
        getCopy(),
    ]);

    return (
        <Page>
            <PageHeader title={t("projects.title")} description={t("projects.description")} />
            {/* Without server data (read failed) the list shows a skeleton and loads on the client */}
            <Projects initialData={projectsData ?? undefined} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [{
                            "@type": "ListItem",
                            "position": 1,
                            "name": t("nav.home"),
                            "item": SITE_URL
                        }, {
                            "@type": "ListItem",
                            "position": 2,
                            "name": t("projects.title"),
                            "item": `${SITE_URL}/projects`
                        }]
                    })
                }}
            />
        </Page>
    );
}
