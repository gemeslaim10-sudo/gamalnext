"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MoveRight, Sparkles } from "lucide-react";
import Reveal from "../sections/Reveal";
import { TrendingSwiper } from "./TrendingSwiper";
import type { ArticleSerialized } from "@/types";

export default function TrendingArticlesClient({ articles }: { articles: ArticleSerialized[] }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (articles.length === 0) return null;
    if (!mounted) return <div className="py-24 bg-[#020617] min-h-[500px]" />;

    return (
        <section className="py-24 bg-[#020617] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(234,179,8,0.05)_0%,_transparent_70%)]"></div>
            <div className="absolute -top-24 -left-20 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-20 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <Reveal className="text-center mb-16 px-4">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-full px-5 py-2.5 mb-8 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                        <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                        <span className="text-yellow-400 text-xs md:text-sm font-bold tracking-wider uppercase">Currently Trending</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                        <span className="block text-slate-400 text-lg md:text-xl font-medium mb-2 tracking-widest uppercase">Stay Updated</span>
                        Latest <span className="relative inline-block px-1">
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500">Insights & Articles</span>
                            <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-500/10 -rotate-1 rounded-sm"></span>
                        </span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Premium technical content specialized in web development and store creation, curated to enrich your knowledge.
                    </p>
                </Reveal>

                <TrendingSwiper articles={articles} />

                <div className="text-center">
                    <Link 
                        href="/articles" 
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-600 via-orange-600 to-yellow-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-black px-10 py-5 rounded-2xl shadow-xl shadow-yellow-900/20 transition-all hover:scale-[1.03] hover:shadow-orange-950/40 uppercase tracking-tighter"
                        style={{ transition: 'all 0.5s ease' }}
                    >
                        Explore All Articles 
                        <span className="p-1 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                            <MoveRight className="w-5 h-5" />
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
