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
            .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
            .replace(/(^-|-$)+/g, '')
    );
}

// ─── Smart Text Direction Detection ─────────────────────────────────────────
// Analyzes the ratio of Arabic vs Latin characters to determine dominant direction.
// Handles mixed-language text (Arabic + English) intelligently.

const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
const LATIN_REGEX  = /[a-zA-Z]/g;

/** Returns "rtl" if Arabic characters are ≥40% of all letter characters */
export function detectTextDir(text: string): "rtl" | "ltr" {
    if (!text || !text.trim()) return "ltr";
    const arabicCount = (text.match(ARABIC_REGEX) || []).length;
    const latinCount  = (text.match(LATIN_REGEX)  || []).length;
    const total = arabicCount + latinCount;
    if (total === 0) return "ltr";
    return arabicCount / total >= 0.4 ? "rtl" : "ltr";
}

/** Returns CSS dir attribute value */
export function detectTextAlign(text: string): "right" | "left" {
    return detectTextDir(text) === "rtl" ? "right" : "left";
}

/**
 * Returns an object of inline style props for text direction.
 * Use: <p style={textDirStyle(text)}>{text}</p>
 */
export function textDirStyle(text: string): React.CSSProperties {
    const dir = detectTextDir(text);
    return {
        direction: dir,
        textAlign: dir === "rtl" ? "right" : "left",
        unicodeBidi: "embed",
    };
}
