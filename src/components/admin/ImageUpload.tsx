"use client";

import { useState } from "react";
import { Image, Upload } from "lucide-react";
import { openCloudinaryWidget } from "@/lib/cloudinary";

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export function ImageUpload({ value, onChange, label = "Upload Image" }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);

    const handleUpload = () => {
        setLoading(true);
        // Open widget
        // @ts-ignore
        if (typeof window !== "undefined" && window.cloudinary) {
            openCloudinaryWidget((url) => {
                onChange(url);
                setLoading(false);
            });
        } else {
            // Fallback or alert if easy setup is missing
            const url = prompt("Cloudinary script not loaded or configured. Enter Image URL manually:", value);
            if (url) onChange(url);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">{label}</label>

            <div className="flex items-center gap-4">
                {value && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
                >
                    <Upload className="w-4 h-4" />
                    {loading ? "Uploading..." : value ? "Change Image" : "Upload Image"}
                </button>
            </div>
        </div>
    );
}
