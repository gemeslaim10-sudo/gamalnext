"use client";

import { useState, useCallback, useRef } from "react";
import { openCloudinaryWidget, cloudinaryConfig } from "@/lib/cloudinary";
import { Plus, X, ClipboardPaste } from "lucide-react";
import toast from "react-hot-toast";

interface MultiImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    label?: string;
}

export function MultiImageUpload({ value = [], onChange, label = "معرض الصور (Gallery)" }: MultiImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const uploadFile = useCallback(async (file: File) => {
        if (!cloudinaryConfig.cloudName) {
            toast.error("Cloudinary is not configured correctly");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Uploading image to gallery...");
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", cloudinaryConfig.uploadPreset || "ml_default");

            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            onChange([...value, data.secure_url]);
            toast.success("Uploaded successfully!", { id: toastId });
        } catch (err) {
            toast.error("Upload failed", { id: toastId });
        } finally {
            setLoading(false);
        }
    }, [onChange, value]);

    const handleUpload = () => {
        setLoading(true);
        openCloudinaryWidget(
            (urls) => {
                const newUrls = Array.isArray(urls) ? urls : [urls];
                onChange([...value, ...newUrls]);
                setLoading(false);
            },
            (error) => {
                toast.error(error.message || "فشل فتح نافذة الرفع");
                setLoading(false);
            },
            { multiple: true }
        );
    };

    const handlePaste = useCallback(async (e: React.ClipboardEvent | ClipboardEvent) => {
        const clipboardData = (e as ClipboardEvent).clipboardData || (e as React.ClipboardEvent).clipboardData;
        if (!clipboardData) return;

        const items = clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    e.preventDefault();
                    await uploadFile(file);
                    return;
                }
            }
        }

        const text = clipboardData.getData("text/plain")?.trim();
        if (text && /^https?:\/\/.+\.(png|jpe?g|gif|svg|webp|avif|bmp|ico|tiff?|jfif)/i.test(text)) {
            e.preventDefault();
            onChange([...value, text]);
            toast.success("Image URL pasted!");
            return;
        }

        if (text && /^https?:\/\//.test(text)) {
            e.preventDefault();
            onChange([...value, text]);
            toast.success("URL pasted!");
            return;
        }
    }, [uploadFile, onChange, value]);

    const handleSmartPaste = useCallback(async () => {
        try {
            if (navigator.clipboard && typeof navigator.clipboard.read === 'function') {
                try {
                    const clipboardItems = await navigator.clipboard.read();
                    for (const item of clipboardItems) {
                        const imageType = item.types.find(t => t.startsWith('image/'));
                        if (imageType) {
                            const blob = await item.getType(imageType);
                            const file = new File([blob], `paste-${Date.now()}.${imageType.split('/')[1]}`, { type: imageType });
                            await uploadFile(file);
                            return;
                        }
                    }
                } catch {}
            }

            const text = await navigator.clipboard.readText();
            if (!text?.trim()) {
                toast.error("Clipboard is empty");
                return;
            }

            const trimmed = text.trim();
            if (/^https?:\/\//.test(trimmed) || /^data:image\//.test(trimmed)) {
                onChange([...value, trimmed]);
                toast.success("URL pasted!");
            } else {
                toast.error("No image or URL found in clipboard");
            }
        } catch (err) {
            toast.error("Cannot access clipboard. Try Ctrl+V instead.");
        }
    }, [uploadFile, onChange, value]);

    const removeImage = (indexToRemove: number) => {
        onChange(value.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div 
            ref={containerRef}
            className="space-y-3 outline-none focus-within:ring-1 focus-within:ring-slate-800 rounded-xl p-1"
            onPaste={handlePaste as unknown as React.ClipboardEventHandler}
            tabIndex={0}
        >
            <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
                <span className="text-[10px] text-slate-500">{value.length} صور</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={loading}
                    className="h-24 rounded-xl border-2 border-dashed border-slate-700 hover:border-blue-500 hover:bg-blue-500/10 flex flex-col items-center justify-center gap-2 transition-all group disabled:opacity-50"
                >
                    <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-blue-500 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors">
                        <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-400">
                        {loading ? "جاري الرفع..." : "إضافة صور"}
                    </span>
                </button>
                
                <button
                    type="button"
                    onClick={handleSmartPaste}
                    disabled={loading}
                    className="h-24 rounded-xl border-2 border-dashed border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/10 flex flex-col items-center justify-center gap-2 transition-all group disabled:opacity-50"
                    title="Paste from clipboard"
                >
                    <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-emerald-500 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors">
                        <ClipboardPaste className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-400">
                        {loading ? "..." : "لصق (Paste)"}
                    </span>
                </button>

                {value.map((url, index) => (
                    <div key={index} className="relative group h-24 rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
                        
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition-colors transform hover:scale-110"
                                title="حذف الصورة"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <p className="text-[10px] text-slate-500 italic px-1">
                اضغط هنا ثم اضغط Ctrl+V، أو استخدم زر اللصق لرفع الصور مباشرة من الحافظة (الـ Clipboard).
            </p>
        </div>
    );
}
