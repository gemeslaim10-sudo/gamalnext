import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, addDoc, updateDoc, serverTimestamp, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { Article, initialForm } from "./types";

export function useArticlesManagement() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [filter, setFilter] = useState<'all' | 'published' | 'pending'>('all');
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        const q = query(collection(db, "articles"), orderBy("createdAt", "desc"), limit(50));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Article));
            setArticles(data);
        });
        return () => unsubscribe();
    }, []);

    const displayedArticles = articles.filter(a => {
        if (filter === 'all') return true;
        const status = a.status || 'published';
        return status === filter;
    });

    const handleApprove = async (article: Article) => {
        try {
            await updateDoc(doc(db, "articles", article.id), {
                status: 'published',
                updatedAt: serverTimestamp()
            });

            // Notify Author
            if (article.authorId) {
                await addDoc(collection(db, "notifications"), {
                    recipientId: article.authorId,
                    type: 'article_approved',
                    senderId: 'ADMIN',
                    senderName: 'Admin Team',
                    link: `/articles/${article.id}`,
                    read: false,
                    createdAt: serverTimestamp()
                });
            }
            toast.success("Article Published & Author Notified!");
        } catch (e) {
            toast.error("Error approving article");
        }
    };

    const resetForm = () => {
        setFormData(initialForm);
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleEdit = (article: Article) => {
        setFormData({
            title: article.title,
            slug: article.slug,
            summary: article.summary,
            content: article.content,
            media: article.media || []
        });
        setCurrentId(article.id);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this article?")) {
            try {
                await deleteDoc(doc(db, "articles", id));
                toast.success("Article deleted");
            } catch (e) {
                toast.error("Error deleting article");
            }
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataToSave = {
                ...formData,
                slug: formData.slug || generateSlug(formData.title),
                updatedAt: serverTimestamp()
            };

            if (currentId) {
                await updateDoc(doc(db, "articles", currentId), dataToSave);
                toast.success("Article updated");
            } else {
                await addDoc(collection(db, "articles"), {
                    ...dataToSave,
                    createdAt: serverTimestamp()
                });
                toast.success("Article created");
            }
            resetForm();
        } catch (e) {
            console.error(e);
            toast.error("Error saving article");
        }
    };

    return {
        articles,
        displayedArticles,
        filter,
        setFilter,
        isEditing,
        setIsEditing,
        currentId,
        formData,
        setFormData,
        handleApprove,
        resetForm,
        handleEdit,
        handleDelete,
        handleSubmit,
        generateSlug
    };
}
