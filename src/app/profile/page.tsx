import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import FeaturedProjects from "@/components/projects/FeaturedProjects";
import TrendingArticles from "@/components/articles/TrendingArticles";
import Reviews from "@/components/reviews/Reviews";
import { Container } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCopy } from "@/lib/copy/server";
import { getSiteSeo, pageMetadata } from "@/lib/seo/server";
import { PERSON_ID, breadcrumbs, pageGraph, webPage } from "@/lib/seo/structured-data";

// Title, description and keywords: /admin/seo → Pages → Profile
export async function generateMetadata(): Promise<Metadata> {
    return pageMetadata("profile");
}

export default async function ProfilePage() {
    const [t, site] = await Promise.all([getCopy(), getSiteSeo()]);

    return (
        <Container>
            {/* Tells search engines and AI assistants this page is about the founder (details in the site-wide data) */}
            <JsonLd
                data={pageGraph(
                    webPage("ProfilePage", "/profile", site.fill(site.seo.pages.profile.title) || site.ownerName, site.fill(site.seo.pages.profile.description), {
                        mainEntity: { "@id": PERSON_ID },
                    }),
                    breadcrumbs([
                        { name: t("nav.home"), path: "/" },
                        { name: t("nav.profile"), path: "/profile" },
                    ])
                )}
            />
            <Hero />
            <Services />
            <FeaturedProjects />
            <TrendingArticles />
            <Reviews />
        </Container>
    );
}
