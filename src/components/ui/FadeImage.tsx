"use client";

import { useState, type ComponentProps } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { cloudinaryLoader, isCloudinaryImage } from "@/lib/cloudinary-loader";

const FADE = "transition-opacity duration-(--motion-slow) ease-out";

/**
 * next/image that fades in once the file has loaded, instead of popping in.
 * Skip it for `priority` (above-the-fold) images so they paint immediately.
 */
export function FadeImage({ className, onLoad, alt, loader, ...props }: ImageProps) {
    const [loaded, setLoaded] = useState(false);
    return (
        <Image
            {...props}
            // Cloudinary uploads are resized and converted by Cloudinary itself
            loader={loader ?? (isCloudinaryImage(props.src) ? cloudinaryLoader : undefined)}
            alt={alt}
            onLoad={(e) => {
                setLoaded(true);
                onLoad?.(e);
            }}
            className={cn(FADE, loaded ? "opacity-100" : "opacity-0", className)}
        />
    );
}

/** Same fade for a plain <img> (media from hosts next/image isn't configured for). */
export function FadeImg({ className, onLoad, alt, ...props }: ComponentProps<"img">) {
    const [loaded, setLoaded] = useState(false);
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            {...props}
            alt={alt}
            ref={(node) => {
                // Already in the browser cache: no load event will fire
                if (node?.complete && node.naturalWidth > 0 && !loaded) setLoaded(true);
            }}
            onLoad={(e) => {
                setLoaded(true);
                onLoad?.(e);
            }}
            className={cn(FADE, loaded ? "opacity-100" : "opacity-0", className)}
        />
    );
}
