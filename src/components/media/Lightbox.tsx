"use client";

import { useCallback, useEffect, useRef, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { Button, FadeImage, OVERLAY_TRANSITION, buttonVariants } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";
import { usePresence } from "@/hooks/usePresence";
import { cn } from "@/lib/utils";

export interface GalleryItem {
    url: string;
    type: "image" | "video";
}

interface LightboxProps {
    /** Keep the component rendered and toggle this, so it can animate out */
    open: boolean;
    items: GalleryItem[];
    index: number;
    title?: string;
    onIndexChange: (index: number) => void;
    onClose: () => void;
}

const stop = (e: MouseEvent) => e.stopPropagation();

/**
 * Full-screen viewer for a set of images (and videos). Fades and settles in, cross-fades between
 * items, and fades out. Escape or a click outside the media closes it; arrow keys step through.
 */
export default function Lightbox({ open, items, index, title, onIndexChange, onClose }: LightboxProps) {
    const t = useCopy();
    const { mounted, state } = usePresence(open);
    const closeRef = useRef<HTMLButtonElement>(null);
    const count = items.length;
    const item = items[index];
    const hasMultiple = count > 1;

    const prev = useCallback(() => onIndexChange((index - 1 + count) % count), [index, count, onIndexChange]);
    const next = useCallback(() => onIndexChange((index + 1) % count), [index, count, onIndexChange]);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            else if (hasMultiple && e.key === "ArrowLeft") prev();
            else if (hasMultiple && e.key === "ArrowRight") next();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, hasMultiple, prev, next, onClose]);

    // Lock the page scroll while open and hand focus back to the thumbnail afterwards
    useEffect(() => {
        if (!open) return undefined;
        const trigger = document.activeElement as HTMLElement | null;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();
        return () => {
            document.body.style.overflow = overflow;
            trigger?.focus();
        };
    }, [open]);

    if (!mounted || !item) return null;

    const stepButton = (direction: "prev" | "next", className?: string) => (
        <Button
            variant="ghost"
            size="icon"
            aria-label={direction === "prev" ? "Previous" : "Next"}
            onClick={(e) => {
                e.stopPropagation();
                if (direction === "prev") prev();
                else next();
            }}
            className={className}
        >
            {direction === "prev" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
        </Button>
    );

    // Rendered on <body> so it sits above the sticky navbar
    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={title || "Image viewer"}
            data-state={state}
            className={cn("fixed inset-0 z-60 flex flex-col bg-overlay", OVERLAY_TRANSITION, "data-[state=closed]:opacity-0")}
            onClick={onClose}
        >
            <div className="flex h-14 shrink-0 items-center gap-1 px-2 sm:px-4">
                <p className="min-w-0 flex-1 truncate px-2 text-sm text-muted">
                    {hasMultiple && (
                        <span className="mr-3 tabular-nums text-subtle">
                            {index + 1} / {count}
                        </span>
                    )}
                    {title}
                </p>
                <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={stop}
                    aria-label={t("blog.viewerOpenOriginal")}
                    title={t("blog.viewerOpenOriginal")}
                    className={buttonVariants({ variant: "ghost", size: "icon" })}
                >
                    <ExternalLink />
                </a>
                <Button ref={closeRef} variant="ghost" size="icon" onClick={onClose} aria-label="Close">
                    <X className="size-5" />
                </Button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16">
                {/* Keyed by URL: every item (first one or the next one) settles in with a gentle zoom */}
                <div
                    key={item.url}
                    data-state={state}
                    className={cn(
                        "flex max-h-full max-w-full animate-zoom-in items-center justify-center",
                        OVERLAY_TRANSITION,
                        "data-[state=closed]:scale-[0.97]"
                    )}
                >
                    {item.type === "video" ? (
                        <video
                            src={item.url}
                            controls
                            autoPlay
                            playsInline
                            onClick={stop}
                            className="max-h-[calc(100dvh-9rem)] max-w-full rounded-card"
                        />
                    ) : (
                        <FadeImage
                            src={item.url}
                            alt={title || "Image"}
                            width={1920}
                            height={1080}
                            unoptimized
                            onClick={stop}
                            className="h-auto max-h-[calc(100dvh-9rem)] w-auto max-w-full rounded-card object-contain"
                        />
                    )}
                </div>

                {/* Wide screens: arrows in the side gutters */}
                {hasMultiple && (
                    <>
                        {stepButton("prev", "absolute left-3 top-1/2 hidden -translate-y-1/2 sm:inline-flex")}
                        {stepButton("next", "absolute right-3 top-1/2 hidden -translate-y-1/2 sm:inline-flex")}
                    </>
                )}
            </div>

            {/* Phones: arrows below the media, within thumb reach */}
            {hasMultiple && (
                <div className="flex h-14 shrink-0 items-center justify-center gap-4 sm:hidden">
                    {stepButton("prev")}
                    {stepButton("next")}
                </div>
            )}
        </div>,
        document.body
    );
}
