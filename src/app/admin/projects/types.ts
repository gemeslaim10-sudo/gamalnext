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
    design: { label: "Design", icon: Palette },
    video: { label: "Video", icon: Film },
    software: { label: "Software", icon: Code2 },
};
