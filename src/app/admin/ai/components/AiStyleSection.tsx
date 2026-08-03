import { Sparkles } from "lucide-react";
import type { AiSettingsData } from "../useAiSettings";

interface AiStyleSectionProps {
    formData: AiSettingsData;
    setFormData: React.Dispatch<React.SetStateAction<AiSettingsData>>;
}

export function AiStyleSection({ formData, setFormData }: AiStyleSectionProps) {
    return (
        <div className="space-y-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col">
            <h2 className="text-xl font-black text-white flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                2. الخبرة والأسلوب (Style & Tone)
            </h2>
            <div className="flex-1 space-y-4">
                <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.2em]">نبرة الصوت والقواعد الأسلوبية</label>
                    <textarea 
                        value={formData.stylePrompt}
                        onChange={(e) => setFormData(prev => ({ ...prev, stylePrompt: e.target.value }))}
                        className="w-full h-40 bg-slate-950/50 border border-slate-800 rounded-2xl p-5 text-slate-300 focus:border-purple-500 outline-none transition-all resize-none text-sm leading-relaxed"
                        placeholder="كن ودوداً، مختصراً، واستخدم المصطلحات التقنية بدقة..."
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.2em]">قواعد العمل الصارمة (Strict Business Rules)</label>
                    <textarea 
                        value={formData.prompt}
                        onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                        className="w-full h-48 bg-slate-950/50 border border-slate-800 rounded-2xl p-5 text-slate-400 focus:border-red-500 outline-none transition-all resize-none text-xs leading-loose font-mono custom-scrollbar"
                        placeholder="1. لا تعطِ أكواد برمجية\n2. شجع على الواتساب..."
                    />
                </div>
            </div>
        </div>
    );
}
