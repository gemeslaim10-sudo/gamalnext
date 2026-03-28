"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MoveRight, TrendingUp, Sparkles } from "lucide-react";
import Reveal from "../sections/Reveal";
import { Swiper, SwiperSlide } from 'swiper/react';
import ArticleCard from "./ArticleCard";
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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (articles.length === 0) return null;
    if (!mounted) return <div className="py-24 bg-[#020617] min-h-[500px]" />;

    return (
        <section className="py-24 bg-[#020617] relative overflow-hidden">
            {/* Rich Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(234,179,8,0.05)_0%,_transparent_70%)]"></div>
            <div className="absolute -top-24 -left-20 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-20 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>
            
            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <Reveal className="text-center mb-16 px-4">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-full px-5 py-2.5 mb-8 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                        <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                        <span className="text-yellow-400 text-xs md:text-sm font-bold tracking-wider uppercase">الأكثر رواجاً حالياً</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                        <span className="block text-slate-400 text-lg md:text-xl font-medium mb-2 tracking-widest uppercase">ابق على اطلاع</span>
                        أحدث <span className="relative inline-block px-1">
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500">الرؤى والمقالات</span>
                            <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-500/10 -rotate-1 rounded-sm"></span>
                        </span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        نخبة المحتوى التقني المتخصص في الذكاء الاصطناعي والتطوير الرقمي، ننتقي لك الأفضل لنثري معرفتك.
                    </p>
                </Reveal>

                <div className="mb-20 px-2 lg:px-0 relative group/swiper">
                    <Swiper
                        modules={[Pagination, Autoplay, Navigation]}
                        dir="rtl"
                        observer={true}
                        observeParents={true}
                        spaceBetween={16}
                        slidesPerView={2}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        pagination={{ 
                            clickable: true, 
                            dynamicBullets: true,
                            bulletActiveClass: 'bg-yellow-500 !scale-125 transition-all duration-300',
                        }}
                        autoplay={{ delay: 6000, disableOnInteraction: false }}
                        breakpoints={{
                            480: { slidesPerView: 2, spaceBetween: 16 },
                            768: { slidesPerView: 3, spaceBetween: 24 },
                            1024: { slidesPerView: 4, spaceBetween: 30 },
                        }}
                        className="trending-swiper w-full overflow-hidden !pb-20 !pt-4"
                    >
                        {articles.map((article) => (
                            <SwiperSlide key={article.id} className="!h-auto">
                                <ArticleCard article={article} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    
                    {/* Custom Navigation Buttons */}
                    <div className="hidden lg:block">
                        <button className="swiper-button-prev-custom absolute top-1/2 -left-4 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-white hover:border-yellow-500 hover:text-yellow-500 transition-all shadow-xl backdrop-blur-md opacity-0 group-hover/swiper:opacity-100 group-hover/swiper:translate-x-0 -translate-x-4">
                            <MoveRight className="w-6 h-6 rotate-180" />
                        </button>
                        <button className="swiper-button-next-custom absolute top-1/2 -right-4 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-white hover:border-yellow-500 hover:text-yellow-500 transition-all shadow-xl backdrop-blur-md opacity-0 group-hover/swiper:opacity-100 group-hover/swiper:translate-x-0 translate-x-4">
                            <MoveRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="text-center">
                    <Link 
                        href="/articles" 
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-600 via-orange-600 to-yellow-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-black px-10 py-5 rounded-2xl shadow-xl shadow-yellow-900/20 transition-all hover:scale-[1.03] hover:shadow-orange-950/40 uppercase tracking-tighter"
                        style={{ transition: 'all 0.5s ease' }}
                    >
                        استكشف جميع المقالات 
                        <span className="p-1 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                            <MoveRight className="w-5 h-5" />
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
