import { useEffect, useState } from "react";
import { loadFirestore } from "@/lib/firebase-app";
import { toast } from "react-hot-toast";
import { isPublicArticle } from "@/lib/content/shared";
import { refreshSite } from "@/lib/refreshSite";
import { useCopy } from "@/components/providers/CopyProvider";
import type { FirebaseTimestamp, MediaItem } from "@/types";

// Article type for the articles list (includes slug for URL generation)
export type Article = {
    id: string;
    title: string;
    slug?: string;
    content: string;
    summary?: string;
    media: MediaItem[];
    createdAt: FirebaseTimestamp;
    updatedAt?: FirebaseTimestamp;
    authorId: string;
}

export function useArticlesList(initialArticles?: Article[]) {
    const t = useCopy();
    const [articles, setArticles] = useState<Article[]>(initialArticles || []);
    const [loading, setLoading] = useState(!initialArticles);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        // The server sends the published articles (cached, refreshed on every change), so the browser
        // only reads them itself when the server couldn't
        if (initialArticles) return undefined;
        let unsubscribe: (() => void) | undefined;
        let cancelled = false;
        loadFirestore()
            .then(({ db, collection, query, orderBy, onSnapshot }) => {
                if (cancelled) return;
                const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
                unsubscribe = onSnapshot(
                    q,
                    (snapshot) => {
                        const data = snapshot.docs
                            .map((doc) => ({ id: doc.id, ...doc.data() }) as Article & { status?: string })
                            // Articles waiting for review aren't public
                            .filter(isPublicArticle);
                        setArticles(data);
                        setLoading(false);
                    },
                    (error) => {
                        console.error("Error fetching articles:", error);
                        setLoading(false);
                    }
                );
            })
            .catch((error: unknown) => {
                console.error("Error loading articles:", error);
                setLoading(false);
            });
        return () => {
            cancelled = true;
            unsubscribe?.();
        };
    }, [initialArticles]);

    const handleDelete = async (articleId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm(t("blog.deleteConfirm"))) {
            return;
        }

        setDeleting(articleId);
        toast.loading(t("blog.deleting"), { id: "delete-article" });

        try {
            const { db, doc, deleteDoc } = await loadFirestore();
            await deleteDoc(doc(db, "articles", articleId));
            setArticles((current) => current.filter((article) => article.id !== articleId));
            // Take it off the cached pages too (blog, home feed, the article itself)
            void refreshSite({ articleId });
            toast.success(t("blog.deleted"), { id: "delete-article" });
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(t("blog.deleteFailed"), { id: "delete-article" });
        } finally {
            setDeleting(null);
        }
    };

    return {
        articles,
        loading,
        deleting,
        handleDelete
    };
}
