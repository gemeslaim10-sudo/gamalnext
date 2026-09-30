import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { refreshSite } from "@/lib/refreshSite";
import { useRouter } from "next/navigation";
import { useCopy } from "@/components/providers/CopyProvider";

export function useEditArticle(id: string) {
    const t = useCopy();
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        summary: "",
        tags: "",
        media: [] as { url: string; type: 'image' | 'video' }[]
    });

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const docRef = doc(db, "articles", id);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    toast.error(t("blog.editNotFound"));
                    router.push("/articles");
                    return;
                }

                const article = docSnap.data();

                if (article.authorId !== user?.uid) {
                    toast.error(t("blog.editNotAllowed"));
                    router.push("/articles");
                    return;
                }

                setFormData({
                    title: article.title || "",
                    content: article.content || "",
                    summary: article.summary || "",
                    tags: Array.isArray(article.tags) ? article.tags.join(", ") : "",
                    media: article.media || []
                });
            } catch (error) {
                console.error("Error fetching article:", error);
                toast.error(t("blog.editLoadFailed"));
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchArticle();
        }
    }, [id, user, router, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);

        try {
            const docRef = doc(db, "articles", id);
            await updateDoc(docRef, {
                title: formData.title,
                content: formData.content,
                summary: formData.summary,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                media: formData.media,
                slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
                updatedAt: serverTimestamp()
            });

            // The article page is cached: refresh it before showing it
            await refreshSite({ articleId: id });
            toast.success(t("blog.saved"));
            router.refresh();
            router.push(`/articles/${id}`);
        } catch (error) {
            console.error(error);
            toast.error(t("blog.saveFailed"));
        } finally {
            setSaving(false);
        }
    };

    return {
        user,
        loading,
        saving,
        formData,
        setFormData,
        handleSubmit
    };
}
