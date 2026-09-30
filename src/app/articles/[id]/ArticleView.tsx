"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { loadFirestore } from "@/lib/firebase-app";
import { toast } from "react-hot-toast";
import { refreshSite } from "@/lib/refreshSite";
import { useCopy } from "@/components/providers/CopyProvider";
import { Page } from "@/components/ui";
import { CommentSection } from "@/components/social/LazySocial";
import RelatedArticles from "./RelatedArticles";
import type { ArticleCard as ArticleCardData, FirebaseTimestamp } from "@/types";
import { formatTimestamp, getTimestampMs } from "@/types";

import { ArticleHeader } from "./components/ArticleHeader";
import { ArticleMedia } from "./components/ArticleMedia";
import { ArticleBody } from "./components/ArticleBody";
import { ArticleActions } from "./components/ArticleActions";

type Article = {
    id: string;
    title: string;
    summary?: string;
    content: string;
    media: { url: string; type: 'image' | 'video' }[];
    createdAt?: FirebaseTimestamp;
    authorId: string;
    authorName?: string;
}

export default function ArticleView({ article, related = [] }: { article: Article; related?: ArticleCardData[] }) {
    const t = useCopy();
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
        if (!confirm(t("blog.deleteConfirm"))) {
            return;
        }

        setDeleting(true);
        toast.loading(t("blog.deleting"), { id: "delete" });

        try {
            const { db, doc, deleteDoc } = await loadFirestore();
            await deleteDoc(doc(db, "articles", article.id));
            // Take it off the cached pages before leaving, so the blog no longer lists it
            await refreshSite({ articleId: article.id });
            toast.success(t("blog.deleted"), { id: "delete" });
            router.refresh();
            router.push("/articles");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(t("blog.deleteFailed"), { id: "delete" });
            setDeleting(false);
        }
    };

    // Handle date formatting
    const formattedDate = formatTimestamp(article.createdAt, 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || t("blog.dateUnknown");
    const createdAtMs = getTimestampMs(article.createdAt);

    return (
        <Page>
            <article className="mx-auto max-w-content">
                <ArticleHeader
                    title={article.title}
                    authorId={article.authorId}
                    authorName={article.authorName}
                    formattedDate={formattedDate}
                    isoDate={createdAtMs ? new Date(createdAtMs).toISOString() : undefined}
                    contentDir={contentDir}
                />

                {article.media?.length > 0 && (
                    <div className="mt-8">
                        <ArticleMedia media={article.media} title={article.title} />
                    </div>
                )}

                <div className="mt-8">
                    <ArticleBody content={article.content} contentDir={contentDir} />
                </div>

                <div className="mt-10">
                    <ArticleActions
                        articleId={article.id}
                        title={article.title}
                        summary={article.summary}
                        isAuthor={!!isAuthor}
                        deleting={deleting}
                        handleDelete={handleDelete}
                    />
                </div>

                <div className="mt-10">
                    <CommentSection articleId={article.id} />
                </div>
            </article>

            <RelatedArticles articles={related} />
        </Page>
    );
}
