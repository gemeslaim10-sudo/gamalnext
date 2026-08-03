import { Key, Bot, Zap, Sparkles } from "lucide-react";
import type { AiSettingsData } from "../useAiSettings";
import { AiKeysForm } from "./AiKeysForm";

interface AiEnginesSectionProps {
    formData: AiSettingsData;
    setFormData: React.Dispatch<React.SetStateAction<AiSettingsData>>;
}

export function AiEnginesSection({ formData, setFormData }: AiEnginesSectionProps) {
    return (
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
            
            <AiKeysForm formData={formData} setFormData={setFormData} />

            <div className="pt-10 border-t border-slate-800 mt-6">
                <div className="flex flex-col lg:flex-row items-center gap-10">
                    <div className="w-full lg:w-1/2">
                        <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">اختيار محرك الذكاء الاصطناعي</label>
                        <div className="relative group">
                            <select 
                                value={formData.modelName === "auto" || formData.modelName === "تلقائي" || !formData.modelName ? "auto" : formData.modelName}
                                onChange={(e) => setFormData(prev => ({ ...prev, modelName: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none font-bold appearance-none cursor-pointer transition-all pr-12"
                            >
                                <option value="auto">🌟 تلقائي (نظام الذكاء الخارق - FAILOVER)</option>
                                <option value="gemini-2.0-flash-exp">🚀 Gemini 2.0 Flash (الأحدث والأسرح)</option>
                                <option value="gemini-1.5-flash">⚡ Gemini 1.5 Flash (متوازن)</option>
                                <option value="gemini-1.5-pro">💎 Gemini 1.5 Pro (الأعمق والأقوى)</option>
                                <option value="custom">🛠️ تخصيص يدوي (Custom Model Name)</option>
                            </select>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-blue-500 transition-colors">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                                <Zap className="w-4 h-4 fill-current" />
                            </div>
                        </div>
                        
                        {/* Conditional Custom Input */}
                        {formData.modelName !== "auto" && formData.modelName !== "تلقائي" && !["gemini-2.0-flash-exp", "gemini-1.5-flash", "gemini-1.5-pro"].includes(formData.modelName) && (
                            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <input 
                                    value={formData.modelName === "custom" ? "" : formData.modelName} 
                                    onChange={e => setFormData(prev => ({ ...prev, modelName: e.target.value }))} 
                                    className="w-full bg-slate-900/50 border border-dashed border-slate-700 rounded-xl p-3 text-blue-400 font-mono text-xs focus:border-blue-500 outline-none" 
                                    placeholder="أدخل اسم الموديل يدوياً هنا..." 
                                />
                            </div>
                        )}

                        <p className="text-[10px] text-slate-600 mt-4 px-2 italic leading-relaxed">
                            * وضع <span className="text-blue-500 font-black">التلقائي</span> يقوم باختيار الموديل الأمثل وتغييره لحظياً في حالة الضغط أو انتهاء الكوتا لضمان عدم توقف الخدمة.
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
    );
}
