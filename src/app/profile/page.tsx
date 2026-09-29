import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import FeaturedProjects from "@/components/projects/FeaturedProjects";
import TrendingArticles from "@/components/articles/TrendingArticles";
import Reviews from "@/components/reviews/Reviews";
import { Container } from "@/components/ui";
import { getCopy } from "@/lib/copy/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getCopy();
    return {
        title: t("profile.seoTitle") || undefined,
        description: t("profile.seoDescription") || undefined,
    };
}

export const revalidate = 0; // Revalidate immediately (dynamic)

export default function ProfilePage() {
    return (
        <Container>
            <Hero />
            <Services />
            <FeaturedProjects />
            <TrendingArticles />
            <Reviews />
        </Container>
    );
}
