import { useEffect, useState } from "react";
import { collection, query, getDocs, doc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";

export type Post = {
    id: string;
    userName: string;
    userEmail: string;
    content: string;
    status: "pending" | "approved" | "rejected";
    createdAt: any;
};

export function useAdminPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const q = query(
                collection(db, "posts"),
                orderBy("createdAt", "desc")
            );
            const snap = await getDocs(q);
            setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast.error("Failed to load posts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
        try {
            await updateDoc(doc(db, "posts", id), { status });
            toast.success(`Post ${status} successfully!`);
            setPosts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
        } catch (error) {
            console.error(`Error marking post as ${status}:`, error);
            toast.error("Failed to update post status.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to permanently delete this post?")) return;
        try {
            await deleteDoc(doc(db, "posts", id));
            toast.success("Post deleted forever.");
            setPosts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post.");
        }
    };

    return {
        posts,
        loading,
        handleUpdateStatus,
        handleDelete
    };
}
