import type { Metadata } from "next";
import { PenLine } from "lucide-react";
import { getCollection } from "@/lib/server-utils";
import { getCopy } from "@/lib/copy/server";
import { ButtonLink, Page, PageHeader } from "@/components/ui";
import type { ArticleRaw, ArticleSerialized } from "@/types";
import { getTimestampMs } from "@/types";
import ArticlesList from "./ArticlesList";

// Shared links use the site-wide share card with this title and description (see the root layout)
export async function generateMetadata(): Promise<Metadata> {
    const t = await getCopy();
    return {
        title: t("blog.seoTitle"),
        description: t("blog.seoDescription"),
        alternates: {
            canonical: './',
        },
    };
}

export const revalidate = 0; // Helper for dynamic

export default async function ArticlesPage() {
    // Fetch articles on server
    let articles: ArticleSerialized[] = [];
    try {
        const rawArticles = await getCollection<ArticleRaw>("articles");
        // Sort by createdAt desc
        articles = rawArticles.sort((a, b) => {
            const dateA = getTimestampMs(a.createdAt);
            const dateB = getTimestampMs(b.createdAt);
            return dateB - dateA;
        }).map((article) => ({
            ...article,
            // Serialize timestamps to numbers to pass to Client Component
            createdAt: getTimestampMs(article.createdAt) || 0,
            updatedAt: getTimestampMs(article.updatedAt) || null
        }));
    } catch (e) {
        console.error("Failed to fetch articles server side", e);
    }

    const t = await getCopy();

    return (
        <Page>
            <PageHeader
                title={t("blog.title")}
                description={t("blog.description")}
                actions={
                    <ButtonLink href="/write" variant="secondary">
                        <PenLine />
                        {t("blog.writeButton")}
                    </ButtonLink>
                }
            />
            {/* An empty server result can also mean the read failed, so the list then loads on the
                client (skeleton first) instead of flashing "no articles" */}
            <ArticlesList initialArticles={articles.length > 0 ? articles : undefined} />
        </Page>
    );
}
