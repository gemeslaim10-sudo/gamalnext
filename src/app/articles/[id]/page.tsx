import { getDocument, getCollection } from "@/lib/server-utils";
import ArticleView from "./ArticleView";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ArticleRaw } from "@/types";
import { getTimestampMs } from "@/types";

type Props = {
    params: Promise<{ id: string }>;
};

// Generate SEO Metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const article = await getDocument<ArticleRaw>("articles", id);

    if (!article) {
        return {
            title: "المقال غير موجود",
        };
    }

    return {
        title: article.title,
        description: article.summary || article.content.substring(0, 150),
        keywords: article.tags || [],
        alternates: {
            canonical: `/articles/${id}`,
        },
        openGraph: {
            title: article.title,
            description: article.summary || article.content.substring(0, 150),
            images: article.media?.[0]?.url ? [article.media[0].url] : ["/og-image.png"],
            type: 'article',
            publishedTime: new Date(getTimestampMs(article.createdAt) || Date.now()).toISOString(),
            authors: ['جمال عبد العاطي'],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.summary || article.content.substring(0, 150),
            images: article.media?.[0]?.url ? [article.media[0].url] : ["/og-image.png"],
        }
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
    const article = await getDocument<ArticleRaw>("articles", id);

    if (!article) {
        notFound();
    }

    const createdAtMs = getTimestampMs(article.createdAt) || Date.now();

    // Serialize ID and date
    const serializedArticle = {
        ...article,
        id: id,
        createdAt: createdAtMs
    };

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        image: article.media?.[0]?.url ? [article.media[0].url] : ["https://gamaltech.info/og-image.png"],
        datePublished: new Date(createdAtMs).toISOString(),
        dateModified: getTimestampMs(article.updatedAt) ? new Date(getTimestampMs(article.updatedAt)).toISOString() : new Date(createdAtMs).toISOString(),
        author: {
            '@type': 'Person',
            name: article.authorName || 'جمال عبد العاطي',
            url: 'https://gamaltech.info'
        },
        publisher: {
            '@type': 'Organization',
            name: 'جمال عبد العاطي',
            logo: {
                '@type': 'ImageObject',
                url: 'https://gamaltech.info/icon.png'
            }
        },
        description: article.summary || article.content.substring(0, 150),
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://gamaltech.info/articles/${id}`
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
