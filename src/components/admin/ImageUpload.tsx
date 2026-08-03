"use client";

import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, ClipboardPaste } from "lucide-react";
import toast from "react-hot-toast";
import { useImageUpload } from "./hooks/useImageUpload";

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export function ImageUpload({ value, onChange, label = "صورة المشروع" }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { loading, uploadFile, handleUpload, handlePaste, handleSmartPaste } = useImageUpload(onChange);

    return (
        <div 
            ref={containerRef}
            className="space-y-2" 
            onPaste={handlePaste as unknown as React.ClipboardEventHandler}
            tabIndex={0}
        >
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>

            <div 
                className={`relative transition-all ${isDragging ? 'scale-[1.02]' : ''}`}
                onDrop={async (e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith("image/")) {
                        await uploadFile(file);
                    } else {
                        const url = e.dataTransfer.getData("text/plain");
                        if (url && /^https?:\/\//.test(url)) {
                            onChange(url);
                            toast.success("URL dropped!");
                        } else {
                            toast.error("Drop an image file or URL");
                        }
                    }
                }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            >
                {value ? (
                    <div className={`relative group/img w-full h-32 sm:h-40 rounded-xl overflow-hidden border ${isDragging ? 'border-blue-500' : 'border-slate-800'} bg-slate-900`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value} alt="Preview" className="w-full h-full object-contain transition-transform duration-500 group-hover/img:scale-105" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                            <button type="button" onClick={() => onChange("")} className="bg-red-500/90 hover:bg-red-500 text-white px-3 py-1.5 text-xs font-bold rounded-lg transition-colors">
                                Remove
                            </button>
                            <button type="button" onClick={handleUpload} className="bg-slate-700/90 hover:bg-slate-600 text-white px-3 py-1.5 text-xs font-bold rounded-lg transition-colors">
                                Replace
                            </button>
                        </div>
                    </div>
                ) : (
                    <div 
                        className={`w-full h-32 sm:h-40 rounded-xl border-2 border-dashed ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'} flex flex-col items-center justify-center gap-2 transition-colors text-slate-400 group cursor-pointer`} 
                        onClick={handleUpload}
                    >
                        <ImageIcon className={`w-8 h-8 ${isDragging ? 'text-blue-500 animate-bounce' : 'group-hover:text-slate-300'}`} />
                        <span className="text-[10px] font-bold text-center px-3 leading-relaxed">
                            {isDragging ? 'Drop image here' : 'Click to browse, drag & drop, or paste (Ctrl+V)'}
                        </span>
                    </div>
                )}
                
                {isDragging && (
                    <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm border-2 border-blue-500 rounded-xl z-50 flex items-center justify-center">
                        <span className="text-white font-black text-sm drop-shadow-md">Drop to upload</span>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1.5">
                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 text-white rounded-lg transition-all disabled:opacity-50 font-bold text-[11px]"
                >
                    <Upload className="w-3.5 h-3.5" />
                    {loading ? "..." : value ? "Change" : "Browse"}
                </button>
                
                <button
                    type="button"
                    onClick={handleSmartPaste}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700 hover:border-emerald-500/50 disabled:opacity-50 text-[11px] font-bold"
                    title="Paste image or URL from clipboard (Ctrl+V also works)"
                >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    Paste
                </button>
            </div>
        </div>
    );
}
