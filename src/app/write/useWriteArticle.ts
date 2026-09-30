import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ALLOWED_ADMINS } from "@/lib/constants";
import { refreshSite } from "@/lib/refreshSite";
import { reportEvent } from "@/lib/reportEvent";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCopy } from "@/components/providers/CopyProvider";
import type { WriteFormData } from "./types";
import { useAiArticleEnhancer } from "./hooks/useAiArticleEnhancer";

export function useWriteArticle() {
    const { user } = useAuth();
    const router = useRouter();
    const t = useCopy();

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

        // The form skips the browser's own validation so these messages can be edited in the dashboard
        if (!formData.title.trim()) {
            toast.error(t("account.writeTitleRequired"));
            document.getElementById("article-title")?.focus();
            return;
        }
        if (!formData.content.trim()) {
            toast.error(t("account.writeContentRequired"));
            document.getElementById("article-content")?.focus();
            return;
        }

        setLoading(true);

        // Check if Admin
        const isAdmin = ALLOWED_ADMINS.includes(user.email || "");
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
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean), // Process tags
                createdAt: serverTimestamp()
            });

            // If pending, notify admin
            if (status === "pending") {
                reportEvent({ event: "article.pending", id: articleRef.id });
                await addDoc(collection(db, "notifications"), {
                    recipientId: 'ADMIN',
                    senderId: user.uid,
                    senderName: user.displayName || "User",
                    type: 'review_request',
                    link: '/admin/articles', // Admin checks list
                    read: false,
                    createdAt: serverTimestamp()
                });
                toast.success(t("account.writeSubmitted"));
                router.push("/users/" + user.uid);
            } else {
                // Published right away: add it to the cached blog, home feed and sitemap first
                await refreshSite({ articleId: articleRef.id });
                toast.success(t("account.writePublished"));
                router.push(`/articles/${articleRef.id}`);
            }

        } catch (error) {
            console.error(error);
            toast.error(t("account.writePublishFailed"));
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
