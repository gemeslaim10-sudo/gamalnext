"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { FadeImage, OVERLAY_TRANSITION, buttonVariants } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";
import { usePresence } from "@/hooks/usePresence";
import { cn } from "@/lib/utils";

export interface GalleryItem {
    url: string;
    type: "image" | "video";
}

/** One set of media with its title, e.g. one project's images. */
export interface LightboxGroup {
    title: string;
    items: GalleryItem[];
    /** The set's own page (e.g. the project): the title links there */
    href?: string;
}

/** Which set is showing, and which item of it. */
export interface LightboxPosition {
    group: number;
    index: number;
}

interface LightboxProps {
    /** Keep the component rendered and toggle this, so it can animate out */
    open: boolean;
    /**
     * One set of media, or several in a row (e.g. every project): after the last item of a set the
     * viewer goes straight on to the first item of the next one, and back the same way.
     */
    groups: LightboxGroup[];
    position: LightboxPosition;
    onPositionChange: (position: LightboxPosition) => void;
    onClose: () => void;
}

/**
 * The next (+1) or previous (−1) item: inside the set, else the first (or last) item of the
 * next (or previous) set that has any — all the way around.
 */
export function stepPosition(groups: LightboxGroup[], position: LightboxPosition, direction: 1 | -1): LightboxPosition {
    const { group, index } = position;
    const inside = index + direction;
    if (inside >= 0 && inside < (groups[group]?.items.length ?? 0)) return { group, index: inside };
    for (let step = 1; step <= groups.length; step++) {
        const target = (((group + direction * step) % groups.length) + groups.length) % groups.length;
        const count = groups[target].items.length;
        if (count > 0) return { group: target, index: direction > 0 ? 0 : count - 1 };
    }
    return position;
}

// A swipe moves on when it's long enough, or when it's a quick flick
const SWIPE_DISTANCE = 64;
const FLICK_DISTANCE = 24;
const FLICK_SPEED = 0.35; // px per ms

const stop = (e: MouseEvent) => e.stopPropagation();

/**
 * Full-screen viewer for images (and videos). Fades and settles in, slides between items, and fades
 * out. Escape or a tap outside the media closes it; arrow keys, the arrow buttons and (on touch
 * screens) swiping left or right step through — across sets when there are several.
 */
export default function Lightbox({ open, groups, position, onPositionChange, onClose }: LightboxProps) {
    const t = useCopy();
    const pathname = usePathname();
    const { mounted, state } = usePresence(open);
    const closeRef = useRef<HTMLButtonElement>(null);
    const group = groups[position.group];
    const item = group?.items[position.index];
    const hasMultiple = groups.reduce((sum, entry) => sum + entry.items.length, 0) > 1;
    const itemKey = `${position.group}:${position.index}`;

    // The item the viewer last stepped to, and from which side, so it slides in from there.
    // Forgotten each time the viewer opens, so the first item always settles in with a zoom.
    const [moved, setMoved] = useState<{ key: string; direction: 1 | -1 } | null>(null);
    const [wasOpen, setWasOpen] = useState(open);
    if (open !== wasOpen) {
        setWasOpen(open);
        if (open) setMoved(null);
    }

    const go = useCallback(
        (direction: 1 | -1) => {
            const target = stepPosition(groups, position, direction);
            setMoved({ key: `${target.group}:${target.index}`, direction });
            onPositionChange(target);
        },
        [groups, position, onPositionChange]
    );
    const prev = useCallback(() => go(-1), [go]);
    const next = useCallback(() => go(1), [go]);

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

    // The images on either side load in the background, so stepping to them is instant
    useEffect(() => {
        if (!open || !hasMultiple) return;
        for (const direction of [1, -1] as const) {
            const target = stepPosition(groups, position, direction);
            const neighbour = groups[target.group]?.items[target.index];
            if (neighbour?.type === "image") {
                const image = new window.Image();
                image.src = neighbour.url;
            }
        }
    }, [open, hasMultiple, groups, position]);

    // ── Swiping (touch and pen; mouse users have the arrows and the keyboard) ──
    const [dragX, setDragX] = useState(0);
    const drag = useRef<{ id: number; x: number; y: number; time: number; axis: "x" | "y" | null } | null>(null);
    const touching = useRef(new Set<number>());
    const lastSwipe = useRef(-Infinity);

    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === "mouse") return;
        touching.current.add(e.pointerId);
        // A second finger means pinch-zoom, and dragging a video's own controls (seeking) isn't a swipe
        if (!hasMultiple || touching.current.size > 1 || (e.target as HTMLElement).closest("video")) {
            drag.current = null;
            setDragX(0);
            return;
        }
        drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, time: e.timeStamp, axis: null };
    };

    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const current = drag.current;
        if (!current || current.id !== e.pointerId) return;
        const dx = e.clientX - current.x;
        if (!current.axis) {
            // Decide once the finger has moved a little: sideways is a swipe, anything else isn't
            if (Math.hypot(dx, e.clientY - current.y) < 10) return;
            current.axis = Math.abs(dx) > Math.abs(e.clientY - current.y) ? "x" : "y";
            if (current.axis === "x") {
                try {
                    // Keeps the swipe going even when the finger leaves the media
                    e.currentTarget.setPointerCapture(e.pointerId);
                } catch {
                    // The pointer is already gone; the swipe still works without it
                }
            }
        }
        if (current.axis === "x") setDragX(dx);
    };

    const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
        touching.current.delete(e.pointerId);
        const current = drag.current;
        if (!current || current.id !== e.pointerId) return;
        drag.current = null;
        setDragX(0);
        if (current.axis !== "x" || e.type === "pointercancel") return;
        lastSwipe.current = e.timeStamp;
        const dx = e.clientX - current.x;
        const speed = Math.abs(dx) / Math.max(1, e.timeStamp - current.time);
        if (Math.abs(dx) >= SWIPE_DISTANCE || (Math.abs(dx) >= FLICK_DISTANCE && speed >= FLICK_SPEED)) {
            if (dx < 0) next();
            else prev();
        }
    };

    if (!mounted || !group || !item) return null;

    const count = group.items.length;
    const slide = moved?.key === itemKey ? moved.direction : 0;
    // On the project's own page its title isn't a link; elsewhere (other projects, the feed) it is
    const titleHref = group.href && group.href !== pathname ? group.href : null;

    const stepButton = (direction: "prev" | "next", className?: string) => (
        <button
            type="button"
            aria-label={direction === "prev" ? "Previous" : "Next"}
            onClick={(e) => {
                e.stopPropagation();
                if (direction === "prev") prev();
                else next();
            }}
            className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "size-12 rounded-full shadow-popover", className)}
        >
            {direction === "prev" ? <ChevronLeft className="size-6" /> : <ChevronRight className="size-6" />}
        </button>
    );

    // Rendered on <body> so it sits above the sticky navbar
    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={group.title || "Image viewer"}
            data-state={state}
            className={cn(
                // Nearly opaque, so only the media and the controls stand out (not the page behind)
                "fixed inset-0 z-60 flex flex-col bg-background/95 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]",
                OVERLAY_TRANSITION,
                "data-[state=closed]:opacity-0"
            )}
            onClick={(e) => {
                // The lift of the finger that ends a swipe isn't a tap on the backdrop
                if (e.timeStamp - lastSwipe.current < 500) return;
                onClose();
            }}
        >
            {/* Title and position on the left; open-original and a large, always-visible close button on the right */}
            <div className="flex h-16 shrink-0 items-center gap-2 px-3 sm:px-5">
                <div className="min-w-0 flex-1 px-1">
                    {titleHref ? (
                        <Link
                            href={titleHref}
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="block truncate text-sm font-medium text-foreground underline-offset-4 hover:underline"
                        >
                            {group.title}
                        </Link>
                    ) : (
                        <p className="truncate text-sm font-medium text-foreground">{group.title}</p>
                    )}
                    {count > 1 && (
                        <p className="hidden text-xs tabular-nums text-subtle sm:block">
                            {position.index + 1} / {count}
                        </p>
                    )}
                </div>
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
                <button
                    ref={closeRef}
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    aria-label="Close"
                    className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "size-11 rounded-full")}
                >
                    <X className="size-5" />
                </button>
            </div>

            <div
                className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-3 sm:px-20 sm:pb-6"
                // Sideways drags are ours (swipes); vertical panning and pinch-zoom stay with the browser
                style={{ touchAction: "pan-y pinch-zoom" }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerEnd}
                onPointerCancel={onPointerEnd}
            >
                {/* Keyed by position: every item settles in (zoom on open, a slide from the side when stepping) */}
                <div
                    key={itemKey}
                    data-state={state}
                    className={cn(
                        "flex max-h-full max-w-full items-center justify-center",
                        slide === 1 ? "animate-slide-in-next" : slide === -1 ? "animate-slide-in-prev" : "animate-zoom-in",
                        OVERLAY_TRANSITION,
                        "data-[state=closed]:scale-[0.97]"
                    )}
                >
                    {/* Follows the finger while swiping, and eases back if the swipe was too short */}
                    <div
                        style={dragX ? { transform: `translateX(${dragX}px)`, opacity: Math.max(0.6, 1 - Math.abs(dragX) / 600) } : undefined}
                        className={cn(
                            "flex max-h-full max-w-full items-center justify-center",
                            !dragX && "transition-[transform,opacity] duration-(--motion-base) ease-out"
                        )}
                    >
                        {item.type === "video" ? (
                            <video
                                src={item.url}
                                controls
                                autoPlay
                                playsInline
                                onClick={stop}
                                className="max-h-[calc(100dvh-11rem)] max-w-full rounded-card sm:max-h-[calc(100dvh-7.5rem)]"
                            />
                        ) : (
                            <FadeImage
                                src={item.url}
                                alt={group.title || "Image"}
                                width={1920}
                                height={1080}
                                unoptimized
                                draggable={false}
                                onClick={stop}
                                className="h-auto max-h-[calc(100dvh-11rem)] w-auto max-w-full select-none rounded-card object-contain sm:max-h-[calc(100dvh-7.5rem)]"
                            />
                        )}
                    </div>
                </div>

                {/* Wide screens: arrows in the side gutters */}
                {hasMultiple && (
                    <>
                        {stepButton("prev", "absolute left-4 top-1/2 hidden -translate-y-1/2 sm:inline-flex")}
                        {stepButton("next", "absolute right-4 top-1/2 hidden -translate-y-1/2 sm:inline-flex")}
                    </>
                )}
            </div>

            {/* Phones: arrows and the position under the media, within thumb reach (a near miss doesn't close) */}
            {hasMultiple && (
                <div className="flex h-20 shrink-0 items-center justify-center gap-8 sm:hidden" onClick={stop}>
                    {stepButton("prev")}
                    <span className="min-w-14 text-center text-sm tabular-nums text-muted">{count > 1 ? `${position.index + 1} / ${count}` : ""}</span>
                    {stepButton("next")}
                </div>
            )}
        </div>,
        document.body
    );
}
