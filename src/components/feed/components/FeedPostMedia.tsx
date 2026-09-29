import { Play } from "lucide-react";
import { FadeImage } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { FeedItem } from "../types";

interface FeedPostMediaProps {
    item: FeedItem;
    index: number;
    onOpenLightbox: (images: string[], index: number, title: string) => void;
}

const SIZES = "(max-width: 768px) 100vw, 672px";

export function FeedPostMedia({ item, index, onOpenLightbox }: FeedPostMediaProps) {
    if (item.gallery && item.gallery.length > 1) {
        const count = item.gallery.length;
        const shown = item.gallery.slice(0, 4);

        return (
            <div className="grid grid-cols-2 gap-0.5 border-t border-border bg-border">
                {shown.map((img, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => onOpenLightbox(item.gallery!, idx, item.title)}
                        aria-label={`Open image ${idx + 1} of ${count}`}
                        className={cn(
                            "relative cursor-zoom-in overflow-hidden bg-surface-hover",
                            count === 3 && idx === 0 ? "col-span-2 aspect-[2/1]" : "aspect-square"
                        )}
                    >
                        <FadeImage src={img} alt={item.title} fill sizes={SIZES} className="object-cover" priority={index === 0 && idx === 0} />
                        {count > 4 && idx === 3 && (
                            <span className="absolute inset-0 flex items-center justify-center bg-overlay text-xl font-semibold text-foreground">
                                +{count - 4}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        );
    }

    if (item.imageUrl) {
        const isVideo = item.mediaType === "video" && item.videoUrl;
        return (
            <button
                type="button"
                onClick={() => onOpenLightbox([item.imageUrl!], 0, item.title)}
                aria-label="Open image"
                className="relative block aspect-video w-full cursor-zoom-in overflow-hidden border-t border-border bg-surface-hover"
            >
                <FadeImage src={item.imageUrl} alt={item.title} fill sizes={SIZES} className="object-cover" priority={index === 0} />
                {isVideo && (
                    <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex size-12 items-center justify-center rounded-full bg-overlay text-foreground">
                            <Play className="size-5" />
                        </span>
                    </span>
                )}
            </button>
        );
    }

    return null;
}
