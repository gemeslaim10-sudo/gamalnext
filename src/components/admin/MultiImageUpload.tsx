"use client";

import { Plus, X, ClipboardPaste } from "lucide-react";
import { useMultiImageUpload } from "./hooks/useMultiImageUpload";

interface MultiImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    label?: string;
}

export function MultiImageUpload({ value = [], onChange, label = "معرض الصور (Gallery)" }: MultiImageUploadProps) {
    const {
        loading,
        containerRef,
        handleUpload,
        handlePaste,
        handleSmartPaste,
        removeImage
    } = useMultiImageUpload(value, onChange);

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
