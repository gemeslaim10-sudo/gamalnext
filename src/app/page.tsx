import FeedClient from "@/components/feed/FeedClient";
import OwnerProfile from "@/components/feed/OwnerProfile";
import { Container } from "@/components/ui";

// Title and description come from the site-wide SEO in the root layout (/admin/copy → SEO)
export default function HomePage() {
    return (
        <Container className="py-6 sm:py-10">
            <div className="mx-auto grid max-w-content gap-6 lg:max-w-none lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[20rem_minmax(0,42rem)] xl:justify-center">
                <aside className="lg:sticky lg:top-20 lg:self-start">
                    <OwnerProfile />
                </aside>
                <FeedClient />
            </div>
        </Container>
    );
}
