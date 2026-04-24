import { Loader2, RefreshCcw, Wand2 } from "lucide-react";
import { toast } from "react-hot-toast";
import type { WriteFormData } from "../types";

interface ImageHelperProps {
    formData: WriteFormData;
    setFormData: React.Dispatch<React.SetStateAction<WriteFormData>>;
    regeneratingImage: boolean;
    imageQuery: string;
    handleAiImageRegenerate: () => void;
}

export function ImageHelper({
    formData,
    setFormData,
    regeneratingImage,
    imageQuery,
    handleAiImageRegenerate
}: ImageHelperProps) {
    return (
        <>
            {/* Auto-Image Controls */}
            {formData.media.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-2 mb-4">
                    {/* Only show Shuffle for LoremFlickr/Pollinations (Client-side URL tweak) */}
                    {(formData.media[0].url.includes('loremflickr') || formData.media[0].url.includes('pollinations')) && (
                        <button
                            type="button"
                            onClick={() => {
                                const currentUrl = formData.media[0].url;
                                let newUrl = currentUrl;
                                if (currentUrl.includes('seed=')) {
                                    newUrl = currentUrl.replace(/seed=\d+/, `seed=${Math.floor(Math.random() * 1000000)}`);
                                } else if (currentUrl.includes('random=')) {
                                    newUrl = currentUrl.replace(/random=\d+/, `random=${Date.now()}`);
                                } else {
                                    const separator = currentUrl.includes('?') ? '&' : '?';
                                    newUrl = `${currentUrl}${separator}seed=${Math.floor(Math.random() * 1000000)}`;
                                }
                                setFormData(prev => ({ ...prev, media: [{ url: newUrl, type: 'image' }] }));
                                toast.success("تم تغيير الصورة 🎲");
                            }}
                            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            تغيير عشوائي
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleAiImageRegenerate}
                        disabled={regeneratingImage}
                        className="flex items-center gap-2 text-white hover:text-white transition-all text-sm bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg shadow-lg shadow-blue-600/20 font-bold"
                    >
                        {regeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                        تغيير الصورة بذكاء (AI)
                    </button>
                </div>
            )}

            {/* Manual Image Search Helper */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <label className="block text-slate-300 font-bold mb-2 text-sm">إضافة صورة (بحث يدوي)</label>
                <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="رابط الصورة الخارجية (التي اخترتها)..."
                            className="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm"
                            value={formData.media[0]?.url || ""}
                            onChange={(e) => {
                                const url = e.target.value;
                                if (!url) {
                                    setFormData({ ...formData, media: [] });
                                } else {
                                    setFormData({ ...formData, media: [{ url, type: 'image' }] });
                                }
                            }}
                        />
                    </div>

                    {imageQuery && (
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-slate-400 text-xs">بحث مقترح: {imageQuery}</span>
                            <button
                                type="button"
                                onClick={() => window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(imageQuery)}`, '_blank')}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs flex items-center gap-1"
                            >
                                بحث في Google
                            </button>
                            <button
                                type="button"
                                onClick={() => window.open(`https://unsplash.com/s/photos/${encodeURIComponent(imageQuery)}`, '_blank')}
                                className="px-3 py-1 bg-gray-100 hover:bg-white text-black rounded text-xs flex items-center gap-1 font-bold"
                            >
                                بحث في Unsplash
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
