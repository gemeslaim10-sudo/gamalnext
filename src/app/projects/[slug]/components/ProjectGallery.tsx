import MediaGallery from "@/components/media/MediaGallery";
import type { LightboxGroup } from "@/components/media/Lightbox";

interface ProjectGalleryProps {
    title: string;
    /** Main image first, then the gallery */
    images: string[];
    /** Every project's images, with this one at `current`: the viewer carries on from project to project */
    sequence?: { groups: LightboxGroup[]; current: number };
}

export default function ProjectGallery({ title, images, sequence }: ProjectGalleryProps) {
    if (images.length === 0) return null;

    return (
        <MediaGallery
            items={images.map((url) => ({ url, type: "image" as const }))}
            title={title}
            sizes="(min-width: 1024px) 740px, 100vw"
            preload
            sequence={sequence}
        />
    );
}
