"use client";

import { Save, Bot, Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";

import { useAiSettings } from "./useAiSettings";
import { AiEnginesSection } from "./components/AiEnginesSection";

export default function AdminAiPage() {
    const {
        loading,
        saving,
        formData,
        setFormData,
        handleSave
    } = useAiSettings();

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
                    <AiEnginesSection formData={formData} setFormData={setFormData} />
                </div>
            </div>
        </div>
    );
}
