import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDocument, getCollection } from "@/lib/server-utils";
import { getCopy } from "@/lib/copy/server";
import { SHARE_IMAGE, getSiteOpenGraph, getSiteSeo } from "@/lib/seo/server";
import { SITE_URL } from "@/lib/constants";
import ArticleView from "./ArticleView";
import type { ArticleRaw } from "@/types";
import { getTimestampMs } from "@/types";

type Props = {
    params: Promise<{ id: string }>;
};

// Cached per request: generateMetadata and the page share one read
const getArticle = cache((id: string) => getDocument<ArticleRaw>("articles", id));

/** The first image of the article (its cover), if any. */
function coverImage(article: ArticleRaw) {
    return article.media?.find((item) => item.type === "image" && item.url)?.url;
}

/** Markdown → one line of plain text, cut at a word boundary (for search and share descriptions). */
function plainExcerpt(markdown: string, max = 155) {
    const text = markdown
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → their text
        .replace(/^\s{0,3}(?:#{1,6}|>|[-*+]|\d+\.)\s+/gm, "") // headings, quotes, list markers
        .replace(/[*_`~]+/g, "") // emphasis and code marks
        .replace(/\s+/g, " ")
        .trim();
    if (text.length <= max) return text;
    const cut = text.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");
    return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/** Search description: the article's summary, else the start of its text. */
function describe(article: ArticleRaw) {
    return article.summary?.trim() || plainExcerpt(article.content || "");
}

// Generate SEO Metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const [article, t] = await Promise.all([getArticle(id), getCopy()]);

    if (!article) {
        return {
            title: t("blog.notFoundTitle"),
        };
    }

    const [{ ownerName }, siteOpenGraph] = await Promise.all([getSiteSeo(), getSiteOpenGraph()]);
    const cover = coverImage(article);

    return {
        title: t("blog.articleSeoTitle", { title: article.title }),
        description: describe(article) || t("blog.seoDescription"),
        // The article's tags; without tags the site-wide keywords stay (the key must then be absent)
        ...(article.tags?.length ? { keywords: article.tags } : {}),
        alternates: {
            canonical: `/articles/${id}`,
        },
        // Shared links (X follows): the site-wide card with this title and description, the
        // article's cover image when it has one, and the article details
        openGraph: {
            ...siteOpenGraph,
            ...(cover && { images: [cover] }),
            type: 'article',
            publishedTime: new Date(getTimestampMs(article.createdAt) || Date.now()).toISOString(),
            authors: [article.authorName || ownerName],
        },
    };
}

export async function generateStaticParams() {
    const articles = await getCollection<ArticleRaw>('articles');
    return articles.map((article) => ({
        id: article.id,
    }));
}

export const revalidate = 0;

export default async function ArticlePage({ params }: Props) {
    const { id } = await params;
    const article = await getArticle(id);

    if (!article) {
        notFound();
    }

    // Owner and site name from the dashboard settings (the same cached read as the root layout)
    const { ownerName, siteName } = await getSiteSeo();
    const cover = coverImage(article);

    // eslint-disable-next-line react-hooks/purity
    const createdAtMs = getTimestampMs(article.createdAt) || Date.now();
    const updatedAtMs = getTimestampMs(article.updatedAt) || null;

    // Serialize ID and date
    const serializedArticle = {
        ...article,
        id: id,
        createdAt: createdAtMs,
        updatedAt: updatedAtMs
    };

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        image: [cover || `${SITE_URL}${SHARE_IMAGE.url}`],
        datePublished: new Date(createdAtMs).toISOString(),
        dateModified: updatedAtMs ? new Date(updatedAtMs).toISOString() : new Date(createdAtMs).toISOString(),
        author: {
            '@type': 'Person',
            name: article.authorName || ownerName,
            url: SITE_URL
        },
        publisher: {
            '@type': 'Organization',
            name: siteName,
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/icon.png`
            }
        },
        description: describe(article),
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/articles/${id}`
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ArticleView article={serializedArticle} />
        </>
    );
}
