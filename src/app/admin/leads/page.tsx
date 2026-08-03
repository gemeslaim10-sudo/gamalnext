"use client";

import { useState, useEffect } from "react";
import { collection, query, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Phone, Briefcase, Clock, Calendar } from "lucide-react";
import toast from "react-hot-toast";

type Lead = {
    id: string;
    name?: string;
    phone?: string;
    activity?: string;
    service?: string;
    preferredTime?: string;
    capturedAt?: { seconds: number; nanoseconds: number };
};

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "leads"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Lead[];
            setLeads(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا العميل؟")) return;
        try {
            await deleteDoc(doc(db, "leads", id));
            toast.success("تم الحذف بنجاح");
        } catch (error) {
            console.error("Error deleting lead:", error);
            toast.error("حدث خطأ أثناء الحذف");
        }
    };

    const formatDate = (timestamp?: { seconds: number }) => {
        if (!timestamp) return "غير محدد";
        return new Date(timestamp.seconds * 1000).toLocaleString('ar-EG', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500" dir="rtl">
            <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-white/5 shadow-xl">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">العملاء المحتملين (Leads) 🎯</h1>
                    <p className="text-slate-400">تابع العملاء الجدد اللي تواصلوا معاك عن طريق الـ AI Agent.</p>
                </div>
                <div className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg font-bold border border-blue-500/20">
                    {leads.length} عميل
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">جاري تحميل البيانات...</p>
                </div>
            ) : leads.length === 0 ? (
                <div className="bg-slate-900 rounded-2xl p-16 text-center border border-white/5">
                    <p className="text-slate-400 text-lg">لا يوجد عملاء حتى الآن، دع الـ AI يعمل قليلًا!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leads.map((lead) => (
                        <div key={lead.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-blue-500/30 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{lead.name || "عميل مجهول"}</h3>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(lead.capturedAt)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(lead.id)}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 shrink-0"><Phone className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">رقم الموبايل</p>
                                        <p className="text-sm text-slate-200 font-mono" dir="ltr">{lead.phone || "غير متوفر"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 shrink-0"><Briefcase className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">النشاط التجاري والخدمة</p>
                                        <p className="text-sm text-slate-200">{lead.activity || "-"} • {lead.service || "-"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0"><Clock className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">الموعد المناسب للتواصل</p>
                                        <p className="text-sm text-slate-200">{lead.preferredTime || "في أي وقت"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-800 relative z-10">
                                <a
                                    href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-center text-sm font-bold rounded-xl transition-colors border border-emerald-500/20"
                                >
                                    تواصل معه عبر واتساب
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
