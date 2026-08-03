import { Palette, Film, Code2 } from "lucide-react";

// ── Project Types ─────────────────────────────────────────────────────────────
export type ProjectItem = {
    title: string;
    image: string;
    tags: string;
    link: string;
    description: string;
    category: 'design' | 'video' | 'software';
    gallery?: string[];
    videoUrl?: string;
    embedCode?: string;
}

export interface ProjectsForm {
    items: ProjectItem[];
}

// ── Category Config ───────────────────────────────────────────────────────────
export const CATEGORY_CONFIG = {
    design: { label: "Design", icon: Palette, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
    video: { label: "Video", icon: Film, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    software: { label: "Software", icon: Code2, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
};
