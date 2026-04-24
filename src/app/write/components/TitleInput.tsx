import { Loader2, Sparkles } from "lucide-react";
import type { WriteFormData } from "../types";

interface TitleInputProps {
    formData: WriteFormData;
    setFormData: React.Dispatch<React.SetStateAction<WriteFormData>>;
    enhancingTitle: boolean;
    generating: boolean;
    handleEnhanceTitle: () => void;
    handleAiGenerate: () => void;
}

export function TitleInput({
    formData,
    setFormData,
    enhancingTitle,
    generating,
    handleEnhanceTitle,
    handleAiGenerate
}: TitleInputProps) {
    return (
        <div>
            <label className="block text-slate-300 font-bold mb-2">عنوان المقال</label>
            <div className="flex flex-col md:flex-row gap-4">
                <input
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full md:flex-grow bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="اختر عنواناً جذاباً..."
                />
                <button
                    type="button"
                    onClick={handleEnhanceTitle}
                    disabled={enhancingTitle || !formData.title}
                    className="bg-slate-800 hover:bg-slate-700 text-blue-400 p-3 rounded-xl transition-all border border-slate-700 disabled:opacity-50"
                    title="تحسين العنوان بالذكاء الاصطناعي"
                >
                    {enhancingTitle ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </button>
                <button
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={generating || !formData.title}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 whitespace-nowrap"
                >
                    {generating ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                    توليد بالذكاء الاصطناعي
                </button>
            </div>
        </div>
    );
}
