import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";

import type { FeedItem } from "../types";
import { useCopy } from "@/components/providers/CopyProvider";

export function useFeed() {
    const t = useCopy();
    const [items, setItems] = useState<FeedItem[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeComments, setActiveComments] = useState<string | null>(null);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    // The last opened images stay in state after closing so the viewer can animate out
    const [lightbox, setLightbox] = useState<{ images: string[]; index: number; title: string } | null>(null);
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
                console.error("Failed to load feed", error);
                setError(error instanceof Error ? error.message : "Failed to load content");
                toast.error(t("home.loadFailed"));
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, [page, t]);

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

    const openLightbox = (images: string[], index: number, title: string) => {
        setLightbox({ images, index, title });
        setLightboxOpen(true);
    };

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
        lastItemElementRef,
        handleShare,
        toggleComments,
        toggleExpand,
        openLightbox,
        closeLightbox
    };
}
