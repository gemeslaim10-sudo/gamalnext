import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FeedClient from "@/components/feed/FeedClient";
import type { FeedInitialPage } from "@/components/feed/hooks/useFeed";
import OwnerProfile from "@/components/feed/OwnerProfile";
import { Container, buttonVariants } from "@/components/ui";
import { getCopy } from "@/lib/copy/server";
import { getProjects } from "@/lib/content/server";
import { projectGalleries } from "@/lib/content/shared";
import { getFeedPage } from "@/lib/feed/server";
import { servicePath } from "@/lib/services/content";
import { getServicePages } from "@/lib/services/server";

// Title and description come from the site-wide SEO in the root layout (/admin/seo)
export default async function HomePage() {
    // The first posts arrive with the page (cached): no loading state, and search engines and AI
    // assistants see real content. Later pages load while scrolling.
    // Every project's images too (same cached read), so the image viewer can go through all of them.
    const [firstPage, projects, services, t] = await Promise.all([getFeedPage(1), getProjects(), getServicePages("en"), getCopy()]);

    return (
        <Container className="py-6 sm:py-10">
            {/* What GTech does, first thing on the page (the H1), with a way into each service */}
            <header className="mx-auto mb-6 max-w-content sm:mb-8 lg:max-w-none xl:max-w-[64.5rem]">
                <h1 className="max-w-3xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{t("home.introTitle")}</h1>
                <p className="mt-3 max-w-3xl leading-relaxed text-muted">{t("home.introText")}</p>
                {services.length > 0 && (
                    <nav aria-label={t("home.allServices")} className="mt-5 flex flex-wrap gap-2">
                        {services.map((service) => (
                            <Link key={service.slug} href={servicePath(service.slug)} className={buttonVariants({ variant: "secondary", size: "sm" })}>
                                {service.en.name}
                            </Link>
                        ))}
                        <Link href="/services" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                            {t("home.allServices")} <ArrowRight aria-hidden />
                        </Link>
                    </nav>
                )}
            </header>

            <div className="mx-auto grid max-w-content gap-6 lg:max-w-none lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[20rem_minmax(0,42rem)] xl:justify-center">
                <aside className="lg:sticky lg:top-20 lg:self-start">
                    <OwnerProfile />
                </aside>
                {/* Same JSON the feed API returns while scrolling */}
                <FeedClient initialPage={firstPage as FeedInitialPage | null} projectGalleries={projectGalleries(projects ?? [])} />
            </div>
        </Container>
    );
}
