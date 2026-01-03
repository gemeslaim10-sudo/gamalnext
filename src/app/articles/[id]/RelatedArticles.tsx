"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';

type Article = {
    id: string;
    title: string;
    summary?: string;
    content?: string;
    media?: { url: string; type: 'image' | 'video' }[];
    createdAt: any;
};

export default function RelatedArticles({ currentArticleId }: { currentArticleId: string }) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedArticles = async () => {
            try {
                const q = query(
                    collection(db, 'articles'),
                    orderBy('createdAt', 'desc'),
                    limit(4)
                );

                const snapshot = await getDocs(q);
                const allArticles = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as Article))
                    .filter(article => article.id !== currentArticleId); // Exclude current article

                setArticles(allArticles.slice(0, 3)); // Take only 3
            } catch (error) {
                console.error('Error fetching related articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedArticles();
    }, [currentArticleId]);

    const getSummary = (article: Article) => {
        if (article.summary) return article.summary;
        if (!article.content) return '';
        return article.content.substring(0, 120) + '...';
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        if (typeof timestamp?.toDate === 'function') {
            return timestamp.toDate().toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
        }
        if (timestamp?.seconds) {
            return new Date(timestamp.seconds * 1000).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
        }
        return new Date(timestamp).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <section className="py-16 bg-slate-950 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center text-slate-500">جاري التحميل...</div>
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
                        <span className="text-blue-400 text-sm font-semibold">مقالات مقترحة</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        استمر في <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">القراءة</span>
                    </h2>
                    <p className="text-slate-400 text-lg">اكتشف المزيد من المحتوى المميز</p>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {articles.map((article) => {
                        const coverMedia = article.media?.[0]?.url;
                        const isVideo = article.media?.[0]?.type === 'video';

                        return (
                            <Link
                                key={article.id}
                                href={`/articles/${article.id}`}
                                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-lg hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:-translate-y-2"
                            >
                                {/* Image */}
                                <div className="h-48 overflow-hidden relative">
                                    {coverMedia ? (
                                        isVideo ? (
                                            <video src={coverMedia} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" muted />
                                        ) : (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={coverMedia} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        )
                                    ) : (
                                        // Beautiful gradient for articles without images
                                        <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-blue-600/70 via-purple-600/70 to-pink-600/70">
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                                            <div className="absolute inset-0 opacity-30">
                                                <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-white rounded-full blur-3xl animate-pulse"></div>
                                                <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-300 rounded-full blur-3xl animate-pulse delay-700"></div>
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <svg className="w-16 h-16 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-3">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(article.createdAt)}
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                                        {article.title}
                                    </h3>

                                    <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-4">
                                        {getSummary(article)}
                                    </p>

                                    <div className="flex items-center text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
                                        اقرأ المزيد <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/articles"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
                    >
                        عرض جميع المقالات <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
