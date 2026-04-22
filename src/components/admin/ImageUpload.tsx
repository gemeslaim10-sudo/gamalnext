"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, ClipboardIcon, Image as ImageIcon } from "lucide-react";
import { openCloudinaryWidget, cloudinaryConfig } from "@/lib/cloudinary";
import toast from "react-hot-toast";

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export function ImageUpload({ value, onChange, label = "صورة المشروع" }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const uploadFile = async (file: File) => {
        if (!cloudinaryConfig.cloudName) {
            toast.error("Cloudinary is not configured correctly");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("جاري الرفع...");
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "unsigned_preset");

            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            onChange(data.secure_url);
            toast.success("تم الرفع بنجاح", { id: toastId });
        } catch (err) {
            toast.error("حدث خطأ أثناء الرفع", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = () => {
        setLoading(true);
        openCloudinaryWidget(
            (url) => {
                onChange(url);
                setLoading(false);
            },
            (error) => {
                toast.error(error.message || "فشل فتح نافذة رفع الصور");
                setLoading(false);
            }
        );
    };

    const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    await uploadFile(file);
                    return; // stop after first image
                }
            }
        }
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            await uploadFile(file);
        } else {
            toast.error("الرجاء إسقاط ملف صورة صالح");
        }
    }, []);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

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
        <div 
            className="space-y-3" 
            onPaste={handlePaste}
        >
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>

            <div 
                className={`relative transition-all ${isDragging ? 'scale-[1.02]' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {value ? (
                    <div className={`relative group/img w-full h-40 sm:h-48 rounded-2xl overflow-hidden border-2 ${isDragging ? 'border-blue-500' : 'border-slate-800'} bg-slate-900 shadow-inner`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                            <button type="button" onClick={() => onChange("")} className="bg-red-500/90 hover:bg-red-500 text-white px-4 py-2 text-sm font-bold rounded-xl shadow-lg transition-colors">
                                إزالة الصورة
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={`w-full h-40 sm:h-48 rounded-2xl border-2 border-dashed ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'} flex flex-col items-center justify-center gap-3 transition-colors text-slate-400 group cursor-pointer`} onClick={handleUpload}>
                        <ImageIcon className={`w-10 h-10 ${isDragging ? 'text-blue-500 animate-bounce' : 'group-hover:text-slate-300'}`} />
                        <span className="text-xs font-bold text-center px-4">
                            {isDragging ? 'أفلت الصورة هنا' : 'اضغط للرفع، اسحب الصورة هنا، أو الصق (Ctrl+V)'}
                        </span>
                    </div>
                )}
                
                {isDragging && (
                    <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm border-2 border-blue-500 rounded-2xl z-50 flex items-center justify-center">
                        <span className="text-white font-black text-lg shadow-black drop-shadow-md">أفلت الصورة هنا للرفع</span>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 text-white rounded-xl transition-all disabled:opacity-50 font-bold text-xs"
                >
                    <Upload className="w-4 h-4" />
                    {loading ? "جاري..." : value ? "تغيير" : "تصفح الملفات"}
                </button>
                
                <button
                    type="button"
                    onClick={handlePasteUrl}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700"
                    title="لصق رابط من الحافظة"
                >
                    <ClipboardIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
