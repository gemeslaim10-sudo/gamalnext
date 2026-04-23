import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function slugify(text: string) {
    if (!text) return '';
    return encodeURIComponent(
        text.toLowerCase()
            .trim()
            .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-') // Allow English, numbers, and Arabic
            .replace(/(^-|-$)+/g, '')
    );
}
