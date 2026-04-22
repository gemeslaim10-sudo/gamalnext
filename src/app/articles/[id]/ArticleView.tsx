"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Calendar, ArrowLeft, Share2, Edit, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import for Swiper to reduce initial JS
const Swiper = dynamic(() => import('swiper/react').then(mod => mod.Swiper), { ssr: false });
const SwiperSlide = dynamic(() => import('swiper/react').then(mod => mod.SwiperSlide), { ssr: false });

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
        if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
            return;
        }

        setDeleting(true);
        toast.loading("Deleting article...", { id: "delete" });

        try {
            await deleteDoc(doc(db, "articles", article.id));
            toast.success("Article deleted successfully!", { id: "delete" });
            router.push("/articles");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete article", { id: "delete" });
            setDeleting(false);
        }
    };

    // Handle date formatting (supports Timestamp or serialized props)
    const formattedDate = (() => {
        if (!article.createdAt) return 'Recently';
        if (typeof article.createdAt?.toDate === 'function') {
            return article.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }
        if (article.createdAt?.seconds) {
            return new Date(article.createdAt.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }
        return new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    })();

    return (
        <main className="min-h-screen bg-[#020617] relative selection:bg-blue-500/30 selection:text-blue-200">
            {/* Rich Background Effects */}
            <div className="absolute top-0 inset-x-0 h-[800px] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none"></div>

            <Navbar />

            {/* Header / Hero */}
            <div className="pt-36 pb-12 px-4 max-w-5xl mx-auto text-center relative z-10">
                <Link href="/articles" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition-colors bg-slate-900/50 border border-slate-800/50 px-4 py-2 rounded-full hover:bg-slate-800 backdrop-blur-md">
                    <ArrowLeft className="w-4 h-4" /> Back to Articles
                </Link>

                {/* Author Actions - Desktop (side) */}
                {isAuthor && (
                    <div className="hidden md:flex absolute top-32 left-4 gap-2">
                        <Link
                            href={`/articles/${article.id}/edit`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg text-sm"
                        >
                            <Edit className="w-4 h-4" /> Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg disabled:opacity-50 text-sm"
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    </div>
                )}

                <h1 dir="auto" className="text-3xl sm:text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 mb-8 leading-tight px-4 drop-shadow-sm">
                    {article.title}
                </h1>

                {/* Author Actions - Mobile (below title) */}
                {isAuthor && (
                    <div className="flex md:hidden justify-center gap-3 mb-6 px-4">
                        <Link
                            href={`/articles/${article.id}/edit`}
                            className="flex-1 max-w-[200px] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-sm"
                        >
                            <Edit className="w-4 h-4" /> Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex-1 max-w-[200px] bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 text-sm"
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    </div>
                )}

                <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mt-8 px-4">
                    <span className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-full text-slate-300 text-sm font-medium backdrop-blur-md">
                        <Calendar className="w-4 h-4 text-blue-400" /> {formattedDate}
                    </span>
                    <button className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-full text-slate-300 hover:text-white hover:border-slate-700 transition-all text-sm font-medium backdrop-blur-md">
                        <Share2 className="w-4 h-4 text-purple-400" /> Share
                    </button>
                    <div className="bg-slate-900/60 border border-slate-800 px-2 py-1 rounded-full backdrop-blur-md">
                        <LikeButton articleId={article.id} />
                    </div>
                </div>
            </div>

            {/* Media Gallery */}
            {article.media && article.media.length > 0 && (
                <div className="max-w-5xl mx-auto px-4 mb-20 relative z-10">
                    <div className="rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl ring-1 ring-white/10 p-2">
                        <div className="rounded-[2rem] overflow-hidden bg-black relative">
                        {article.media.length === 1 ? (
                            article.media[0].type === 'video' ? (
                                <video src={article.media[0].url} controls className="w-full max-h-[600px] object-contain mx-auto" />
                            ) : (
                                <div className="relative w-full h-[400px] md:h-[600px]">
                                    <Image
                                        src={article.media[0].url}
                                        alt={article.title}
                                        fill
                                        className="object-contain mx-auto"
                                        priority
                                    />
                                </div>
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
                                            <Image
                                                src={item.url}
                                                alt={`Slide ${idx}`}
                                                fill
                                                className="object-contain"
                                            />
                                        )}
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                        </div>
                    </div>
                </div>
            )}

            {/* Content Body */}
            <article className="max-w-4xl mx-auto px-4 pb-24 relative z-10">
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 rounded-[2.5rem] p-6 md:p-12 lg:p-16 shadow-2xl">
                    <div className="prose prose-lg md:prose-xl prose-invert mx-auto leading-loose text-slate-300 prose-p:text-slate-300 prose-headings:text-white prose-a:text-blue-400 prose-strong:text-white prose-strong:font-bold">
                        <ReactMarkdown
                            components={{
                                a: ({ node, ...props }) => (
                                    <a
                                        {...props}
                                        dir="auto"
                                        className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 hover:decoration-blue-300 transition-all font-semibold"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    />
                                ),
                                p: ({ children }) => <p dir="auto" className="mb-6 leading-relaxed md:leading-loose text-[1.1rem] md:text-[1.2rem]">{children}</p>,
                                h1: ({ children }) => <h1 dir="auto" className="text-3xl md:text-4xl font-black mb-6 mt-12 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{children}</h1>,
                                h2: ({ children }) => <h2 dir="auto" className="text-2xl md:text-3xl font-bold mb-6 mt-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 inline-block">{children}</h2>,
                                h3: ({ children }) => <h3 dir="auto" className="text-xl md:text-2xl font-bold mb-4 mt-8 text-slate-200">{children}</h3>,
                                ul: ({ children }) => <ul dir="auto" className="list-none space-y-3 mb-8">{children}</ul>,
                                ol: ({ children }) => <ol dir="auto" className="list-decimal list-outside ml-6 space-y-3 mb-8">{children}</ol>,
                                li: ({ children }) => (
                                    <li dir="auto" className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full before:shadow-[0_0_10px_rgba(59,130,246,0.8)]">
                                        <span className="text-slate-300">{children}</span>
                                    </li>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote dir="auto" className="border-l-4 border-blue-500 bg-blue-500/10 text-blue-100 italic px-6 py-5 my-8 rounded-r-2xl shadow-inner text-lg">
                                        {children}
                                    </blockquote>
                                ),
                                strong: ({ children }) => <strong dir="auto" className="text-white font-extrabold bg-white/5 px-1 rounded">{children}</strong>
                            }}
                        >
                            {article.content}
                        </ReactMarkdown>
                    </div>

                    <div className="mt-16 pt-8 border-t border-slate-800/50">
                        <CommentSection articleId={article.id} />
                    </div>
                </div>
            </article>

            {/* Related Articles */}
            <RelatedArticles currentArticleId={article.id} />

            <Footer />
            <Toaster />
        </main>
    );
}
