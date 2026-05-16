import type { FeedItem } from "./types";

export const STATIC_TOOLS: FeedItem[] = [
    {
        id: "tool-qr",
        type: "tool",
        title: "QR Code Generator",
        description: "Generate high-quality QR codes instantly for URLs, text, and contacts. Free and secure.",
        fullContent: "Generate high-quality QR codes instantly for URLs, text, and contacts. Free and secure. This tool is built entirely in the browser, meaning your data never leaves your device.",
        imageUrl: "https://images.unsplash.com/photo-1622556498246-755f44ca76f3?auto=format&fit=crop&q=80&w=800",
        gallery: null,
        mediaType: "image",
        link: "/tools/utils/qr-generator",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
        id: "tool-unit",
        type: "tool",
        title: "Unit Converter",
        description: "A comprehensive unit converter for length, weight, temperature, and more.",
        fullContent: "A comprehensive unit converter for length, weight, temperature, and more. Essential for developers, students, and engineers who frequently need to convert between metric and imperial systems instantly.",
        imageUrl: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&q=80&w=800",
        gallery: null,
        mediaType: "image",
        link: "/tools/utils/unit-converter",
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    {
        id: "tool-pass",
        type: "tool",
        title: "Secure Password Generator",
        description: "Generate cryptographically secure passwords locally on your device without sending any data to the server.",
        fullContent: "Generate cryptographically secure passwords locally on your device without sending any data to the server. Customize length, complexity, and character sets to meet any security requirement.",
        imageUrl: "https://images.unsplash.com/photo-1510511459019-5efa326ae50a?auto=format&fit=crop&q=80&w=800",
        gallery: null,
        mediaType: "image",
        link: "/tools/security/password-generator",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    }
];
