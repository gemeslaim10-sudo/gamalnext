import FeedClient from "@/components/feed/FeedClient";
import type { FeedInitialPage } from "@/components/feed/hooks/useFeed";
import OwnerProfile from "@/components/feed/OwnerProfile";
import { Container } from "@/components/ui";
import { getProjects } from "@/lib/content/server";
import { projectGalleries } from "@/lib/content/shared";
import { getFeedPage } from "@/lib/feed/server";

// Title and description come from the site-wide SEO in the root layout (/admin/seo)
export default async function HomePage() {
    // The first posts arrive with the page (cached): no loading state, and search engines and AI
    // assistants see real content. Later pages load while scrolling.
    // Every project's images too (same cached read), so the image viewer can go through all of them.
    const [firstPage, projects] = await Promise.all([getFeedPage(1), getProjects()]);

    return (
        <Container className="py-6 sm:py-10">
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
