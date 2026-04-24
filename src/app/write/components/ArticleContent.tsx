import type { WriteFormData } from "../types";

interface ArticleContentProps {
    formData: WriteFormData;
    setFormData: React.Dispatch<React.SetStateAction<WriteFormData>>;
}

export function ArticleContent({ formData, setFormData }: ArticleContentProps) {
    return (
        <>
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
        </>
    );
}
