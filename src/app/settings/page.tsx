"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/layout/Navbar";
import { toast, Toaster } from "react-hot-toast";
import { User, MapPin, Briefcase, Heart, Camera, Loader2, Save, Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteUser } from "firebase/auth";
import { openCloudinaryWidget } from "@/lib/cloudinary";

export default function SettingsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        location: "",
        jobTitle: "",
        socialStatus: "Single",
        gender: "Male",
        photoURL: ""
    });

    useEffect(() => {
        async function fetchUserData() {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data();
                    setFormData({
                        name: data.name || user.displayName || "",
                        bio: data.bio || "",
                        location: data.location || "",
                        jobTitle: data.jobTitle || "",
                        socialStatus: data.socialStatus || "Single",
                        gender: data.gender || "Male",
                        photoURL: data.photoURL || user.photoURL || ""
                    });
                }
            }
            setLoading(false);
        }
        fetchUserData();
    }, [user]);

    const handlePhotoUpload = () => {
        openCloudinaryWidget(
            (url) => {
                if (url) {
                    setFormData(prev => ({ ...prev, photoURL: url }));
                }
            },
            (error) => {
                toast.error(error.message || "فشل فتح نافذة رفع الصور");
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);
        try {
            await updateDoc(doc(db, "users", user.uid), {
                ...formData,
                updatedAt: new Date()
            });
            toast.success("تم تحديث الملف الشخصي بنجاح! 🎉");
        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ أثناء الحفظ.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;

        if (!confirm("هل أنت متأكد أنك تريد حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.")) {
            return;
        }

        if (!confirm("تحذير أخير: سيتم حذف جميع بياناتك ومقالاتك. هل أنت متأكد تماماً؟")) {
            return;
        }

        try {
            setLoading(true);
            // 1. Delete Firestore Document
            await deleteDoc(doc(db, "users", user.uid));

            // 2. Delete Auth User
            await deleteUser(user);

            // 3. Redirect
            router.push("/");
            // Force reload to clear any state
            setTimeout(() => window.location.reload(), 500);

        } catch (error: any) {
            console.error("Error deleting account:", error);
            if (error.code === 'auth/requires-recent-login') {
                toast.error("لحذف الحساب، يرجى تسجيل الخروج وتسجيل الدخول مرة أخرى للتحقق من هويتك.");
            } else {
                toast.error("حدث خطأ أثناء حذف الحساب. يرجى المحاولة مرة أخرى.");
            }
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;

    if (!user) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Please login first.</div>;

    return (
        <main className="min-h-screen bg-slate-950 pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-2xl mx-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                    <h1 className="text-3xl font-bold text-white mb-8 text-center border-b border-slate-800 pb-4">إعدادات الملف الشخصي</h1>

                    <div className="flex justify-center mb-8 relative">
                        <div className="relative group cursor-pointer" onClick={handlePhotoUpload}>
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-950 shadow-xl">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={formData.photoURL || "https://ui-avatars.com/api/?name=" + (formData.name || "User") + "&background=0D8ABC&color=fff"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-slate-400 text-sm font-medium flex items-center gap-2">
                                <User className="w-4 h-4" /> الاسم الكامل
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-400 text-sm font-medium flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> المسمى الوظيفي
                            </label>
                            <input
                                type="text"
                                value={formData.jobTitle}
                                onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                                placeholder="مثال: مطور ويب, مصمم جرافيك"
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-400 text-sm font-medium flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> الموقع / الإقامة
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                placeholder="القاهرة، مصر"
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-400 text-sm font-medium flex items-center gap-2">
                                <Heart className="w-4 h-4" /> الحالة الاجتماعية
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    value={formData.socialStatus}
                                    onChange={e => setFormData({ ...formData, socialStatus: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                >
                                    <option value="Single">أعزب/عزباء</option>
                                    <option value="Engaged">مخطوب/ة</option>
                                    <option value="Married">متزوج/ة</option>
                                    <option value="Complicated">وضع معقد😅</option>
                                </select>
                                <select
                                    value={formData.gender}
                                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                >
                                    <option value="Male">ذكر</option>
                                    <option value="Female">أنثى</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-400 text-sm font-medium">نبذة شخصية (Bio)</label>
                            <textarea
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                rows={4}
                                placeholder="اكتب نبذة مختصرة عن نفسك..."
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> حفظ التغييرات</>}
                        </button>
                    </form>

                    {/* Danger Zone */}
                    <div className="mt-12 pt-8 border-t border-red-500/20">
                        <h2 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> منطقة الخطر
                        </h2>
                        <p className="text-slate-400 text-sm mb-6">
                            بمجرد حذف حسابك، لا يمكن التراجع عن هذا الإجراء. سيتم حذف جميع بياناتك نهائياً.
                        </p>
                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> حذف الحساب نهائياً
                        </button>
                    </div>
                </div>
            </div>
            <Toaster />
        </main>
    );
}
