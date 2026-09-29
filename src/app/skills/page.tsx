import type { Metadata } from "next";
import Skills from "@/components/sections/Skills";
import { getSkillsData } from "@/components/sections/skills/data";
import { Page, PageHeader } from "@/components/ui";
import { getCopy } from "@/lib/copy/server";
import { SITE_URL } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getCopy();
    return {
        title: t("skills.seoTitle") || undefined,
        description: t("skills.seoDescription") || undefined,
        alternates: {
            canonical: './',
        },
    };
}

export const revalidate = 0; // Revalidate immediately (dynamic)

export default async function SkillsPage() {
    // Read on the server so the page arrives complete (defaults only if the read fails)
    const [skillsData, t] = await Promise.all([getSkillsData(), getCopy()]);

    const breadcrumbs = {
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
            "name": t("skills.title"),
            "item": `${SITE_URL}/skills`
        }]
    };

    return (
        <Page>
            <PageHeader title={t("skills.title")} description={t("skills.description")} />
            <Skills data={skillsData} />
            <script
                type="application/ld+json"
                // "<" is escaped so a dashboard text can never close the script tag
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }}
            />
        </Page>
    );
}
