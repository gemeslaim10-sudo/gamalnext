'use client';

import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Calendar, ArrowRight } from "lucide-react";

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
        return article.content.substring(0, 100) + "...";
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <Link href={`/articles/${article.id}`} className="block h-full group outline-none">
            <div className="h-full flex flex-col bg-slate-900/40 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] border border-slate-700/40 hover:border-yellow-500/50 hover:bg-slate-800/60 transition-all duration-500 shadow-xl hover:shadow-[0_0_40px_rgba(234,179,8,0.15)] md:hover:-translate-y-2 overflow-hidden relative">
                
                {/* Glow Effect behind the card on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* Media Wrapper: Responsive aspect ratio for perfect mobile scaling */}
                <div className="w-full aspect-[16/10] md:aspect-auto md:h-56 p-2 md:p-3 relative z-10 shrink-0">
                    <div className="w-full h-full rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden relative shadow-inner bg-slate-950/50">
                        {/* Image overlay gradient */}
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent opacity-80 mix-blend-multiply"></div>
                        
                        {/* Glassmorphism Badges */}
                        <div className="absolute top-2.5 left-2.5 md:top-3 md:left-3 z-20">
                            <span className="bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-[9px] md:text-[10px] font-bold px-2.5 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                Tech
                            </span>
                        </div>
                        <div className="absolute top-2.5 right-2.5 md:top-3 md:right-3 z-20">
                            <div className="bg-yellow-500/90 backdrop-blur-md text-slate-950 text-[9px] md:text-[10px] font-black px-2.5 py-1 md:px-3 md:py-1.5 rounded-full shadow-lg flex items-center gap-1 md:gap-1.5 uppercase tracking-widest">
                                <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                <span className="hidden sm:inline">Trending</span>
                                <span className="sm:hidden">Hot</span>
                            </div>
                        </div>

                        {/* Media Source */}
                        <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-700 ease-out">
                            {article.media?.[0] ? (
                                article.media[0].type === 'video' ? (
                                    <video src={article.media[0].url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" muted loop playsInline />
                                ) : (
                                    <Image
                                        src={article.media[0].url}
                                        alt={article.title}
                                        fill
                                        className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                )
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                    <TrendingUp className="w-10 h-10 md:w-12 md:h-12 text-slate-700/30" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2 md:pt-3 flex flex-col flex-grow relative z-10" dir="auto">
                    <h3 className="text-[1.1rem] md:text-2xl font-bold text-slate-100 mb-2 md:mb-3 leading-[1.4] md:leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-orange-400 transition-all duration-300 line-clamp-2">
                        {article.title}
                    </h3>

                    <p className="text-slate-400 text-[13px] md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3 mb-4 md:mb-6 flex-grow group-hover:text-slate-300 transition-colors">
                        {getSummary(article)}
                    </p>

                    <div className="flex items-center justify-between pt-3 md:pt-4 mt-auto border-t border-slate-800" dir="ltr">
                        <div className="flex items-center gap-1.5 md:gap-2 text-slate-500">
                            <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-600" />
                            <span className="text-[10px] md:text-xs font-semibold tracking-wide uppercase">{formatDate(article.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 md:gap-2 text-yellow-500 font-bold text-[11px] md:text-sm group-hover:text-yellow-400 transition-colors">
                            <span className="tracking-wide">Read</span>
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-slate-950 transition-all duration-300 transform group-hover:translate-x-1">
                                <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
