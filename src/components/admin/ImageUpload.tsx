"use client";

import { useState, useCallback, useEffect } from "react";
import { Image, Upload, Link as LinkIcon, ClipboardIcon } from "lucide-react";
import { openCloudinaryWidget } from "@/lib/cloudinary";
import toast from "react-hot-toast";

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export function ImageUpload({ value, onChange, label = "صورة المشروع" }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);

    const handleUpload = () => {
        setLoading(true);
        // @ts-ignore
        if (typeof window !== "undefined" && window.cloudinary) {
            openCloudinaryWidget((url) => {
                onChange(url);
                setLoading(false);
            });
        } else {
            const url = prompt("أدخل رابط الصورة مباشرة:", value);
            if (url) onChange(url);
            setLoading(false);
        }
    };

    const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    setLoading(true);
                    toast.loading("جاري رفع الصورة من الحافظة...", { id: "pasting" });
                    
                    try {
                        // For simplicity since we don't have a direct signed upload endpoint ready, 
                        // we normally use the widget for everything, but for pasting we can use a prompt for now 
                        // OR if you have a Cloudinary upload API key/preset we can use fetch.
                        // For now let's just use the widget's capability or allow pasting URLs.
                    } catch (err) {
                        toast.error("فشل رفع الصورة الملصقة");
                    } finally {
                        setLoading(false);
                        toast.dismiss("pasting");
                    }
                }
            }
        }
    }, []);

    // Also support pasting URLs directly into the window if this component is focused or just provide a dedicated spot
    const handlePasteUrl = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text.startsWith("http")) {
                onChange(text);
                toast.success("تم لصق الرابط بنجاح");
            } else {
                toast.error("الحافظة لا تحتوي على رابط صالح");
            }
        } catch (err) {
            toast.error("فشل الوصول للحافظة");
        }
    };

    return (
        <div className="space-y-3" onPaste={handlePaste}>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>

            <div className="space-y-4">
                {value && (
                    <div className="relative group/img w-full h-48 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => onChange("")} className="bg-red-500 text-white p-2 rounded-full shadow-lg">
                                إزالة الصورة
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-500/10 disabled:opacity-50 font-bold"
                    >
                        <Upload className="w-4 h-4" />
                        {loading ? "جاري الرفع..." : value ? "تغيير الصورة" : "رفع من الجهاز"}
                    </button>
                    
                    <button
                        type="button"
                        onClick={handlePasteUrl}
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700 shadow-xl"
                        title="لصق رابط من الحافظة"
                    >
                        <ClipboardIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <p className="text-[10px] text-slate-600 italic mt-1">
                * يمكنك رفع ملف أو لصق رابط مباشر للصورة من الجهاز.
            </p>
        </div>
    );
}
