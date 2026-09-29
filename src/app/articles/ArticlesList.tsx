"use client";

import { FileText, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCopy } from "@/components/providers/CopyProvider";
import { Button, ButtonLink, EmptyState } from "@/components/ui";
import { useArticlesList, type Article } from "./useArticlesList";
import { ArticleCard, ArticleCardSkeleton, hasAnyCover } from "@/components/articles/ArticleCard";

const GRID = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

export default function ArticlesList({ initialArticles }: { initialArticles?: Article[] }) {
    const t = useCopy();
    const { articles, loading, deleting, handleDelete } = useArticlesList(initialArticles);
    const { user } = useAuth();

    const isAuthor = (article: Article) => {
        return user && article.authorId === user.uid;
    };

    if (loading) {
        return (
            <div className={GRID}>
                {[1, 2, 3].map((i) => (
                    <ArticleCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (articles.length === 0) {
        return <EmptyState icon={<FileText />} title={t("blog.empty")} />;
    }

    const showCovers = hasAnyCover(articles);

    return (
        <div className={GRID}>
            {articles.map((article) => (
                <ArticleCard
                    key={article.id}
                    article={article}
                    showCover={showCovers}
                    actions={
                        isAuthor(article) ? (
                            <>
                                <ButtonLink
                                    href={`/articles/${article.id}/edit`}
                                    variant="ghost"
                                    size="icon-sm"
                                    aria-label={t("blog.editTooltip")}
                                    title={t("blog.editTooltip")}
                                >
                                    <Pencil />
                                </ButtonLink>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={(e) => handleDelete(article.id, e)}
                                    disabled={deleting === article.id}
                                    aria-label={t("blog.deleteTooltip")}
                                    title={t("blog.deleteTooltip")}
                                    className="hover:bg-danger/10 hover:text-danger"
                                >
                                    <Trash2 />
                                </Button>
                            </>
                        ) : undefined
                    }
                />
            ))}
        </div>
    );
}
