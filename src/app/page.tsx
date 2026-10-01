import Link from "next/link";
import FeedClient from "@/components/feed/FeedClient";
import type { FeedInitialPage } from "@/components/feed/hooks/useFeed";
import OwnerProfile from "@/components/feed/OwnerProfile";
import { Container } from "@/components/ui";
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
            {/* What GTech does (the page's H1) in one short line, and a quiet line of links into each
                service. The owner's card below already carries the longer introduction. */}
            <header className="mx-auto mb-5 max-w-content sm:mb-6 lg:max-w-none xl:max-w-[64.5rem]">
                <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{t("home.introTitle")}</h1>
                {services.length > 0 && (
                    <nav aria-label={t("nav.services")} className="mt-1.5">
                        <ul className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                            {services.map((service, index) => (
                                <li key={service.slug} className="flex items-center gap-x-2">
                                    <Link href={servicePath(service.slug)} className="transition-colors hover:text-foreground">
                                        {service.en.label.trim() || service.en.name}
                                    </Link>
                                    {/* After the item, so a wrapped line never starts with a dot */}
                                    {index < services.length - 1 && (
                                        <span aria-hidden className="text-subtle">
                                            ·
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
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
