"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { MoveRight, TrendingUp } from "lucide-react";
import Reveal from "./Reveal";

type Article = {
    id: string;
    title: string;
    summary?: string;
    content?: string;
    media: { url: string; type: 'image' | 'video' }[];
    createdAt: any;
    likesCount?: number;
}

export default function TrendingArticles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTrending() {
            try {
                // Ideally this should be orderBy "likesCount" but we might not have it on all docs yet.
                // Fallback to recent articles if likesCount doesn't exist or index missing.
                // Using createdAt for now as "Recent Trending" effectively.
                const q = query(
                    collection(db, "articles"),
                    orderBy("createdAt", "desc"),
                    limit(3)
                );
                const snap = await getDocs(q);
                setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() } as Article)));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchTrending();
    }, []);

    const getSummary = (article: Article) => {
        if (article.summary) return article.summary;
        if (!article.content) return "";
        return article.content.substring(0, 100) + "...";
    };

    if (loading || articles.length === 0) return null;

    return (
        <section className="py-20 bg-slate-900 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4">
                <Reveal className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
                            <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-yellow-500" />
                            مقالات <span className="text-blue-500">رائجة</span>
                        </h2>
                        <p className="text-slate-400">الأكثر قراءة وتفاعلاً هذا الأسبوع</p>
                    </div>
                    <Link href="/articles" className="hidden md:flex items-center gap-2 text-blue-400 hover:text-white transition-colors">
                        عرض الكل <MoveRight className="w-5 h-5" />
                    </Link>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {articles.map((article, idx) => (
                        <Reveal key={article.id} className={`stagger-${idx + 1} group glass-card rounded-3xl overflow-hidden hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] transition-all duration-300`}>
                            <Link href={`/articles/${article.id}`}>
                                <div className="h-52 overflow-hidden relative">
                                    {article.media?.[0] ? (
                                        article.media[0].type === 'video' ? (
                                            <video src={article.media[0].url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" muted />
                                        ) : (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={article.media[0].url} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        )
                                    ) : (
                                        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700">No Image</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                                    <div className="absolute top-4 right-4 bg-yellow-500/90 text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm">
                                        TRENDING
                                    </div>
                                </div>
                                <div className="p-6 relative">
                                    <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-50"></div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors line-clamp-2 leading-tight">
                                        {article.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-4">
                                        {getSummary(article)}
                                    </p>
                                    <div className="flex items-center text-blue-400 text-sm font-medium group-hover:translate-x-[-5px] transition-transform">
                                        اقرأ المزيد <MoveRight className="w-4 h-4 mr-2" />
                                    </div>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/articles" className="inline-flex items-center gap-2 text-blue-400 font-bold">
                        عرض جميع المقالات <MoveRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
