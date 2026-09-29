import { Section } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";
import { ArticleCard, hasAnyCover } from "@/components/articles/ArticleCard";
import type { UserArticle } from "../types";

interface UserArticlesListProps {
    articles: UserArticle[];
}

export function UserArticlesList({ articles }: UserArticlesListProps) {
    const t = useCopy();

    if (articles.length === 0) return null;

    const showCovers = hasAnyCover(articles);

    return (
        <Section
            title={
                <>
                    {t("blog.userArticles")} <span className="ml-1 font-normal text-subtle">{articles.length}</span>
                </>
            }
            className="pb-0 sm:pb-0"
        >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} showCover={showCovers} />
                ))}
            </div>
        </Section>
    );
}
