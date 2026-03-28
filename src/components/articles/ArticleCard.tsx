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
        <Link href={`/articles/${article.id}`} className="block h-full">
            <div className="group h-full flex flex-col bg-[#0f172a]/40 backdrop-blur-md rounded-[2rem] overflow-hidden border border-slate-800/50 hover:border-yellow-500/30 transition-all duration-500 shadow-2xl hover:shadow-yellow-500/10 hover:-translate-y-3 relative">
                {/* Image/Media Section */}
                <div className="h-64 overflow-hidden relative shrink-0">
                    <div className="absolute inset-0 bg-slate-900 group-hover:scale-105 transition-transform duration-700">
                        {article.media?.[0] ? (
                            article.media[0].type === 'video' ? (
                                <video src={article.media[0].url} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" muted />
                            ) : (
                                <Image
                                    src={article.media[0].url}
                                    alt={article.title}
                                    fill
                                    className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 grayscale-[20%] group-hover:grayscale-0"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                            )
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
                                <TrendingUp className="w-16 h-16 text-slate-700/50" />
                            </div>
                        )}
                    </div>
                    
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Meta Badges */}
                    <div className="absolute top-5 right-5 flex gap-2">
                        <div className="bg-yellow-500 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 uppercase tracking-wider">
                            <TrendingUp className="w-3 h-3" />
                            رائج
                        </div>
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-8 flex flex-col flex-grow text-right relative">
                    {/* Animated Accent Line */}
                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-l from-yellow-500/50 via-orange-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-right"></div>

                    <div className="flex items-center justify-end gap-3 mb-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">مقالات تقنية</span>
                        <div className="w-8 h-[1px] bg-slate-800"></div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4 leading-[1.3] group-hover:text-yellow-400 transition-colors duration-300 line-clamp-2">
                        {article.title}
                    </h3>

                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-8 flex-grow opacity-80 group-hover:opacity-100 transition-opacity">
                        {getSummary(article)}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Calendar className="w-4 h-4 text-slate-600" />
                            <span className="text-xs font-medium">{formatDate(article.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-yellow-500 font-bold text-sm tracking-tight group-hover:gap-4 transition-all duration-300">
                            <span>اقرأ المقال</span>
                            <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-slate-950 transition-all duration-300">
                                <MoveRight className="w-4 h-4 rotate-180" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
