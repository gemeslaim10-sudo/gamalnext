import MediaGallery from "@/components/media/MediaGallery";

interface ProjectGalleryProps {
    title: string;
    /** Main image first, then the gallery */
    images: string[];
}

export default function ProjectGallery({ title, images }: ProjectGalleryProps) {
    if (images.length === 0) return null;

    return (
        <MediaGallery
            items={images.map((url) => ({ url, type: "image" as const }))}
            title={title}
            sizes="(min-width: 1024px) 740px, 100vw"
            preload
        />
    );
}
