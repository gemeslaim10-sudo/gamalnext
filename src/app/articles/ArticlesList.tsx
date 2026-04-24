"use client";

import { useAuth } from "@/context/AuthContext";
import { useArticlesList, type Article } from "./useArticlesList";
import { ArticleCard } from "./components/ArticleCard";

export default function ArticlesList({ initialArticles }: { initialArticles?: Article[] }) {
    const { articles, loading, deleting, handleDelete } = useArticlesList(initialArticles);
    const { user } = useAuth();

    const isAuthor = (article: Article) => {
        return user && article.authorId === user.uid;
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-slate-900 rounded-2xl h-96 animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (articles.length === 0) {
        return <div className="text-center text-slate-500 py-20">لا توجد مقالات مضافة بعد.</div>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {articles.map((article) => (
                <ArticleCard 
                    key={article.id} 
                    article={article} 
                    canEdit={!!isAuthor(article)} 
                    isDeleting={deleting === article.id}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    );
}
