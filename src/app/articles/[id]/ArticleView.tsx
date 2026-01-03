"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, ArrowLeft, Share2, Edit, Trash2 } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import LikeButton from "@/components/social/LikeButton";
import CommentSection from "@/components/social/CommentSection";
import ReactMarkdown from 'react-markdown';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast, Toaster } from "react-hot-toast";
import RelatedArticles from "./RelatedArticles";
import { useState } from "react";

type Article = {
    id: string;
    title: string;
    summary: string;
    content: string;
    media: { url: string; type: 'image' | 'video' }[];
    createdAt: any;
    authorId: string;
}

export default function ArticleView({ article }: { article: Article }) {
    const { user } = useAuth();
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);

    const isAuthor = user && article.authorId === user.uid;

    const handleDelete = async () => {
        if (!confirm("هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذه العملية.")) {
            return;
        }

        setDeleting(true);
        toast.loading("جاري حذف المقال...", { id: "delete" });

        try {
            await deleteDoc(doc(db, "articles", article.id));
            toast.success("تم حذف المقال بنجاح!", { id: "delete" });
            router.push("/articles");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("فشل حذف المقال", { id: "delete" });
            setDeleting(false);
        }
    };

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
            <div className="pt-32 pb-10 px-4 max-w-4xl mx-auto text-center relative">
                <Link href="/articles" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> العودة للمقالات
                </Link>

                {/* Author Actions - Desktop (side) */}
                {isAuthor && (
                    <div className="hidden md:flex absolute top-32 left-4 gap-2">
                        <Link
                            href={`/articles/${article.id}/edit`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg text-sm"
                        >
                            <Edit className="w-4 h-4" /> تعديل
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg disabled:opacity-50 text-sm"
                        >
                            <Trash2 className="w-4 h-4" /> حذف
                        </button>
                    </div>
                )}

                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-6 leading-tight px-4">
                    {article.title}
                </h1>

                {/* Author Actions - Mobile (below title) */}
                {isAuthor && (
                    <div className="flex md:hidden justify-center gap-3 mb-6 px-4">
                        <Link
                            href={`/articles/${article.id}/edit`}
                            className="flex-1 max-w-[200px] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-sm"
                        >
                            <Edit className="w-4 h-4" /> تعديل
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex-1 max-w-[200px] bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 text-sm"
                        >
                            <Trash2 className="w-4 h-4" /> حذف
                        </button>
                    </div>
                )}

                <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-slate-500 text-xs md:text-sm font-mono mt-4 px-4">
                    <span className="flex items-center gap-2"><Calendar className="w-3 h-3 md:w-4 md:h-4" /> {formattedDate}</span>
                    <span className="flex items-center gap-2"><Share2 className="w-3 h-3 md:w-4 md:h-4" /> مشاركة</span>
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
                    <ReactMarkdown
                        components={{
                            a: ({ node, ...props }) => (
                                <a
                                    {...props}
                                    className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 hover:decoration-blue-300 transition-all font-semibold"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                            p: ({ children }) => <p className="mb-6 leading-relaxed">{children}</p>
                        }}
                    >
                        {article.content}
                    </ReactMarkdown>
                </div>

                <CommentSection articleId={article.id} />
            </article>

            {/* Related Articles */}
            <RelatedArticles currentArticleId={article.id} />

            <Footer />
            <Toaster />
        </main>
    );
}
