'use client';

import Link from "next/link";
import Image from "next/image";
import { MoveRight, TrendingUp, Calendar } from "lucide-react";

type Article = {
    id: string;
    title: string;
    summary?: string;
    content?: string;
    media: { url: string; type: 'image' | 'video' }[];
    createdAt: any;
}

interface ArticleCardProps {
    article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
    const getSummary = (article: Article) => {
        if (article.summary) return article.summary;
        if (!article.content) return "";
        return article.content.substring(0, 120) + "...";
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
    };

    return (
        <Link href={`/articles/${article.id}`}>
            <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-700/50 hover:border-yellow-500/50 transition-all duration-500 h-full flex flex-col shadow-lg hover:shadow-[0_0_50px_rgba(234,179,8,0.3)] hover:-translate-y-2">
                {/* Image Container */}
                <div className="h-56 overflow-hidden relative shrink-0">
                    {article.media?.[0] ? (
                        article.media[0].type === 'video' ? (
                            <video src={article.media[0].url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" muted />
                        ) : (
                            <Image
                                src={article.media[0].url}
                                alt={article.title}
                                fill
                                className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                        )
                    ) : (
                        <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-yellow-600/80 via-orange-600/80 to-pink-600/80">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                            <div className="absolute inset-0 opacity-30">
                                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-yellow-300 rounded-full blur-3xl animate-pulse delay-700"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-white/50 group-hover:text-white/70 transition-colors">
                                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

                    {/* Trending Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        رائج
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 relative flex flex-col flex-grow text-right">
                    <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 group-hover:w-full transition-all duration-700"></div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-orange-400 transition-all line-clamp-2 leading-tight">
                        {article.title}
                    </h3>

                    <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed mb-4 flex-grow">
                        {getSummary(article)}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50">
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <Calendar className="w-3 h-3" />
                            {formatDate(article.createdAt)}
                        </div>
                        <div className="flex items-center text-yellow-400 text-sm font-medium group-hover:gap-3 transition-all">
                            اقرأ المزيد <MoveRight className="w-4 h-4 rotate-180" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
