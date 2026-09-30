import type { FeedItem } from "./types";

/** The images a feed card shows, and opens in the viewer: its gallery, else its single image. */
export function feedImages(item: FeedItem): string[] {
    if (item.gallery && item.gallery.length > 1) return item.gallery;
    return item.imageUrl ? [item.imageUrl] : [];
}
