"use client";

import { useState, useEffect } from "react";
import {
    collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { Plus, Trash2, ToggleLeft, ToggleRight, Loader2, MessageSquare, ExternalLink, Pencil, X } from "lucide-react";
import Image from "next/image";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";

interface Ad {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    whatsappMessage: string;
    whatsappNumber: string;
    active: boolean;
    showInSidebar: boolean;
    showInFeed: boolean;
    createdAt?: unknown;
}

const EMPTY_FORM: Omit<Ad, "id" | "createdAt"> = {
    title: "",
    description: "",
    imageUrl: "",
    whatsappMessage: "",
    whatsappNumber: "201024531452",
    active: true,
    showInSidebar: true,
    showInFeed: false,
};

export default function AdminAdsPage() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchAds = async () => {
        try {
            const snap = await getDocs(query(collection(db, "ads"), orderBy("createdAt", "desc")));
            setAds(snap.docs.map(d => ({ id: d.id, ...d.data() } as Ad)));
        } catch (e) {
            console.error(e);
            toast.error("Failed to load ads");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAds(); }, []);

    const openEdit = (ad: Ad) => {
        setForm({
            title: ad.title,
            description: ad.description,
            imageUrl: ad.imageUrl,
            whatsappMessage: ad.whatsappMessage,
            whatsappNumber: ad.whatsappNumber,
            active: ad.active,
            showInSidebar: ad.showInSidebar ?? true,
            showInFeed: ad.showInFeed ?? false,
        });
        setEditingId(ad.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm({ ...EMPTY_FORM });
    };

    const handleSave = async () => {
        if (!form.title.trim() || !form.description.trim()) {
            toast.error("Title and description are required.");
            return;
        }
        if (!form.showInSidebar && !form.showInFeed) {
            toast.error("يجب اختيار مكان ظهور واحد على الأقل.");
            return;
        }
        setSaving(true);
        try {
            if (editingId) {
                // ── UPDATE existing ad ──────────────────────────────────
                await updateDoc(doc(db, "ads", editingId), { ...form });
                toast.success("تم تحديث الإعلان!");
                setAds(prev => prev.map(a => a.id === editingId ? { ...a, ...form } : a));
            } else {
                // ── CREATE new ad ───────────────────────────────────────
                await addDoc(collection(db, "ads"), { ...form, createdAt: serverTimestamp() });
                toast.success("تم إنشاء الإعلان!");
                fetchAds();
            }
            closeForm();
        } catch (e) {
            console.error(e);
            toast.error("فشل حفظ الإعلان.");
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (id: string, current: boolean) => {
        try {
            await updateDoc(doc(db, "ads", id), { active: !current });
            setAds(prev => prev.map(a => a.id === id ? { ...a, active: !current } : a));
            toast.success(`Ad ${!current ? "activated" : "deactivated"}`);
        } catch (e) {
            console.error(e);
            toast.error("Failed to toggle ad.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this ad permanently?")) return;
        try {
            await deleteDoc(doc(db, "ads", id));
            setAds(prev => prev.filter(a => a.id !== id));
            toast.success("Ad deleted.");
        } catch (e) {
            console.error(e);
            toast.error("Failed to delete ad.");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">إدارة الإعلانات</h1>
                    <p className="text-slate-400 text-sm mt-1">إعلانات تظهر في Sidebar أو وسط منشورات Explore</p>
                </div>
                <button
                    onClick={() => { closeForm(); setShowForm(v => !v); }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors font-medium"
                >
                    <Plus className="w-4 h-4" />
                    إعلان جديد
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">
                            {editingId ? "✏️ تعديل الإعلان" : "إعلان جديد"}
                        </h2>
                        <button onClick={closeForm} className="text-slate-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">صورة الإعلان</label>
                        <MultiImageUpload
                            value={form.imageUrl ? [form.imageUrl] : []}
                            onChange={(urls) => setForm(f => ({ ...f, imageUrl: urls[0] || "" }))}
                            label="صورة الإعلان"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">العنوان *</label>
                            <input
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                placeholder="عنوان الإعلان..."
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                                dir="auto"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">رقم الواتساب (بدون +)</label>
                            <input
                                value={form.whatsappNumber}
                                onChange={e => setForm(f => ({ ...f, whatsappNumber: e.target.value }))}
                                placeholder="201024531452"
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">وصف الإعلان *</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="اكتب تفاصيل العرض..."
                            rows={3}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 resize-none"
                            dir="auto"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">رسالة الواتساب الجاهزة</label>
                        <textarea
                            value={form.whatsappMessage}
                            onChange={e => setForm(f => ({ ...f, whatsappMessage: e.target.value }))}
                            placeholder="مرحباً، رأيت إعلانكم عن ... وأريد الاستفسار"
                            rows={2}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 resize-none"
                            dir="auto"
                        />
                    </div>

                    {/* Placement Checkboxes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-3">📍 مكان ظهور الإعلان *</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <label className={`flex items-center gap-3 flex-1 p-4 rounded-xl border cursor-pointer transition-all ${
                                form.showInSidebar
                                    ? 'bg-blue-500/10 border-blue-500/50 text-blue-300'
                                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                            }`}>
                                <input
                                    type="checkbox"
                                    checked={form.showInSidebar}
                                    onChange={e => setForm(f => ({ ...f, showInSidebar: e.target.checked }))}
                                    className="w-4 h-4 accent-blue-500"
                                />
                                <div>
                                    <p className="font-semibold text-sm">📌 السايد بار</p>
                                    <p className="text-xs opacity-70 mt-0.5">يظهر في العمود الجانبي بصفحة Explore</p>
                                </div>
                            </label>

                            <label className={`flex items-center gap-3 flex-1 p-4 rounded-xl border cursor-pointer transition-all ${
                                form.showInFeed
                                    ? 'bg-purple-500/10 border-purple-500/50 text-purple-300'
                                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                            }`}>
                                <input
                                    type="checkbox"
                                    checked={form.showInFeed}
                                    onChange={e => setForm(f => ({ ...f, showInFeed: e.target.checked }))}
                                    className="w-4 h-4 accent-purple-500"
                                />
                                <div>
                                    <p className="font-semibold text-sm">📰 وسط المنشورات</p>
                                    <p className="text-xs opacity-70 mt-0.5">يظهر بين المنشورات في الفيد</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            {editingId ? "تحديث الإعلان" : "حفظ الإعلان"}
                        </button>
                        <button
                            onClick={closeForm}
                            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
                        >
                            إلغاء
                        </button>
                    </div>
                </div>
            )}

            {/* Ads List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
                </div>
            ) : ads.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">لا توجد إعلانات حتى الآن</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {ads.map(ad => (
                        <div key={ad.id} className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col sm:flex-row gap-0">
                            {/* Thumbnail */}
                            {ad.imageUrl && (
                                <div className="relative w-full sm:w-48 h-36 shrink-0 bg-slate-800">
                                    <Image src={ad.imageUrl} alt={ad.title} fill className="object-cover" />
                                </div>
                            )}
                            <div className="flex-1 p-5 flex flex-col justify-between gap-3">
                                <div>
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="font-bold text-white text-lg" dir="auto">{ad.title}</h3>
                                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${ad.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-400'}`}>
                                                {ad.active ? "Active" : "Inactive"}
                                            </span>
                                            {ad.showInSidebar && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">📌 Sidebar</span>
                                            )}
                                            {ad.showInFeed && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">📰 In-Feed</span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-sm mt-1 line-clamp-2" dir="auto">{ad.description}</p>
                                    {ad.whatsappMessage && (
                                        <div className="mt-2 flex items-start gap-2 text-xs text-slate-500 bg-slate-800/50 rounded-lg px-3 py-2">
                                            <ExternalLink className="w-3 h-3 mt-0.5 shrink-0" />
                                            <span dir="auto">{ad.whatsappMessage}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                        onClick={() => openEdit(ad)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" /> تعديل
                                    </button>
                                    <button
                                        onClick={() => handleToggle(ad.id, ad.active)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${ad.active ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'}`}
                                    >
                                        {ad.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                        {ad.active ? "إيقاف" : "تفعيل"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ad.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" /> حذف
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
