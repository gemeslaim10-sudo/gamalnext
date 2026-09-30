"use client";

import { useEffect, useRef, useState } from "react";
import { Video, Upload, X } from "lucide-react";
import { openCloudinaryWidget } from "@/lib/cloudinary";
import toast from "react-hot-toast";
import { Badge, Button } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";

interface MediaItem {
    url: string;
    type: 'image' | 'video';
}

/** Texts of the component. The public site takes them from the site copy; the dashboard passes its own. */
export interface MediaUploadLabels {
    title: string;
    add: string;
    /** Shown on the add button while the upload window opens */
    uploading: string;
    empty: string;
    image: string;
    video: string;
    remove: string;
    openFailed: string;
}

interface MediaUploadProps {
    items: MediaItem[];
    onChange: (items: MediaItem[]) => void;
    labels?: Partial<MediaUploadLabels>;
}

export function MediaUpload({ items, onChange, labels }: MediaUploadProps) {
    const [opening, setOpening] = useState(false);
    const t = useCopy();
    // The upload window reports files after this render; appending to the latest list keeps
    // several uploads from one window instead of each replacing the one before
    const latestItems = useRef(items);
    useEffect(() => {
        latestItems.current = items;
    }, [items]);
    const text: MediaUploadLabels = {
        title: labels?.title ?? t("blog.mediaTitle"),
        add: labels?.add ?? t("blog.mediaAdd"),
        uploading: labels?.uploading ?? t("blog.mediaUploading"),
        empty: labels?.empty ?? t("blog.mediaEmpty"),
        image: labels?.image ?? t("blog.mediaImage"),
        video: labels?.video ?? t("blog.mediaVideo"),
        remove: labels?.remove ?? t("blog.mediaRemove"),
        openFailed: labels?.openFailed ?? t("blog.mediaOpenFailed"),
    };

    const handleUpload = async () => {
        setOpening(true);
        // Resolves once the upload window is open (or couldn't open). The window reports each
        // finished upload below; closing it without uploading must not leave the button stuck.
        await openCloudinaryWidget(
            (url) => {
                const singleUrl = Array.isArray(url) ? url[0] : url;
                if (!singleUrl) return;
                const isVideo = singleUrl.match(/\.(mp4|webm|ogg|mov)$/i) || singleUrl.includes("/video/upload/");
                const newItem: MediaItem = {
                    url: singleUrl,
                    type: isVideo ? 'video' : 'image'
                };
                const next = [...latestItems.current, newItem];
                latestItems.current = next;
                onChange(next);
            },
            (error) => {
                console.error("Media upload window failed:", error);
                toast.error(text.openFailed);
            }
        );
        setOpening(false);
    };

    const handleRemove = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        onChange(newItems);
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{text.title}</span>
                <Button variant="secondary" size="sm" onClick={handleUpload} disabled={opening}>
                    <Upload />
                    {opening ? text.uploading : text.add}
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

                            {/* Logical sides, so the badge and the remove button also sit right in the right-to-left dashboard */}
                            <Badge className="absolute bottom-2 start-2">{item.type === "video" ? text.video : text.image}</Badge>

                            <Button
                                variant="secondary"
                                size="icon-sm"
                                onClick={() => handleRemove(index)}
                                aria-label={text.remove}
                                title={text.remove}
                                className="absolute end-2 top-2 hover:text-danger"
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
                    disabled={opening}
                    className="w-full rounded-card border border-dashed border-border-strong bg-surface px-4 py-8 text-center text-sm text-muted transition-colors hover:bg-surface-hover disabled:opacity-50"
                >
                    {text.empty}
                </button>
            )}
        </div>
    );
}
