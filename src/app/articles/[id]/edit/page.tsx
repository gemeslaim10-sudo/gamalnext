"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/layout/Navbar";
import { toast, Toaster } from "react-hot-toast";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditArticlePage({ params }: { params: { id: string } }) {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        summary: "",
        tags: "",
        media: [] as any[]
    });

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const docRef = doc(db, "articles", params.id);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    toast.error("المقال غير موجود");
                    router.push("/articles");
                    return;
                }

                const article = docSnap.data();

                // Check if user is the author
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
    }, [params.id, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);

        try {
            const docRef = doc(db, "articles", params.id);
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
            router.push(`/articles/${params.id}`);
        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ أثناء حفظ التعديلات");
        } finally {
            setSaving(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-6">
                <div className="text-2xl font-bold">رجاء تسجيل الدخول أولاً</div>
                <p className="text-slate-400">يجب عليك تسجيل الدخول لتتمكن من تعديل المقالات</p>
            </div>
        );
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-4xl mx-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-center gap-4 mb-6">
                        <Link
                            href={`/articles/${params.id}`}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white">تعديل المقال ✏️</h1>
                            <p className="text-slate-400 mt-2">قم بتحديث محتوى المقال</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-slate-300 font-bold mb-2">عنوان المقال</label>
                            <input
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="عنوان المقال..."
                            />
                        </div>

                        <MediaUpload
                            items={formData.media}
                            onChange={(media) => setFormData({ ...formData, media })}
                        />

                        <div>
                            <label className="block text-slate-300 font-bold mb-2">محتوى المقال</label>
                            <textarea
                                required
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-96 font-mono leading-relaxed"
                                placeholder="اكتب محتوى المقال هنا..."
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-300 font-bold mb-2">وصف محركات البحث (Meta Description)</label>
                                <textarea
                                    value={formData.summary}
                                    onChange={e => setFormData({ ...formData, summary: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-32"
                                    placeholder="وصف مختصر للمقال يظهر في نتائج البحث..."
                                    maxLength={160}
                                />
                                <div className="text-right text-xs text-slate-500 mt-1">
                                    {formData.summary.length}/160
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-300 font-bold mb-2">الكلمات المفتاحية (Tags)</label>
                                <textarea
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-32"
                                    placeholder="كلمات دلالية مفصولة بفاصلة..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                        >
                            {saving ? <Loader2 className="animate-spin" /> : <><Save /> حفظ التعديلات</>}
                        </button>
                    </form>
                </div>
            </div>
            <Toaster />
        </main>
    );
}
