import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export function useEditArticle(id: string) {
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
                    toast.error("المقال غير موجود");
                    router.push("/articles");
                    return;
                }

                const article = docSnap.data();

                if (article.authorId !== user?.uid) {
                    toast.error("ليس لديك صلاحية لتعديل هذا المقال");
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
                toast.error("حدث خطأ أثناء تحميل المقال");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchArticle();
        }
    }, [id, user, router]);

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
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                media: formData.media,
                slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
                updatedAt: serverTimestamp()
            });

            toast.success("تم تحديث المقال بنجاح!");
            router.push(`/articles/${id}`);
        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ أثناء حفظ التعديلات");
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
