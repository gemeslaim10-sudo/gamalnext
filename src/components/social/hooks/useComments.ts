import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useCopy } from "@/components/providers/CopyProvider";
import { toast } from "react-hot-toast";

export type Comment = {
    id: string;
    userId: string;
    userName: string;
    userPhoto: string;
    content: string;
    createdAt?: { toDate?: () => Date };
}

export function useComments(articleId: string) {
    const t = useCopy();
    const { user } = useAuth();
    // Comments of the article they were loaded for; until the first answer for `articleId` it is loading
    const [loaded, setLoaded] = useState<{ articleId: string | null; comments: Comment[] }>({ articleId: null, comments: [] });
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const q = query(
            collection(db, "comments"),
            where("articleId", "==", articleId),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Comment));
            setLoaded({ articleId, comments: data });
        }, (error) => {
            console.error("Comments subscription error:", error);
            // Keep comments that already arrived for this article; otherwise show none
            setLoaded((prev) => (prev.articleId === articleId ? prev : { articleId, comments: [] }));
            if (error.code === 'failed-precondition') {
                // A missing Firestore index; the console error above has the link to create it
                toast.error(t("blog.commentsLoadFailed"));
            }
        });

        return () => unsubscribe();
    }, [articleId, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error(t("blog.commentLoginRequired"));
            return;
        }
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            await addDoc(collection(db, "comments"), {
                articleId,
                userId: user.uid,
                userName: user.displayName || t("blog.commentDefaultName"),
                userPhoto: user.photoURL || "",
                content: newComment,
                createdAt: serverTimestamp()
            });
            setNewComment("");
            toast.success(t("blog.commentAdded"));
        } catch (e: unknown) {
            console.error("Error submitting comment:", e);
            const errorObj = e as { code?: string };
            if (errorObj.code === 'permission-denied') {
                toast.error(t("blog.commentNotAllowed"));
            } else {
                toast.error(t("blog.commentFailed"));
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t("blog.commentDeleteConfirm"))) return;
        try {
            await deleteDoc(doc(db, "comments", id));
            toast.success(t("blog.commentDeleted"));
        } catch {
            toast.error(t("blog.commentDeleteFailed"));
        }
    };

    const loading = loaded.articleId !== articleId;

    return {
        user,
        comments: loading ? [] : loaded.comments,
        loading,
        newComment,
        setNewComment,
        submitting,
        handleSubmit,
        handleDelete
    };
}
