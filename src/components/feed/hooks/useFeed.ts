import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { FeedItem, FeedAd } from "../types";

export function useFeed() {
    const [items, setItems] = useState<FeedItem[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeComments, setActiveComments] = useState<string | null>(null);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [lightbox, setLightbox] = useState<{ images: string[]; index: number; title: string } | null>(null);
    const [inFeedAds, setInFeedAds] = useState<FeedAd[]>([]);
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        getDocs(query(collection(db, "ads"), where("active", "==", true)))
            .then(snap => {
                const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as FeedAd));
                setInFeedAds(all.filter(ad => (ad as FeedAd & { showInFeed?: boolean }).showInFeed === true));
            })
            .catch(() => { /* silent fail */ });
    }, []);

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
                toast.error("Failed to load content");
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, [page]);

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
                toast.success('Link copied to clipboard! 📋');
            }
        } catch (err) {
            toast.error('Failed to copy link.');
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
    };

    const closeLightbox = () => setLightbox(null);

    const prevImage = () => {
        if (!lightbox) return;
        setLightbox(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null);
    };

    const nextImage = () => {
        if (!lightbox) return;
        setLightbox(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null);
    };

    return {
        items,
        loading,
        hasMore,
        error,
        activeComments,
        expandedItems,
        lightbox,
        inFeedAds,
        setError,
        setPage,
        lastItemElementRef,
        handleShare,
        toggleComments,
        toggleExpand,
        openLightbox,
        closeLightbox,
        prevImage,
        nextImage
    };
}
