"use client";

import { useState } from "react";
import { Video, Upload, X } from "lucide-react";
import { openCloudinaryWidget } from "@/lib/cloudinary";
import toast from "react-hot-toast";
import { Badge, Button } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";

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
    const t = useCopy();

    const handleUpload = () => {
        setLoading(true);
        openCloudinaryWidget(
            (url) => {
                const singleUrl = Array.isArray(url) ? url[0] : url;
                if (!singleUrl) return;
                const isVideo = singleUrl.match(/\.(mp4|webm|ogg|mov)$/i) || singleUrl.includes("/video/upload/");
                const newItem: MediaItem = {
                    url: singleUrl,
                    type: isVideo ? 'video' : 'image'
                };
                onChange([...items, newItem]);
                setLoading(false);
            },
            (error) => {
                console.error("Media upload window failed:", error);
                toast.error(t("blog.mediaOpenFailed"));
                setLoading(false);
            }
        );
    };

    const handleRemove = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        onChange(newItems);
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{t("blog.mediaTitle")}</span>
                <Button variant="secondary" size="sm" onClick={handleUpload} disabled={loading}>
                    <Upload />
                    {loading ? t("blog.mediaUploading") : t("blog.mediaAdd")}
                </Button>
            </div>

            {items.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {items.map((item, index) => (
                        <div key={index} className="relative aspect-square overflow-hidden rounded-control border border-border bg-surface-hover">
                            {item.type === 'video' ? (
                                <div className="flex size-full items-center justify-center">
                                    <video src={item.url} className="absolute inset-0 size-full object-contain opacity-50" muted />
                                    <Video aria-hidden className="relative size-6 text-muted" />
                                </div>
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={item.url}
                                    alt=""
                                    className="size-full object-contain"
                                    referrerPolicy="no-referrer"
                                />
                            )}

                            <Badge className="absolute bottom-2 left-2">{item.type === "video" ? t("blog.mediaVideo") : t("blog.mediaImage")}</Badge>

                            <Button
                                variant="secondary"
                                size="icon-sm"
                                onClick={() => handleRemove(index)}
                                aria-label={t("blog.mediaRemove")}
                                title={t("blog.mediaRemove")}
                                className="absolute right-2 top-2 hover:text-danger"
                            >
                                <X />
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full rounded-card border border-dashed border-border-strong bg-surface px-4 py-8 text-center text-sm text-muted transition-colors hover:bg-surface-hover disabled:opacity-50"
                >
                    {t("blog.mediaEmpty")}
                </button>
            )}
        </div>
    );
}
