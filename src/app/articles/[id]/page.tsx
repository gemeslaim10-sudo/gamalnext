import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCopy } from "@/lib/copy/server";
import { getArticle, getPublicArticles, isPublicArticle } from "@/lib/content/server";
import { markdownExcerpt } from "@/lib/articles/plainText";
import { SHARE_IMAGE, absoluteUrl, getSiteOpenGraph, getSiteSeo } from "@/lib/seo/server";
import { ORGANIZATION_ID, PERSON_ID, breadcrumbs, pageGraph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import ArticleView from "./ArticleView";
import type { ArticleRaw } from "@/types";
import { getTimestampMs } from "@/types";

type Props = {
    params: Promise<{ id: string }>;
};

/** The article if visitors may see it; throws when the database couldn't be read (never cached as "not found"). */
async function getPublishedArticle(id: string) {
    const article = await getArticle(id);
    if (article === undefined) throw new Error(`Article ${id} couldn't be read`);
    return article && isPublicArticle(article) ? article : null;
}

/** Arabic when most letters of the title and text are Arabic. */
function articleLanguage(article: ArticleRaw) {
    const text = `${article.title ?? ""} ${article.content ?? ""}`.slice(0, 2000);
    const letters = text.match(/\p{L}/gu)?.length ?? 0;
    const arabic = text.match(/[؀-ۿ]/g)?.length ?? 0;
    return letters > 0 && arabic / letters > 0.3 ? "ar" : "en";
}

/** The first image of the article (its cover), if any. */
function coverImage(article: ArticleRaw) {
    return article.media?.find((item) => item.type === "image" && item.url)?.url;
}

/** Search description: the article's summary, else the start of its text. */
function describe(article: ArticleRaw) {
    return article.summary?.trim() || markdownExcerpt(article.content || "");
}

// Generate SEO Metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const [article, t] = await Promise.all([getPublishedArticle(id), getCopy()]);

    if (!article) {
        return {
            title: t("blog.notFoundTitle"),
            robots: { index: false, follow: true },
        };
    }

    const [site, siteOpenGraph] = await Promise.all([getSiteSeo(), getSiteOpenGraph()]);
    const { ownerName } = site;
    const cover = coverImage(article);

    return {
        title: article.title,
        description: describe(article) || site.fill(site.seo.pages.articles.description),
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

/** Every published article is built ahead of time; new ones are built on their first visit. */
export async function generateStaticParams() {
    const articles = (await getPublicArticles()) ?? [];
    return articles.map((article) => ({ id: article.id }));
}

export default async function ArticlePage({ params }: Props) {
    const { id } = await params;
    const article = await getPublishedArticle(id);

    if (!article) {
        notFound();
    }

    // Owner and site name from the dashboard settings (the same cached read as the root layout)
    const [{ ownerName }, t] = await Promise.all([getSiteSeo(), getCopy()]);
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

    // Up to three other published articles (from the same cache as the blog page)
    const related = ((await getPublicArticles()) ?? [])
        .filter((other) => other.id !== id)
        .slice(0, 3)
        .map((other) => ({
            id: other.id,
            title: other.title,
            summary: other.summary,
            content: (other.content || "").slice(0, 400),
            media: other.media,
            createdAt: other.createdAt,
        }));

    const path = `/articles/${id}`;
    const words = (article.content || "").split(/\s+/).filter(Boolean).length;
    const jsonLd = pageGraph(
        {
            "@type": "BlogPosting",
            "@id": `${absoluteUrl(path)}#article`,
            headline: article.title,
            description: describe(article),
            image: [cover || absoluteUrl(SHARE_IMAGE.url)],
            datePublished: new Date(createdAtMs).toISOString(),
            dateModified: new Date(updatedAtMs || createdAtMs).toISOString(),
            inLanguage: articleLanguage(article),
            keywords: (article.tags ?? []).join(", "),
            wordCount: words || undefined,
            // Members' articles link to their profile; articles without an author are the owner's
            author: article.authorId
                ? { "@type": "Person", name: article.authorName || ownerName, url: absoluteUrl(`/users/${article.authorId}`) }
                : { "@id": PERSON_ID },
            publisher: { "@id": ORGANIZATION_ID },
            mainEntityOfPage: absoluteUrl(path),
            isPartOf: { "@type": "Blog", "@id": `${absoluteUrl("/articles")}#page` },
        },
        breadcrumbs([
            { name: t("nav.home"), path: "/" },
            { name: t("blog.title"), path: "/articles" },
            { name: article.title, path },
        ])
    );

    return (
        <>
            <JsonLd data={jsonLd} />
            <ArticleView article={serializedArticle} related={related} />
        </>
    );
}
