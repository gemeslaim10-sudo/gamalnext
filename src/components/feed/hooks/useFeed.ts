import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";

import type { FeedItem } from "../types";
import { feedImages } from "../feedMedia";
import type { LightboxGroup, LightboxPosition } from "@/components/media/Lightbox";
import { useCopy } from "@/components/providers/CopyProvider";

/** One card's images as a set for the viewer; its title links to its page (posts have none). */
function viewerGroup(item: FeedItem): LightboxGroup {
    return {
        title: item.title,
        href: item.type === "post" ? undefined : item.link,
        items: feedImages(item).map((url) => ({ url, type: "image" as const })),
    };
}

export interface FeedInitialPage {
    items: FeedItem[];
    hasMore: boolean;
}

/**
 * @param initialPage the first page, rendered with the home page on the server (null when the
 *   server couldn't read it — then the browser loads page 1 itself)
 * @param projectGalleries every project's images (from the server), for the image viewer
 */
export function useFeed(initialPage?: FeedInitialPage | null, projectGalleries?: LightboxGroup[]) {
    const t = useCopy();
    const [items, setItems] = useState<FeedItem[]>(initialPage?.items ?? []);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialPage?.hasMore ?? true);
    const [error, setError] = useState<string | null>(null);
    // Pages already shown or on their way; page 1 usually came with the page
    const requestedPages = useRef(new Set<number>(initialPage ? [1] : []));
    const [attempt, setAttempt] = useState(0);
    const [activeComments, setActiveComments] = useState<string | null>(null);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    // The last opened images stay in state after closing so the viewer can animate out
    const [lightbox, setLightbox] = useState<{ groups: LightboxGroup[]; position: LightboxPosition } | null>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    const lastItemElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        if (requestedPages.current.has(page)) return;
        requestedPages.current.add(page);
        const fetchFeed = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/feed?page=${page}`);
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`API ${res.status}: ${text.slice(0, 200)}`);
                }
                const data = await res.json() as { items?: FeedItem[]; hasMore?: boolean };
                if (data.items) {
                    setItems(prev => {
                        const newItems = data.items!.filter((item: FeedItem) => !prev.some(p => p.id === item.id));
                        return [...prev, ...newItems];
                    });
                    setHasMore(data.hasMore ?? false);
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                // Allow "Retry" to ask for this page again
                requestedPages.current.delete(page);
                console.error("Failed to load feed", error);
                setError(error instanceof Error ? error.message : "Failed to load content");
                toast.error(t("home.loadFailed"));
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, [page, t, attempt]);

    const retry = () => {
        setError(null);
        setAttempt((value) => value + 1);
    };

    const handleShare = async (item: FeedItem) => {
        const shareData = {
            title: item.title,
            text: item.description,
            url: window.location.origin + item.link,
        };

        try {
            if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                toast.success(t("home.linkCopied"));
            }
        } catch {
            toast.error(t("home.copyFailed"));
        }
    };

    const toggleComments = (id: string) => {
        setActiveComments(activeComments === id ? null : id);
    };

    const toggleExpand = (id: string) => {
        setExpandedItems(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    /**
     * A project opens among every project's images (in the order of the projects page), so visitors
     * can browse them all without closing the viewer; a post's or an article's images show on their own.
     */
    const openLightbox = (item: FeedItem, index: number) => {
        const group = item.type === "project" && projectGalleries ? projectGalleries.findIndex((gallery) => gallery.href === item.link) : -1;
        if (projectGalleries && group >= 0) {
            // The card may list the images differently from the project page: open the one tapped
            const url = feedImages(item)[index];
            const start = projectGalleries[group].items.findIndex((media) => media.url === url);
            setLightbox({ groups: projectGalleries, position: { group, index: Math.max(0, start) } });
        } else {
            setLightbox({ groups: [viewerGroup(item)], position: { group: 0, index } });
        }
        setLightboxOpen(true);
    };

    const moveLightbox = (position: LightboxPosition) => setLightbox((current) => (current ? { ...current, position } : current));

    const closeLightbox = () => setLightboxOpen(false);

    return {
        items,
        loading,
        hasMore,
        error,
        activeComments,
        expandedItems,
        lightbox,
        lightboxOpen,
        setError,
        setPage,
        retry,
        lastItemElementRef,
        handleShare,
        toggleComments,
        toggleExpand,
        openLightbox,
        moveLightbox,
        closeLightbox
    };
}
