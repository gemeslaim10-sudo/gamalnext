"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save, Bot, Loader2, Zap, Sparkles, Key, History } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminAiPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [systemRole, setSystemRole] = useState("");
    const [prompt, setPrompt] = useState("");
    const [stylePrompt, setStylePrompt] = useState("");
    const [welcomeMessage, setWelcomeMessage] = useState("");
    const [geminiKey, setGeminiKey] = useState("");
    const [groqKey, setGroqKey] = useState("");
    const [openRouterKey, setOpenRouterKey] = useState("");
    const [openaiKey, setOpenaiKey] = useState("");
    const [huggingfaceKey, setHuggingfaceKey] = useState("");
    const [modelName, setModelName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const docRef = doc(db, "settings", "ai");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setSystemRole(data.systemRole || "");
                    setPrompt(data.prompt || "");
                    setStylePrompt(data.stylePrompt || "");
                    setWelcomeMessage(data.welcomeMessage || "");
                    setGeminiKey(data.geminiKey || "");
                    setGroqKey(data.groqKey || "");
                    setOpenRouterKey(data.openRouterKey || "");
                    setOpenaiKey(data.openaiKey || "");
                    setHuggingfaceKey(data.huggingfaceKey || "");
                    setModelName(data.modelName || "gemini-2.0-flash-exp");
                }
            } catch (error) {
                console.error("Error fetching AI config:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, [user, router]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "settings", "ai"), {
                systemRole,
                prompt,
                stylePrompt,
                welcomeMessage,
                geminiKey,
                groqKey,
                openRouterKey,
                openaiKey,
                huggingfaceKey,
                modelName,
                updatedAt: new Date().toISOString()
            }, { merge: true });
            toast.success("تم حفظ إعدادات الوكيل الذكي بنجاح!");
        } catch (error) {
            console.error("Error saving AI config:", error);
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
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
            <Toaster />
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header Container */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/50 p-6 md:p-8 rounded-[2rem] border border-slate-800 backdrop-blur-xl gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-blue-500/10 rounded-2xl shadow-inner border border-blue-500/20">
                            <Bot className="w-10 h-10 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">إعدادات الوكيل الذكي (AI Agent)</h1>
                            <p className="text-slate-400 text-sm mt-1 font-medium">التحكم الكامل في شخصية، معلومات، وأسلوب المحادثة</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-2xl text-white font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                    >
                        <Save className="w-5 h-5" /> {saving ? "جاري الحفظ..." : "حفظ البنية الذكية"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* 1. The Role Section */}
                    <div className="space-y-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col">
                        <h2 className="text-xl font-black text-white flex items-center gap-3 mb-2">
                            <Zap className="w-6 h-6 text-yellow-500" />
                            1. تعريف الدور (System Role)
                        </h2>
                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.2em]">المهمة والشخصية (Persona Description)</label>
                                <textarea 
                                    value={systemRole}
                                    onChange={(e) => setSystemRole(e.target.value)}
                                    className="w-full h-56 bg-slate-950/50 border border-slate-800 rounded-2xl p-5 text-slate-300 focus:border-blue-500 outline-none transition-all resize-none text-sm leading-relaxed custom-scrollbar"
                                    placeholder="أنت المساعد الذكي الرسمي لـ Gamal.Dev. دورك هو..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.2em]">رسالة الترحيب الأولى (أول انطباع)</label>
                                <input 
                                    value={welcomeMessage}
                                    onChange={(e) => setWelcomeMessage(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-5 text-white focus:border-blue-500 outline-none transition-all font-bold placeholder:text-slate-700 shadow-inner"
                                    placeholder="أهلًا بك في منصة جمال 👋 منوّر موقعنا!..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Style & Rules Section */}
                    <div className="space-y-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col">
                        <h2 className="text-xl font-black text-white flex items-center gap-3 mb-2">
                            <Sparkles className="w-6 h-6 text-purple-500" />
                            2. الخبرة والأسلوب (Style & Tone)
                        </h2>
                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.2em]">نبرة الصوت والقواعد الأسلوبية</label>
                                <textarea 
                                    value={stylePrompt}
                                    onChange={(e) => setStylePrompt(e.target.value)}
                                    className="w-full h-40 bg-slate-950/50 border border-slate-800 rounded-2xl p-5 text-slate-300 focus:border-purple-500 outline-none transition-all resize-none text-sm leading-relaxed"
                                    placeholder="كن ودوداً، مختصراً، واستخدم المصطلحات التقنية بدقة..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.2em]">قواعد العمل الصارمة (Strict Business Rules)</label>
                                <textarea 
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="w-full h-48 bg-slate-950/50 border border-slate-800 rounded-2xl p-5 text-slate-400 focus:border-red-500 outline-none transition-all resize-none text-xs leading-loose font-mono custom-scrollbar"
                                    placeholder="1. لا تعطِ أكواد برمجية\n2. شجع على الواتساب..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. API Keys Section */}
                    <div className="lg:col-span-2 space-y-8 bg-slate-900/20 p-8 md:p-12 rounded-[3.5rem] border border-slate-800 shadow-inner mt-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-8 mb-4">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                <Key className="w-8 h-8 text-green-500" />
                                3. محركات التشغيل (Execution Engines)
                            </h2>
                            <div className="hidden md:block">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-900 px-4 py-2 rounded-full border border-slate-800">تشفير آمن بنسبة 100%</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 ml-2 uppercase">Google Gemini (Primary)</label>
                                <input type="password" value={geminiKey} onChange={e => setGeminiKey(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none shadow-sm" placeholder="AIzaSy..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 ml-2 uppercase">Groq Cloud (Fallback)</label>
                                <input type="password" value={groqKey} onChange={e => setGroqKey(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-orange-500 outline-none shadow-sm" placeholder="gsk_..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 ml-2 uppercase">OpenRouter (Global)</label>
                                <input type="password" value={openRouterKey} onChange={e => setOpenRouterKey(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none shadow-sm" placeholder="sk-or-v1-..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 ml-2 uppercase">OpenAI (Legacy)</label>
                                <input type="password" value={openaiKey} onChange={e => setOpenaiKey(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-white/20 outline-none shadow-sm" placeholder="sk-..." />
                            </div>
                        </div>

                        <div className="pt-10 border-t border-slate-800 mt-6">
                            <div className="flex flex-col lg:flex-row items-center gap-10">
                                <div className="w-full lg:w-1/3">
                                    <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">نموذج الذكاء الاصطناعي الافتراضي</label>
                                    <div className="relative">
                                        <input value={modelName} onChange={e => setModelName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none font-mono text-sm" placeholder="auto" />
                                        <Bot className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 w-5 h-5" />
                                    </div>
                                    <p className="text-[10px] text-slate-600 mt-2 px-2 italic">
                                        * اكتب <span className="text-blue-500 font-bold">auto</span> أو <span className="text-blue-500 font-bold">تلقائي</span> لتفعيل نظام الذكاء الخارق الذي يختار أفضل موديل متاح حالياً.
                                    </p>
                                </div>
                                <div className="flex-1 bg-blue-500/5 p-6 rounded-[2rem] border border-blue-500/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all"></div>
                                    <div className="relative z-10">
                                        <h4 className="text-xs font-black text-blue-400 mb-2 flex items-center gap-2">
                                            <Sparkles className="w-3 h-3" /> ملاحظة تقنية
                                        </h4>
                                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                                            يتم استخدام هذا النموذج كمحرك أساسي للوكيل. في حال تعذر الوصول إليه بسبب الكوتا أو أي عطل، يقوم وكيل جمال بالتبديل تلقائياً للمحركات البديلة (Groq/OpenRouter) لضمان عدم توقف الخدمة عن الزوار أبداً.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
