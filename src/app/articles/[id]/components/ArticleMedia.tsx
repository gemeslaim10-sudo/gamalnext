import MediaGallery from "@/components/media/MediaGallery";

interface MediaItem {
    url: string;
    type: 'image' | 'video';
}

/** Cover image (or video) of the article; extra media show as thumbnails that open the viewer. */
export function ArticleMedia({ media, title }: { media: MediaItem[]; title: string }) {
    if (!media || media.length === 0) return null;

    return <MediaGallery items={media} title={title} sizes="(min-width: 768px) 672px, 100vw" preload />;
}
