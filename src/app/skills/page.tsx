import type { Metadata } from "next";
import Skills from "@/components/sections/Skills";
import { getSkillsData } from "@/components/sections/skills/data";
import { Page, PageHeader } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCopy } from "@/lib/copy/server";
import { getSiteSeo, pageMetadata } from "@/lib/seo/server";
import { breadcrumbs, pageGraph, serviceNodes, webPage } from "@/lib/seo/structured-data";

// Title, description and keywords: /admin/seo → Pages → Services & skills
export async function generateMetadata(): Promise<Metadata> {
    return pageMetadata("skills");
}

export default async function SkillsPage() {
    // Read on the server (cached) so the page arrives complete (defaults only if the read fails)
    const [skillsData, t, site] = await Promise.all([getSkillsData(), getCopy(), getSiteSeo()]);
    const services = (skillsData.mainSkills ?? []).filter((skill) => skill.title?.trim());

    return (
        <Page>
            <PageHeader title={t("skills.title")} description={t("skills.description")} />
            <Skills data={skillsData} />
            {/* The services, each offered by the company (details in the site-wide data) */}
            <JsonLd
                data={pageGraph(
                    webPage("WebPage", "/skills", t("skills.title"), site.fill(site.seo.pages.skills.description)),
                    ...serviceNodes(
                        services.map((skill) => ({ name: skill.title.trim(), description: skill.description?.trim() || undefined })),
                        "/skills"
                    ),
                    breadcrumbs([
                        { name: t("nav.home"), path: "/" },
                        { name: t("skills.title"), path: "/skills" },
                    ])
                )}
            />
        </Page>
    );
}
