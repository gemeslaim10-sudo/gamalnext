"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, ArrowLeft, Share2 } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import LikeButton from "@/components/social/LikeButton";
import CommentSection from "@/components/social/CommentSection";

type Article = {
    id: string;
    title: string;
    summary: string;
    content: string;
    media: { url: string; type: 'image' | 'video' }[];
    createdAt: any;
}

export default function ArticleView({ article }: { article: Article }) {
    // Handle date formatting (supports Timestamp or serialized props)
    const formattedDate = (() => {
        if (!article.createdAt) return 'Recently';
        if (typeof article.createdAt?.toDate === 'function') {
            return article.createdAt.toDate().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
        }
        if (article.createdAt?.seconds) {
            return new Date(article.createdAt.seconds * 1000).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
        }
        return new Date(article.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    })();

    return (
        <main className="min-h-screen bg-slate-950">
            <Navbar />

            {/* Header / Hero */}
            <div className="pt-32 pb-10 px-4 max-w-4xl mx-auto text-center">
                <Link href="/articles" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> العودة للمقالات
                </Link>

                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    {article.title}
                </h1>

                <div className="flex justify-center items-center gap-6 text-slate-500 text-sm font-mono mt-4">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {formattedDate}</span>
                    <span className="flex items-center gap-2"><Share2 className="w-4 h-4" /> مشاركة</span>
                    <LikeButton articleId={article.id} />
                </div>
            </div>

            {/* Media Gallery */}
            {article.media && article.media.length > 0 && (
                <div className="max-w-5xl mx-auto px-4 mb-16">
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
                        {article.media.length === 1 ? (
                            article.media[0].type === 'video' ? (
                                <video src={article.media[0].url} controls className="w-full max-h-[600px] object-contain mx-auto" />
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={article.media[0].url} alt={article.title} className="w-full max-h-[600px] object-contain mx-auto" />
                            )
                        ) : (
                            <Swiper
                                modules={[Pagination, Navigation]}
                                pagination={{ clickable: true }}
                                navigation
                                className="w-full h-[400px] md:h-[600px]"
                            >
                                {article.media.map((item, idx) => (
                                    <SwiperSlide key={idx} className="bg-black flex items-center justify-center">
                                        {item.type === 'video' ? (
                                            <video src={item.url} controls className="w-full h-full object-contain" />
                                        ) : (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.url} alt={`Slide ${idx}`} className="w-full h-full object-contain" />
                                        )}
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                </div>
            )}

            {/* Content Body */}
            <article className="max-w-3xl mx-auto px-4 pb-20">
                <div className="prose prose-lg prose-invert mx-auto leading-loose text-slate-300">
                    {/* Rendering plain text with line breaks for now */}
                    {article.content.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                    ))}
                </div>

                <CommentSection articleId={article.id} />
            </article>

            <Footer />
        </main>
    );
}
