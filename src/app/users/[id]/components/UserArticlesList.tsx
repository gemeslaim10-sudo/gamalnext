import Link from "next/link";
import { User } from "lucide-react";
import type { UserArticle } from "../types";

interface UserArticlesListProps {
    articles: UserArticle[];
}

export function UserArticlesList({ articles }: UserArticlesListProps) {
    if (articles.length === 0) return null;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-white">المقالات المنشورة</h2>
                <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full text-xs font-mono">{articles.length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map(article => (
                    <Link href={`/articles/${article.id}`} key={article.id} className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all flex h-32">
                        <div className="w-32 bg-slate-800 flex-shrink-0">
                            {article.media?.[0] ? (
                                article.media[0].type === 'video' ? (
                                    <video src={article.media[0].url} className="w-full h-full object-cover opacity-50" />
                                ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={article.media[0].url} alt={article.title} className="w-full h-full object-cover" />
                                )
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600"><User className="w-6 h-6" /></div>
                            )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-center">
                            <h3 className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">{article.title}</h3>
                            <p className="text-slate-500 text-sm line-clamp-2">{article.summary}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
