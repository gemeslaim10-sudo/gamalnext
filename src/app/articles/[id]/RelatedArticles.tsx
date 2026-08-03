"use client";

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRelatedArticles } from './useRelatedArticles';
import { RelatedArticleCard } from './components/RelatedArticleCard';

export default function RelatedArticles({ currentArticleId }: { currentArticleId: string }) {
    const { articles, loading } = useRelatedArticles(currentArticleId);

    if (loading) {
        return (
            <section className="py-16 bg-slate-950 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center text-slate-500">Loading...</div>
                </div>
            </section>
        );
    }

    if (articles.length === 0) return null;

    return (
        <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800/50 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
            <div className="absolute top-10 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm font-semibold">Suggested Articles</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Keep <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Reading</span>
                    </h2>
                    <p className="text-slate-400 text-lg">Discover more featured content</p>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                    {articles.map((article) => (
                        <RelatedArticleCard key={article.id} article={article} />
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/articles"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
                    >
                        View All Articles <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
