"use client";

import { useState } from "react";
import { Image, Video, Upload, X } from "lucide-react";
import { openCloudinaryWidget } from "@/lib/cloudinary";

interface MediaItem {
    url: string;
    type: 'image' | 'video';
}

interface MediaUploadProps {
    items: MediaItem[];
    onChange: (items: MediaItem[]) => void;
}

export function MediaUpload({ items, onChange }: MediaUploadProps) {
    const [loading, setLoading] = useState(false);

    const handleUpload = () => {
        setLoading(true);
        // @ts-ignore
        if (typeof window !== "undefined" && window.cloudinary) {
            openCloudinaryWidget((url) => {
                // Simple heuristic to determine type based on extension or cloud response
                // For now, assuming standard image extensions, else video. 
                // A better way is if the widget returns resource_type.
                // Since our current simplified wrapper might just return URL, we'll try to guess.
                // Ideally, check the URL extension.
                const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes("/video/upload/");
                const newItem: MediaItem = {
                    url,
                    type: isVideo ? 'video' : 'image'
                };
                onChange([...items, newItem]);
                setLoading(false);
            });
        } else {
            // Fallback
            const url = prompt("Enter Media URL:");
            if (url) {
                const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i);
                onChange([...items, { url, type: isVideo ? 'video' : 'image' }]);
            }
            setLoading(false);
        }
    };

    const handleRemove = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        onChange(newItems);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-400">Media Gallery (Images & Videos)</label>
                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-bold"
                >
                    <Upload className="w-4 h-4" />
                    {loading ? "Uploading..." : "Add Media"}
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map((item, index) => (
                    <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-700 bg-slate-900 aspect-square">
                        <button
                            onClick={() => handleRemove(index)}
                            className="absolute top-2 right-2 bg-red-500/80 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {item.type === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                <Video className="w-8 h-8 text-slate-500" />
                                <video src={item.url} className="absolute inset-0 w-full h-full object-cover opacity-50" muted />
                            </div>
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.url} alt="Media" className="w-full h-full object-cover" />
                        )}

                        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white capitalize">
                            {item.type}
                        </div>
                    </div>
                ))}
            </div>
            {items.length === 0 && (
                <div className="border border-dashed border-slate-700 rounded-xl p-8 text-center text-slate-500">
                    No media added yet. Supports Images & Videos.
                </div>
            )}
        </div>
    );
}
