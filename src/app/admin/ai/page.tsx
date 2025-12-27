"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save, Bot, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminAiPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [prompt, setPrompt] = useState("");
    const [welcomeMessage, setWelcomeMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Simple Admin Check done in layout/rules
        const fetchPrompt = async () => {
            try {
                const docRef = doc(db, "settings", "ai");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setPrompt(data.prompt || "");
                    setWelcomeMessage(data.welcomeMessage || "");
                } else {
                    setPrompt("You are a helpful assistant.");
                    setWelcomeMessage("مرحباً بك! 👋\nأنا المساعد الذكي الخاص بالموقع. كيف يمكنني مساعدتك اليوم؟");
                }
            } catch (error) {
                console.error("Error fetching prompt:", error);
                toast.error("فشل في تحميل البيانات");
            } finally {
                setLoading(false);
            }
        };

        fetchPrompt();
    }, [user, router]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "settings", "ai"), {
                prompt: prompt,
                welcomeMessage: welcomeMessage,
                // We don't save modelName anymore, letting the backend auto-detect
                updatedAt: new Date()
            }, { merge: true });
            toast.success("تم تحديث إعدادات AI بنجاح");
        } catch (error) {
            console.error("Error saving prompt:", error);
            toast.error("حدث خطأ أثناء الحفظ");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Bot className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">إعدادات الشات الذكي (AI)</h1>
                            <p className="text-slate-400">تحكم في شخصية ومعلومات المساعد الذكي</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                جاري الحفظ...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                حفظ التغييرات
                            </>
                        )}
                    </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="mb-6 border-b border-slate-800 pb-6">
                        <label className="block text-slate-300 mb-2 font-bold">رسالة الترحيب (Welcome Message)</label>
                        <p className="text-sm text-slate-500 mb-3">
                            الرسالة التي تظهر للمستخدم أول ما يفتح الشات. استخدم <code>{`{name}`}</code> لو عايز تحط اسم الشخص مكانه.
                        </p>
                        <textarea
                            value={welcomeMessage}
                            onChange={(e) => setWelcomeMessage(e.target.value)}
                            className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300 focus:outline-none focus:border-blue-500 font-sans text-base leading-relaxed resize-none"
                            placeholder="أهلاً بك يا {name} في موقعنا..."
                            dir="auto"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-slate-300 mb-2 font-bold">البرومبت (System Prompt)</label>
                        <p className="text-sm text-slate-500 mb-4">
                            اكتب هنا كل المعلومات والتعليمات التي تريد من الـ AI أن يلتزم بها. سيتم اختيار أحدث نموذج ذكاء اصطناعي متاح تلقائياً.
                        </p>
                    </div>

                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full h-[500px] bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm leading-relaxed custom-scrollbar resize-none"
                        placeholder="أدخل تعليمات الـ AI هنا..."
                        dir="auto"
                    />
                </div>
            </div>
        </div>
    );
}
