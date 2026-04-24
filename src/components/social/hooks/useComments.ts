import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
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
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
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
            setComments(data);
        }, (error) => {
            console.error("Comments subscription error:", error);
            if (error.code === 'failed-precondition') {
                toast.error("Comments Index creation required (check console)");
            }
        });

        return () => unsubscribe();
    }, [articleId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("You must log in to comment");
            return;
        }
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            await addDoc(collection(db, "comments"), {
                articleId,
                userId: user.uid,
                userName: user.displayName || "User",
                userPhoto: user.photoURL || "",
                content: newComment,
                createdAt: serverTimestamp()
            });
            setNewComment("");
            toast.success("Comment added successfully");
        } catch (e: unknown) {
            console.error("Error submitting comment:", e);
            const errorObj = e as { code?: string };
            if (errorObj.code === 'permission-denied') {
                toast.error("Sorry, you don't have permission to comment. Please log in again.");
            } else {
                toast.error("An error occurred while posting the comment.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this comment?")) return;
        try {
            await deleteDoc(doc(db, "comments", id));
            toast.success("Deleted");
        } catch (e) {
            toast.error("Error deleting");
        }
    };

    return {
        user,
        comments,
        newComment,
        setNewComment,
        submitting,
        handleSubmit,
        handleDelete
    };
}
