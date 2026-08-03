import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { WriteFormData } from "./types";
import { useAiArticleEnhancer } from "./hooks/useAiArticleEnhancer";

export function useWriteArticle() {
    const { user } = useAuth();
    const router = useRouter();
    
    const [loading, setLoading] = useState(false);
    const [imageQuery, setImageQuery] = useState("");
    
    const [formData, setFormData] = useState<WriteFormData>({
        title: "",
        content: "",
        summary: "",
        tags: "",
        media: []
    });

    const aiEnhancer = useAiArticleEnhancer(formData, setFormData, setImageQuery);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        // Check if Admin
        const isAdmin = user.email === "montasrrm@gmail.com" || user.email === "gemeslaim10@gmail.com";
        const status = isAdmin ? "published" : "pending";

        try {
            const articleRef = await addDoc(collection(db, "articles"), {
                ...formData,
                authorId: user.uid,
                authorName: user.displayName || "User",
                authorPhoto: user.photoURL || "",
                status: status, // Moderate if not admin
                likesCount: 0,
                commentsCount: 0,
                slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean), // Process tags
                createdAt: serverTimestamp()
            });

            // If pending, notify admin
            if (status === "pending") {
                await addDoc(collection(db, "notifications"), {
                    recipientId: 'ADMIN',
                    senderId: user.uid,
                    senderName: user.displayName || "User",
                    type: 'review_request',
                    link: '/admin/articles', // Admin checks list
                    read: false,
                    createdAt: serverTimestamp()
                });
                toast.success("تم إرسال المقال للمراجعة بنجاح! سيتم نشره بعد الموافقة.");
                router.push("/users/" + user.uid);
            } else {
                toast.success("تم نشر المقال بنجاح!");
                router.push(`/articles/${articleRef.id}`);
            }

        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ أثناء النشر");
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        formData,
        setFormData,
        imageQuery,
        setImageQuery,
        loading,
        ...aiEnhancer,
        handleSubmit
    };
}
