import { Save, Loader2 } from "lucide-react";
import { MediaUpload } from "@/components/admin/MediaUpload";

interface EditArticleFormProps {
    formData: {
        title: string;
        content: string;
        summary: string;
        tags: string;
        media: { url: string; type: 'image' | 'video' }[];
    };
    setFormData: (data: React.SetStateAction<{
        title: string;
        content: string;
        summary: string;
        tags: string;
        media: { url: string; type: 'image' | 'video' }[];
    }>) => void;
    saving: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export function EditArticleForm({ formData, setFormData, saving, onSubmit }: EditArticleFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label className="block text-slate-300 font-bold mb-2">عنوان المقال</label>
                <input
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="عنوان المقال..."
                />
            </div>

            <MediaUpload
                items={formData.media}
                onChange={(media) => setFormData({ ...formData, media })}
            />

            <div>
                <label className="block text-slate-300 font-bold mb-2">محتوى المقال</label>
                <textarea
                    required
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-96 font-mono leading-relaxed"
                    placeholder="اكتب محتوى المقال هنا..."
                />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-slate-300 font-bold mb-2">وصف محركات البحث (Meta Description)</label>
                    <textarea
                        value={formData.summary}
                        onChange={e => setFormData({ ...formData, summary: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-32"
                        placeholder="وصف مختصر للمقال يظهر في نتائج البحث..."
                        maxLength={160}
                    />
                    <div className="text-right text-xs text-slate-500 mt-1">
                        {formData.summary.length}/160
                    </div>
                </div>
                <div>
                    <label className="block text-slate-300 font-bold mb-2">الكلمات المفتاحية (Tags)</label>
                    <textarea
                        value={formData.tags}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-32"
                        placeholder="كلمات دلالية مفصولة بفاصلة..."
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
                {saving ? <Loader2 className="animate-spin" /> : <><Save /> حفظ التعديلات</>}
            </button>
        </form>
    );
}
