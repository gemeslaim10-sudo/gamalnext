"use client";

import Link from "next/link";
import { MoveRight, TrendingUp, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import dynamic from 'next/dynamic';
import ArticleCard from "./articles/ArticleCard";

// Dynamic import for Swiper to reduce initial JS
const Swiper = dynamic(() => import('swiper/react').then(mod => mod.Swiper), { ssr: false });
const SwiperSlide = dynamic(() => import('swiper/react').then(mod => mod.SwiperSlide), { ssr: false });

import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

type Article = {
    id: string;
    title: string;
    summary?: string;
    content?: string;
    media: { url: string; type: 'image' | 'video' }[];
    createdAt: any;
}

export default function TrendingArticlesClient({ articles }: { articles: Article[] }) {

    if (articles.length === 0) return null;

    return (
        <section className="py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-t border-slate-800/50 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/10 via-transparent to-transparent"></div>
            <div className="absolute top-20 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <Reveal className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-6">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-semibold">الأكثر رواجاً</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center flex-wrap gap-3 justify-center leading-relaxed pb-2">
                        <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-yellow-500" />
                        أحدث <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 py-1">الرؤى والمقالات</span>
                    </h2>
                    <p className="text-slate-400 text-lg">نخبة المحتوى التقني والمتخصص</p>
                </Reveal>

                <div className="mb-16">
                    <Swiper
                        modules={[Pagination, Autoplay, Navigation]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true, dynamicBullets: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="!pb-16"
                    >
                        {articles.map((article) => (
                            <SwiperSlide key={article.id}>
                                <ArticleCard article={article} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="text-center">
                    <Link href="/articles" className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-yellow-500/20 transition-all hover:scale-105">
                        عرض جميع المقالات <MoveRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
