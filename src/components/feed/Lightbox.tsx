"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface LightboxProps {
    images: string[];
    currentIndex: number;
    title?: string;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

export default function Lightbox({ images, currentIndex, title, onClose, onPrev, onNext }: LightboxProps) {
    const hasMultiple = images.length > 1;

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowLeft" && hasMultiple) onPrev();
        if (e.key === "ArrowRight" && hasMultiple) onNext();
    }, [onClose, onPrev, onNext, hasMultiple]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [handleKeyDown]);

    // ─────────────────────────────────────────────────────────────────────────
    // Use createPortal so the Lightbox renders directly on <body>.
    // This completely escapes ALL parent stacking contexts (z-index: 10, etc.)
    // and guarantees it always appears above the Navbar (z-[90]) and everything else.
    // ─────────────────────────────────────────────────────────────────────────
    const content = (
        <div
            className="fixed inset-0 flex items-center justify-center animate-in fade-in duration-200"
            style={{ zIndex: 99999, background: "rgba(0,0,0,0.92)" }}
            onClick={onClose}
        >
            {/* Close Button — always at top-right above everything */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                style={{ zIndex: 100000 }}
                aria-label="Close"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            {hasMultiple && (
                <div
                    className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white text-sm px-4 py-1.5 rounded-full border border-white/10"
                    style={{ zIndex: 100000 }}
                >
                    {currentIndex + 1} / {images.length}
                </div>
            )}

            {/* Prev Button */}
            {hasMultiple && (
                <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    style={{ zIndex: 100000 }}
                    aria-label="Previous"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}

            {/* Next Button */}
            {hasMultiple && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    style={{ zIndex: 100000 }}
                    aria-label="Next"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            )}

            {/* Image Container */}
            <div
                className="relative max-w-5xl w-full mx-4 sm:mx-16 animate-in zoom-in-95 duration-200"
                style={{ maxHeight: "85vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative w-full" style={{ height: "80vh" }}>
                    <Image
                        key={images[currentIndex]}
                        src={images[currentIndex]}
                        alt={title || "Image"}
                        fill
                        className="object-contain rounded-xl"
                        sizes="(max-width: 768px) 100vw, 80vw"
                        priority
                    />
                </div>

                {/* Title */}
                {title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-4 rounded-b-xl">
                        <p className="text-white font-semibold text-sm">{title}</p>
                    </div>
                )}
            </div>

            {/* Thumbnail Strip */}
            {hasMultiple && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 100000 }}>
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => { e.stopPropagation(); }}
                            className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex ? "border-white scale-110" : "border-white/30 opacity-60 hover:opacity-100"}`}
                        >
                            <Image src={img} alt={`thumb-${idx}`} fill className="object-cover" sizes="48px" />
                        </button>
                    ))}
                </div>
            )}

            {/* ESC hint */}
            <div className="absolute top-4 left-4 text-white/30 text-xs flex items-center gap-1.5" style={{ zIndex: 100000 }}>
                <ZoomIn className="w-3 h-3" /> Press ESC to close
            </div>
        </div>
    );

    // Portal renders directly to <body>, bypassing ALL stacking contexts
    return createPortal(content, document.body);
}
