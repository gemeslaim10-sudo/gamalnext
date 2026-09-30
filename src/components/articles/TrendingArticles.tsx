import { ArrowRight } from "lucide-react";
import { getPublicArticles } from "@/lib/content/server";
import { ButtonLink, Section } from "@/components/ui";
import { getCopy } from "@/lib/copy/server";
import { cn } from "@/lib/utils";
import { ArticleCard, hasAnyCover } from "./ArticleCard";
import type { ArticleSerialized } from "@/types";

/** Phones show the first few cards; the rest appear from the 2-column breakpoint up. */
const PHONE_LIMIT = 3;

/** The six newest published articles (articles waiting for review stay out). */
async function getTrendingArticles(): Promise<ArticleSerialized[]> {
    return ((await getPublicArticles()) ?? []).slice(0, 6);
}

/** "Latest articles" on the profile page. Title and link text: /admin/copy → Profile page. */
export default async function TrendingArticles() {
    const [articles, t] = await Promise.all([getTrendingArticles(), getCopy()]);
    if (articles.length === 0) return null;

    const showCovers = hasAnyCover(articles);
    const viewAll = t("profile.articlesViewAll").trim();

    return (
        <Section
            id="articles"
            title={t("profile.articlesTitle")}
            action={
                viewAll && (
                    <ButtonLink href="/articles" variant="ghost">
                        {viewAll}
                        <ArrowRight />
                    </ButtonLink>
                )
            }
        >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article, index) => (
                    <ArticleCard
                        key={article.id}
                        article={article}
                        showCover={showCovers}
                        className={cn(index >= PHONE_LIMIT && "hidden sm:flex")}
                    />
                ))}
            </div>
        </Section>
    );
}
