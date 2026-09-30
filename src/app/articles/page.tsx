import type { Metadata } from "next";
import { PenLine } from "lucide-react";
import { getCopy } from "@/lib/copy/server";
import { ButtonLink, Page, PageHeader } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublicArticles } from "@/lib/content/server";
import { getSiteSeo, pageMetadata } from "@/lib/seo/server";
import { ORGANIZATION_ID, breadcrumbs, pageGraph, webPage } from "@/lib/seo/structured-data";
import { absoluteUrl } from "@/lib/seo/server";
import ArticlesList from "./ArticlesList";

// Title, description and keywords: /admin/seo → Pages → Blog
export async function generateMetadata(): Promise<Metadata> {
    return pageMetadata("articles");
}

export default async function ArticlesPage() {
    // Published articles only (cached; refreshed when an article is published, edited or deleted)
    const [articles, t, site] = await Promise.all([getPublicArticles(), getCopy(), getSiteSeo()]);

    return (
        <Page>
            <JsonLd
                data={pageGraph(
                    webPage("Blog", "/articles", t("blog.title"), site.fill(site.seo.pages.articles.description), {
                        publisher: { "@id": ORGANIZATION_ID },
                        blogPost: (articles ?? []).slice(0, 20).map((article) => ({
                            "@type": "BlogPosting",
                            headline: article.title,
                            url: absoluteUrl(`/articles/${article.id}`),
                            datePublished: article.createdAt ? new Date(article.createdAt).toISOString() : undefined,
                            description: article.summary || undefined,
                        })),
                    }),
                    breadcrumbs([
                        { name: t("nav.home"), path: "/" },
                        { name: t("blog.title"), path: "/articles" },
                    ])
                )}
            />
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
            {/* Without server data (read failed) the list loads on the client (skeleton first)
                instead of flashing "no articles" */}
            <ArticlesList initialArticles={articles && articles.length > 0 ? articles : undefined} />
        </Page>
    );
}
