import { getDocument } from "@/lib/server-utils";
import ArticleView from "./ArticleView";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>;
};

// Generate SEO Metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const article: any = await getDocument("articles", id);

    if (!article) {
        return {
            title: "المقال غير موجود",
        };
    }

    return {
        title: `${article.title} | Gamal Selim`,
        description: article.summary || article.content.substring(0, 150),
        openGraph: {
            images: article.media?.[0]?.url ? [article.media[0].url] : [],
        },
    };
}

export const revalidate = 60;

export default async function ArticlePage({ params }: Props) {
    const { id } = await params;
    const article: any = await getDocument("articles", id);

    if (!article) {
        notFound();
    }

    // Serialize ID and date
    const serializedArticle = {
        ...article,
        id: id,
        createdAt: article.createdAt?.seconds ? article.createdAt.seconds * 1000 : Date.now()
    };

    return <ArticleView article={serializedArticle} />;
}
