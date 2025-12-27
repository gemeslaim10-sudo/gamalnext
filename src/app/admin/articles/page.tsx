"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Trash, Edit, Save, X, Check } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { MediaUpload } from "@/components/admin/MediaUpload";
import Image from "next/image";

type MediaItem = {
    url: string;
    type: 'image' | 'video';
}

type Article = {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    media: MediaItem[];
    status?: 'published' | 'pending';
    authorName?: string;
    authorId?: string;
    createdAt: any;
}

const initialForm = {
    title: "",
    slug: "",
    summary: "",
    content: "",
    media: [] as MediaItem[]
};

export default function ArticlesAdminPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [filter, setFilter] = useState<'all' | 'published' | 'pending'>('all');
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [formData, setFormData] = useState(initialForm);

    const displayedArticles = articles.filter(a => {
        if (filter === 'all') return true;
        // If status is undefined, assume published for old articles
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

    useEffect(() => {
        const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Article));
            setArticles(data);
        });
        return () => unsubscribe();
    }, []);

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
            .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '') // Keep Arabic, English, Numbers
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

    return (
        <div className="max-w-6xl mx-auto min-h-screen pb-20">
            <Toaster />

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Articles Manager</h1>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                    >
                        <Plus className="w-5 h-5" /> New Article
                    </button>
                )}
            </div>

            {/* Editor Form */}
            {isEditing && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 shadow-2xl animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between mb-6">
                        <h2 className="text-xl font-bold text-blue-400">{currentId ? "Edit Article" : "Create New Article"}</h2>
                        <button onClick={resetForm} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Title</label>
                                <input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Slug (Auto-generated if empty)</label>
                                <input
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder={formData.title ? generateSlug(formData.title) : ""}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Summary (SEO Description)</label>
                            <textarea
                                value={formData.summary}
                                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                required
                            />
                        </div>

                        {/* Media Upload */}
                        <MediaUpload
                            items={formData.media}
                            onChange={(media) => setFormData({ ...formData, media })}
                        />

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Content (Supports Markdown/HTML)</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-64 font-mono leading-relaxed"
                                placeholder="Write your article content here..."
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                            <button type="button" onClick={resetForm} className="px-6 py-2 text-slate-400 hover:text-white font-bold">Cancel</button>
                            <button type="submit" className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center gap-2">
                                <Save className="w-5 h-5" /> Save Article
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('published')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'published' ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                    Published
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                    Pending Review
                </button>
            </div>

            {/* Listing */}
            <div className="grid grid-cols-1 gap-4">
                {displayedArticles.map((article) => (
                    <div key={article.id} className={`bg-slate-900 border ${article.status === 'pending' ? 'border-yellow-500/50' : 'border-slate-800'} p-4 rounded-xl flex flex-col md:flex-row gap-6 items-start hover:border-blue-500/30 transition-colors`}>
                        {/* Thumbnail */}
                        <div className="w-full md:w-48 aspect-video bg-slate-950 rounded-lg overflow-hidden flex-shrink-0 border border-slate-800 group relative">
                            {article.media?.[0] ? (
                                article.media[0].type === 'video' ? (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600 font-bold">VIDEO</div>
                                ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={article.media[0].url} alt={article.title} className="w-full h-full object-cover" />
                                )
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No Media</div>
                            )}
                            {article.status === 'pending' && (
                                <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
                                    <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">PENDING</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                {article.title}
                                {article.status === 'pending' && <span className="bg-yellow-500/10 text-yellow-500 text-[10px] px-2 py-0.5 rounded border border-yellow-500/20">NEEDS REVIEW</span>}
                            </h3>
                            <p className="text-slate-400 text-sm line-clamp-2 md:line-clamp-1 mb-3">{article.summary}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                                <span className="text-blue-400">By: {article.authorName || 'Admin'}</span>
                                <span>/{article.slug}</span>
                                <span>{article.media?.length || 0} Media Items</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center">
                            {article.status === 'pending' && (
                                <button
                                    onClick={() => handleApprove(article)}
                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                                >
                                    <Check className="w-4 h-4" /> Approve
                                </button>
                            )}
                            <button onClick={() => handleEdit(article)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                                <Edit className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleDelete(article.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                <Trash className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
                {articles.length === 0 && !isEditing && (
                    <div className="text-center py-20 text-slate-500">No articles found. Create one above!</div>
                )}
            </div>
        </div>
    );
}
