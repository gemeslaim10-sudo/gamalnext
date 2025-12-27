"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/AuthModal";

export default function WriteArticlePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        media: [] as any[]
    });

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
                            <input
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="اختر عنواناً جذاباً..."
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
