import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";

// Ensure this matches the existing Article type where imported
export type Article = {
    id: string;
    title: string;
    slug: string;
    content: string;
    summary?: string;
    media: { url: string; type: 'image' | 'video' }[];
    createdAt: { seconds: number; nanoseconds?: number; toDate?: () => Date } | string | Date;
    updatedAt?: { seconds: number; nanoseconds?: number; toDate?: () => Date } | string | Date;
    authorId: string;
}

export function useArticlesList(initialArticles?: Article[]) {
    const [articles, setArticles] = useState<Article[]>(initialArticles || []);
    const [loading, setLoading] = useState(!initialArticles);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Article));
            setArticles(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching articles:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [initialArticles]);

    const handleDelete = async (articleId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm("هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذه العملية.")) {
            return;
        }

        setDeleting(articleId);
        toast.loading("جاري حذف المقال...", { id: "delete-article" });

        try {
            await deleteDoc(doc(db, "articles", articleId));
            toast.success("تم حذف المقال بنجاح!", { id: "delete-article" });
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("فشل حذف المقال", { id: "delete-article" });
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
