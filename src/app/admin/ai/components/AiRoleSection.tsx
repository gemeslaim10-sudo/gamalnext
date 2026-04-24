import { Zap } from "lucide-react";
import type { AiSettingsData } from "../useAiSettings";

interface AiRoleSectionProps {
    formData: AiSettingsData;
    setFormData: React.Dispatch<React.SetStateAction<AiSettingsData>>;
}

export function AiRoleSection({ formData, setFormData }: AiRoleSectionProps) {
    return (
        <div className="space-y-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col">
            <h2 className="text-xl font-black text-white flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                1. تعريف الدور (System Role)
            </h2>
            <div className="flex-1 space-y-4">
                <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.2em]">المهمة والشخصية (Persona Description)</label>
                    <textarea 
                        value={formData.systemRole}
                        onChange={(e) => setFormData(prev => ({ ...prev, systemRole: e.target.value }))}
                        className="w-full h-56 bg-slate-950/50 border border-slate-800 rounded-2xl p-5 text-slate-300 focus:border-blue-500 outline-none transition-all resize-none text-sm leading-relaxed custom-scrollbar"
                        placeholder="أنت المساعد الذكي الرسمي لـ Gamal.Dev. دورك هو..."
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.2em]">رسالة الترحيب الأولى (أول انطباع)</label>
                    <input 
                        value={formData.welcomeMessage}
                        onChange={(e) => setFormData(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-5 text-white focus:border-blue-500 outline-none transition-all font-bold placeholder:text-slate-700 shadow-inner"
                        placeholder="أهلًا بك في منصة جمال 👋 منوّر موقعنا!..."
                    />
                </div>
            </div>
        </div>
    );
}
