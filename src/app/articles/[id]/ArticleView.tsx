"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast, Toaster } from "react-hot-toast";
import RelatedArticles from "./RelatedArticles";
import type { FirebaseTimestamp } from "@/types";
import { getTimestampMs, formatTimestamp } from "@/types";

import { ArticleHeader } from "./components/ArticleHeader";
import { ArticleMedia } from "./components/ArticleMedia";
import { ArticleBody } from "./components/ArticleBody";

type Article = {
    id: string;
    title: string;
    summary?: string;
    content: string;
    media: { url: string; type: 'image' | 'video' }[];
    createdAt?: FirebaseTimestamp;
    authorId: string;
}

export default function ArticleView({ article }: { article: Article }) {
    const { user } = useAuth();
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);

    const isAuthor = user && article.authorId === user.uid;

    // Detect content direction: if >30% of alpha chars are Arabic/Hebrew → RTL
    const contentDir = useMemo(() => {
        const text = (article.title + ' ' + article.content).replace(/[^\p{L}]/gu, '');
        if (!text) return 'ltr';
        const rtlChars = text.match(/[\p{Script=Arabic}\p{Script=Hebrew}]/gu);
        const ratio = (rtlChars?.length || 0) / text.length;
        return ratio > 0.3 ? 'rtl' : 'ltr';
    }, [article.title, article.content]);

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

    // Handle date formatting
    const formattedDate = formatTimestamp(article.createdAt, 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || 'Recently';

    return (
        <div className="min-h-screen bg-[#020617] relative selection:bg-blue-500/30 selection:text-blue-200">
            {/* Rich Background Effects */}
            <div className="absolute top-0 inset-x-0 h-[800px] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none"></div>

            <Navbar />

            <ArticleHeader
                articleId={article.id}
                title={article.title}
                summary={article.summary}
                isAuthor={isAuthor || false}
                deleting={deleting}
                formattedDate={formattedDate}
                handleDelete={handleDelete}
            />

            <ArticleMedia media={article.media} title={article.title} />

            <ArticleBody
                articleId={article.id}
                content={article.content}
                contentDir={contentDir}
            />

            <RelatedArticles currentArticleId={article.id} />

            <Footer />
            <Toaster />
        </div>
    );
}
