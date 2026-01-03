"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { Save, Loader2, Sparkles, RefreshCcw, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/AuthModal";

export default function WriteArticlePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [regeneratingImage, setRegeneratingImage] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        summary: "",
        tags: "",
        media: [] as any[]
    });
    const [imageQuery, setImageQuery] = useState("");

    const handleAiImageRegenerate = async () => {
        if (!formData.title) return;
        setRegeneratingImage(true);
        toast.loading("جاري البحث عن صورة جديدة...", { id: "img-gen" });

        try {
            const res = await fetch("/api/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: formData.title })
            });

            if (!res.ok) throw new Error("Correction failed");

            const data = await res.json();

            setFormData(prev => ({
                ...prev,
                media: [{ url: data.imageUrl, type: 'image' }]
            }));

            toast.success("تم تحديث الصورة بنجاح! 🎨", { id: "img-gen" });

        } catch (error) {
            toast.error("فشل تحديث الصورة", { id: "img-gen" });
        } finally {
            setRegeneratingImage(false);
        }
    };

    const [enhancingTitle, setEnhancingTitle] = useState(false);

    const handleEnhanceTitle = async () => {
        if (!formData.title) return;
        setEnhancingTitle(true);
        toast.loading("جاري تحسين العنوان ...", { id: "enhance-title" });

        try {
            const res = await fetch("/api/enhance-title", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: formData.title })
            });

            const data = await res.json();
            if (data.improvedTitle) {
                setFormData(prev => ({ ...prev, title: data.improvedTitle }));
                toast.success("تم تحسين العنوان! 🚀", { id: "enhance-title" });
            } else {
                throw new Error("Failed");
            }
        } catch (e) {
            toast.error("فشل تحسين العنوان", { id: "enhance-title" });
        } finally {
            setEnhancingTitle(false);
        }
    };

    const handleAiGenerate = async () => {
        if (!formData.title) {
            toast.error("الرجاء كتابة عنوان المقال أولاً");
            return;
        }

        setGenerating(true);
        toast.loading("جاري توليد المقال والصورة بالذكاء الاصطناعي...", { id: "ai-gen" });

        try {
            const res = await fetch("/api/generate-article", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: formData.title })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setFormData(prev => ({
                ...prev,
                content: data.content,
                summary: data.metaDescription, // Populate from API
                tags: data.seoKeywords,       // Populate from API
                media: [{ url: data.imageUrl, type: 'image' }] // Auto-add AI image
            }));
            setImageQuery(data.imageSearchQuery); // Store query for manual options

            toast.success("تم إستحداث المحتوى! 🪄 الرجاء اختيار صورة مناسبة.", { id: "ai-gen" });

        } catch (error: any) {
            console.error(error);
            toast.error("حدث خطأ أثناء التوليد: " + error.message, { id: "ai-gen" });
        } finally {
            setGenerating(false);
        }
    };

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

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    if (!user) return (
        <>
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-6">
                <div className="text-2xl font-bold">رجاء تسجيل الدخول أولاً</div>
                <p className="text-slate-400">يجب عليك تسجيل الدخول لتتمكن من كتابة ونشر المقالات</p>
                <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                >
                    تسجيل الدخول
                </button>
            </div>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );

    return (
        <main className="min-h-screen bg-slate-950 pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-4xl mx-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                    <h1 className="text-3xl font-bold text-white mb-2">كتابة مقال جديد 📝</h1>
                    <p className="text-slate-400 mb-8">شارك خبراتك ومعرفتك مع المجتمع</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-slate-300 font-bold mb-2">عنوان المقال</label>
                            <div className="flex flex-col md:flex-row gap-4">
                                <input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full md:flex-grow bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="اختر عنواناً جذاباً..."
                                />
                                <button
                                    type="button"
                                    onClick={handleEnhanceTitle}
                                    disabled={enhancingTitle || !formData.title}
                                    className="bg-slate-800 hover:bg-slate-700 text-blue-400 p-3 rounded-xl transition-all border border-slate-700 disabled:opacity-50"
                                    title="تحسين العنوان بالذكاء الاصطناعي"
                                >
                                    {enhancingTitle ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAiGenerate}
                                    disabled={generating || !formData.title}
                                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 whitespace-nowrap"
                                >
                                    {generating ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                                    توليد بالذكاء الاصطناعي
                                </button>
                            </div>
                        </div>

                        <MediaUpload
                            items={formData.media}
                            onChange={(media) => setFormData({ ...formData, media })}
                        />

                        {/* Auto-Image Controls */}
                        {formData.media.length > 0 && (
                            <div className="flex flex-wrap gap-4 mt-2 mb-4">
                                {/* Only show Shuffle for LoremFlickr/Pollinations (Client-side URL tweak) */}
                                {(formData.media[0].url.includes('loremflickr') || formData.media[0].url.includes('pollinations')) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const currentUrl = formData.media[0].url;
                                            let newUrl = currentUrl;
                                            if (currentUrl.includes('seed=')) {
                                                newUrl = currentUrl.replace(/seed=\d+/, `seed=${Math.floor(Math.random() * 1000000)}`);
                                            } else if (currentUrl.includes('random=')) {
                                                newUrl = currentUrl.replace(/random=\d+/, `random=${Date.now()}`);
                                            } else {
                                                const separator = currentUrl.includes('?') ? '&' : '?';
                                                newUrl = `${currentUrl}${separator}seed=${Math.floor(Math.random() * 1000000)}`;
                                            }
                                            setFormData(prev => ({ ...prev, media: [{ url: newUrl, type: 'image' }] }));
                                            toast.success("تم تغيير الصورة 🎲");
                                        }}
                                        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700"
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                        تغيير عشوائي
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={handleAiImageRegenerate}
                                    disabled={regeneratingImage}
                                    className="flex items-center gap-2 text-white hover:text-white transition-all text-sm bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg shadow-lg shadow-blue-600/20 font-bold"
                                >
                                    {regeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                    تغيير الصورة بذكاء (AI)
                                </button>
                            </div>
                        )}

                        {/* Manual Image Search Helper */}
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <label className="block text-slate-300 font-bold mb-2 text-sm">إضافة صورة (بحث يدوي)</label>
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="رابط الصورة الخارجية (التي اخترتها)..."
                                        className="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm"
                                        value={formData.media[0]?.url || ""}
                                        onChange={(e) => {
                                            const url = e.target.value;
                                            if (!url) {
                                                setFormData({ ...formData, media: [] });
                                            } else {
                                                setFormData({ ...formData, media: [{ url, type: 'image' }] });
                                            }
                                        }}
                                    />
                                </div>

                                {imageQuery && (
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <span className="text-slate-400 text-xs">بحث مقترح: {imageQuery}</span>
                                        <button
                                            type="button"
                                            onClick={() => window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(imageQuery)}`, '_blank')}
                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs flex items-center gap-1"
                                        >
                                            بحث في Google
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => window.open(`https://unsplash.com/s/photos/${encodeURIComponent(imageQuery)}`, '_blank')}
                                            className="px-3 py-1 bg-gray-100 hover:bg-white text-black rounded text-xs flex items-center gap-1 font-bold"
                                        >
                                            بحث في Unsplash
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

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
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><Save /> إرسال للنشر</>}
                        </button>
                    </form>
                </div>
            </div>
            <Toaster />
        </main>
    );
}
