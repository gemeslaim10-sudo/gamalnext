"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ExternalLink, ZoomIn } from "lucide-react";

interface ImageZoomProps {
    src: string;
    alt: string;
    className?: string;
    containerClassName?: string;
    priority?: boolean;
    sizes?: string;
}

export default function ImageZoom({ src, alt, className, containerClassName, priority, sizes }: ImageZoomProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <>
            <div 
                className={`group cursor-pointer relative overflow-hidden ${containerClassName || ''}`}
                onClick={() => setIsOpen(true)}
            >
                <Image
                    src={src}
                    alt={alt}
                    width={1920}
                    height={1080}
                    priority={priority}
                    sizes={sizes}
                    className={`w-full h-auto object-contain transition-transform duration-700 ${className || ''}`}
                />
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-black/60 backdrop-blur-md text-white p-3 md:p-4 rounded-full transition-transform duration-500 transform scale-50 group-hover:scale-100 shadow-2xl">
                        <ZoomIn className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="fixed top-14 left-0 right-0 bottom-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8" onClick={() => setIsOpen(false)}>
                    <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-md transition-colors z-[10000]"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="relative w-full h-[75vh] md:h-[85vh] flex items-center justify-center mb-6">
                            <Image
                                src={src}
                                alt={alt}
                                fill
                                className="object-contain"
                                quality={100}
                                unoptimized
                            />
                        </div>

                        <a 
                            href={src} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-1"
                        >
                            Open Original Image <ExternalLink className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}
