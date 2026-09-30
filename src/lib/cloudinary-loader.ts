import type { ImageLoaderProps } from "next/image";

const UPLOAD = "/image/upload/";

export function isCloudinaryImage(src: unknown): src is string {
    return typeof src === "string" && src.startsWith("https://res.cloudinary.com/") && src.includes(UPLOAD);
}

/**
 * next/image loader for Cloudinary uploads: Cloudinary resizes to the exact width the screen needs
 * and serves AVIF/WebP from its own CDN, so these images skip Vercel's image optimizer entirely.
 * Transformations already in the URL still apply after this one.
 */
export function cloudinaryLoader({ src, width }: ImageLoaderProps) {
    return src.replace(UPLOAD, `${UPLOAD}f_auto,q_auto,c_limit,w_${width}/`);
}
