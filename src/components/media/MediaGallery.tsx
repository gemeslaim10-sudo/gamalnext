"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { FadeImage } from "@/components/ui";
import Lightbox, { type GalleryItem, type LightboxGroup, type LightboxPosition } from "./Lightbox";

interface MediaGalleryProps {
    items: GalleryItem[];
    /** Used for alt text and as the viewer title */
    title: string;
    /** `sizes` of the large first image */
    sizes?: string;
    /** Preload the first image (use for the main image of a page) */
    preload?: boolean;
    /**
     * Sets the viewer can go on to after this one (e.g. every project, with this page's project at
     * `current`), so visitors can keep browsing without closing it. Without it, the viewer loops
     * through `items`.
     */
    sequence?: { groups: LightboxGroup[]; current: number };
}

/**
 * Shows the first item large and the rest as a grid of thumbnails.
 * Clicking an image or thumbnail opens the full-screen viewer.
 * Used by the project page and the article page.
 */
export default function MediaGallery({ items, title, sizes = "100vw", preload, sequence }: MediaGalleryProps) {
    const groups = useMemo(() => sequence?.groups ?? [{ title, items }], [sequence, title, items]);
    const current = sequence ? sequence.current : 0;
    // The viewer stays rendered and is toggled with `viewerOpen`, so it can animate out
    const [viewerOpen, setViewerOpen] = useState(false);
    const [position, setPosition] = useState<LightboxPosition>({ group: current, index: 0 });
    const openViewer = (index: number) => {
        setPosition({ group: current, index });
        setViewerOpen(true);
    };

    if (items.length === 0) return null;

    const [first, ...rest] = items;
    const label = (item: GalleryItem, index: number) =>
        `${item.type === "video" ? "Play video" : "View image"} ${index + 1} of ${items.length}`;

    return (
        <div className="space-y-2 sm:space-y-3">
            {first.type === "video" ? (
                <video
                    src={first.url}
                    controls
                    playsInline
                    preload="metadata"
                    className="aspect-[16/10] w-full rounded-card border border-border bg-surface-hover"
                />
            ) : (
                <Tile label={label(first, 0)} onClick={() => openViewer(0)}>
                    {preload ? (
                        <Image src={first.url} alt={title} fill sizes={sizes} preload className="object-cover object-top" />
                    ) : (
                        <FadeImage src={first.url} alt={title} fill sizes={sizes} className="object-cover object-top" />
                    )}
                </Tile>
            )}

            {rest.length > 0 && (
                <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
                    {rest.map((item, i) => (
                        <li key={`${item.url}-${i}`}>
                            <Tile label={label(item, i + 1)} onClick={() => openViewer(i + 1)}>
                                {item.type === "video" ? (
                                    <>
                                        <video src={item.url} muted playsInline preload="metadata" className="size-full object-cover" />
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <span className="flex size-8 items-center justify-center rounded-full bg-overlay text-foreground">
                                                <Play aria-hidden className="size-4" />
                                            </span>
                                        </span>
                                    </>
                                ) : (
                                    <FadeImage
                                        src={item.url}
                                        alt={`${title} ${i + 2}`}
                                        fill
                                        sizes="(min-width: 1024px) 180px, (min-width: 640px) 25vw, 33vw"
                                        className="object-cover object-top"
                                    />
                                )}
                            </Tile>
                        </li>
                    ))}
                </ul>
            )}

            <Lightbox
                open={viewerOpen}
                groups={groups}
                position={position}
                onPositionChange={setPosition}
                onClose={() => setViewerOpen(false)}
            />
        </div>
    );
}

function Tile({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-card border border-border bg-surface-hover transition duration-(--motion-base) ease-out hover:border-border-strong active:scale-[0.99]"
        >
            {children}
        </button>
    );
}
