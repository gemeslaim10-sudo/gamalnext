import { X, Save } from "lucide-react";
import { MediaUpload } from "@/components/admin/MediaUpload";
import type { MediaItem } from "../types";

interface ArticleFormProps {
    currentId: string | null;
    formData: {
        title: string;
        slug: string;
        summary: string;
        content: string;
        media: MediaItem[];
    };
    setFormData: React.Dispatch<React.SetStateAction<{
        title: string;
        slug: string;
        summary: string;
        content: string;
        media: MediaItem[];
    }>>;
    generateSlug: (title: string) => string;
    resetForm: () => void;
    handleSubmit: (e: React.FormEvent) => void;
}

export function ArticleForm({
    currentId,
    formData,
    setFormData,
    generateSlug,
    resetForm,
    handleSubmit
}: ArticleFormProps) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 shadow-2xl animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold text-blue-400">{currentId ? "Edit Article" : "Create New Article"}</h2>
                <button onClick={resetForm} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Title</label>
                        <input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Slug (Auto-generated if empty)</label>
                        <input
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder={formData.title ? generateSlug(formData.title) : ""}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-2">Summary (SEO Description)</label>
                    <textarea
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                        required
                    />
                </div>

                {/* Media Upload */}
                <MediaUpload
                    items={formData.media}
                    onChange={(media) => setFormData({ ...formData, media })}
                />

                <div>
                    <label className="block text-sm text-slate-400 mb-2">Content (Supports Markdown/HTML)</label>
                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-64 font-mono leading-relaxed"
                        placeholder="Write your article content here..."
                        required
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button type="button" onClick={resetForm} className="px-6 py-2 text-slate-400 hover:text-white font-bold">Cancel</button>
                    <button type="submit" className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center gap-2">
                        <Save className="w-5 h-5" /> Save Article
                    </button>
                </div>
            </form>
        </div>
    );
}
