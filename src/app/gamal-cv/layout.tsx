import type { Metadata } from "next";
import type { ReactNode } from "react";

// The owner's printable CV builder: its own tab title, and kept out of search results.
export const metadata: Metadata = {
    title: "CV",
    robots: { index: false, follow: false },
};

export default function CvLayout({ children }: { children: ReactNode }) {
    return children;
}
