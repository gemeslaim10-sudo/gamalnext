"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

type Article = {
    id: string;
    title: string;
    slug: string;
    content: string; // Changed from summary to content for auto-generation
    summary?: string; // Optional: Keep for old articles
    media: { url: string; type: 'image' | 'video' }[];
    createdAt: any;
}

export default function ArticlesList({ initialArticles }: { initialArticles?: any[] }) {
    const [articles, setArticles] = useState<Article[]>(initialArticles || []);
    const [loading, setLoading] = useState(!initialArticles);

    useEffect(() => {
        if (initialArticles) return; // Don't subscribe if we have static data (simple SSR strategy)

        const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Article));
            setArticles(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [initialArticles]);

    const getSummary = (article: Article) => {
        // Use manual summary if exists (legacy), otherwise slice content
        if (article.summary) return article.summary;
        if (!article.content) return "";
        return article.content.substring(0, 150) + "...";
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => {
                const coverMedia = article.media?.[0]?.url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800";
                const isVideo = article.media?.[0]?.type === 'video';

                return (
                    <Link href={`/articles/${article.id}`} key={article.id} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:transform hover:-translate-y-2">
                        <div className="h-48 overflow-hidden relative">
                            {isVideo ? (
                                <video src={coverMedia} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" muted />
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={coverMedia} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                        </div>

                        <div className="p-6 flex flex-col h-full">
                            <div className="flex items-center gap-2 text-slate-400 text-xs mb-3 font-mono">
                                <Calendar className="w-3 h-3" />
                                {(() => {
                                    if (!article.createdAt) return 'الان';
                                    if (typeof article.createdAt?.toDate === 'function') {
                                        return article.createdAt.toDate().toLocaleDateString('ar-EG');
                                    }
                                    if (article.createdAt?.seconds) {
                                        return new Date(article.createdAt.seconds * 1000).toLocaleDateString('ar-EG');
                                    }
                                    return new Date(article.createdAt).toLocaleDateString('ar-EG');
                                })()}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                                {article.title}
                            </h3>

                            <p className="text-slate-400 text-sm line-clamp-3 mb-4 leading-relaxed flex-grow">
                                {getSummary(article)}
                            </p>

                            <span className="text-blue-500 text-sm font-bold flex items-center gap-2 mt-auto pt-4 border-t border-slate-800/50 w-full group-hover:text-blue-400">
                                عرض المزيد <ArrowRight className="w-4 h-4 group-hover:gap-2 transition-all mr-auto" />
                            </span>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
