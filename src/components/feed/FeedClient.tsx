"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Share2, ExternalLink, Calendar, Briefcase, FileText, Wrench, PlayCircle, User } from "lucide-react";
import LikeButton from "@/components/social/LikeButton";
import CommentSection from "@/components/social/CommentSection";
import { toast } from "react-hot-toast";
import { useBrandingContext } from "@/components/providers/BrandingProvider";
import CreatePost from "./CreatePost";
import Lightbox from "./Lightbox";
import { textDirStyle } from "@/lib/utils";
import InFeedAd from "./InFeedAd";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

type FeedItem = {
    id: string;
    type: "article" | "project" | "tool" | "post";
    title: string;
    description: string;
    fullContent?: string;
    imageUrl: string | null;
    gallery?: string[];
    mediaType: "image" | "video";
    videoUrl?: string | null;
    link: string;
    createdAt: string;
    author?: string;
};

interface FeedAd {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    whatsappMessage: string;
    whatsappNumber: string;
}

export default function FeedClient() {
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
    
    const branding = useBrandingContext();
    const siteLogo = branding?.siteLogo;

    // Fetch in-feed ads once on mount
    useEffect(() => {
        getDocs(query(collection(db, "ads"), where("active", "==", true)))
            .then(snap => {
                const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as FeedAd));
                // Only show ads explicitly marked for in-feed
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
                console.log("[Feed] API response:", data);
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

    const getIconForType = (type: string) => {
        switch (type) {
            case "project": return <Briefcase className="w-4 h-4 text-emerald-400" />;
            case "article": return <FileText className="w-4 h-4 text-blue-400" />;
            case "tool": return <Wrench className="w-4 h-4 text-purple-400" />;
            case "post": return <MessageCircle className="w-4 h-4 text-amber-400" />;
            default: return null;
        }
    };

    const getLabelForType = (type: string) => {
        switch (type) {
            case "project": return "New Project";
            case "article": return "New Article";
            case "tool": return "Useful Tool";
            case "post": return "Community Post";
            default: return "Update";
        }
    };

    return (
        <div className="max-w-2xl mx-auto w-full px-4 sm:px-0 py-8 space-y-8">
            {lightbox && (
                <Lightbox
                    images={lightbox.images}
                    currentIndex={lightbox.index}
                    title={lightbox.title}
                    onClose={closeLightbox}
                    onPrev={prevImage}
                    onNext={nextImage}
                />
            )}
            <CreatePost />

            {/* Error Banner */}
            {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm">
                    <p className="font-bold">⚠️ Failed to load feed</p>
                    <p className="mt-1 opacity-70 text-xs font-mono">{error}</p>
                    <button onClick={() => { setError(null); setPage(p => p); }} className="mt-2 text-xs underline">
                        Retry
                    </button>
                </div>
            )}

            {/* Loading skeleton on first load */}
            {loading && items.length === 0 && (
                <div className="space-y-8">
                    {[1, 2, 3].map(n => (
                        <div key={n} className="bg-slate-900/60 border border-white/5 rounded-[2rem] overflow-hidden animate-pulse">
                            <div className="p-6 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-slate-800"></div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                                    <div className="h-3 bg-slate-800/60 rounded w-1/4"></div>
                                </div>
                            </div>
                            <div className="px-6 pb-4 space-y-2">
                                <div className="h-6 bg-slate-800 rounded w-2/3"></div>
                                <div className="h-4 bg-slate-800/60 rounded w-full"></div>
                                <div className="h-4 bg-slate-800/60 rounded w-5/6"></div>
                            </div>
                            <div className="aspect-video bg-slate-800/40"></div>
                        </div>
                    ))}
                </div>
            )}
            
            {items.map((item, index) => {
                const isLast = items.length === index + 1;
                const isExpanded = expandedItems.has(item.id);
                const hasLongContent = item.fullContent && item.fullContent.length > item.description.length + 20;
                // Insert an in-feed ad after every 4th post
                const showAdAfter = inFeedAds.length > 0 && (index + 1) % 4 === 0;
                const adToShow = showAdAfter ? inFeedAds[(Math.floor(index / 4)) % inFeedAds.length] : null;
                
                return (
                    <React.Fragment key={`${item.id}-${index}`}>
                        <article
                            ref={isLast ? lastItemElementRef : null}
                            className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl hover:border-white/10 transition-colors"
                        >
                        {/* Post Header */}
                        <div className="p-4 sm:p-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 shrink-0 border-2 border-slate-700/50 relative flex items-center justify-center">
                                    {siteLogo ? (
                                        <Image src={siteLogo} alt={branding?.siteName || "Gamal Tech"} fill className="object-cover" />
                                    ) : (
                                        <User className="w-6 h-6 text-slate-400" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-white">{item.author || "Gamal Abdelaty"}</h3>
                                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700 text-[10px] font-semibold tracking-wider uppercase text-slate-300">
                                            {getIconForType(item.type)}
                                            {getLabelForType(item.type)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Post Content */}
                        <div className="px-4 sm:px-6 pb-4">
                            <h2
                                style={textDirStyle(item.title)}
                                className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight"
                            >
                                {item.title}
                            </h2>
                            <div
                                style={textDirStyle(isExpanded ? (item.fullContent || item.description) : item.description)}
                                className={`text-slate-300 text-sm sm:text-base leading-relaxed ${!isExpanded ? "line-clamp-3" : "whitespace-pre-wrap"}`}
                            >
                                {isExpanded ? (item.fullContent || item.description) : item.description}
                            </div>
                            {hasLongContent && (
                                <button
                                    onClick={() => toggleExpand(item.id)}
                                    className="mt-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors text-sm"
                                >
                                    {isExpanded ? "Show Less" : "Read More / عرض المزيد"}
                                </button>
                            )}
                        </div>

                        {/* Media Area */}
                        {item.gallery && item.gallery.length > 1 ? (
                            <div className={`grid gap-1 ${item.gallery.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                                {item.gallery.slice(0, 3).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => openLightbox(item.gallery!, idx, item.title)}
                                        className={`block relative bg-black ${item.gallery!.length === 3 && idx === 0 ? 'col-span-2 aspect-[21/9]' : 'aspect-square'} overflow-hidden group cursor-zoom-in`}
                                    >
                                        <div className="absolute inset-0 bg-black/30 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                        </div>
                                        <Image
                                            src={img}
                                            alt={item.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 672px"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            priority={index === 0 && idx === 0}
                                        />
                                    </button>
                                ))}
                            </div>
                        ) : item.imageUrl && (
                            <button
                                onClick={() => openLightbox(item.imageUrl ? [item.imageUrl] : [], 0, item.title)}
                                className="block relative bg-black aspect-video w-full overflow-hidden group cursor-zoom-in"
                            >
                                <div className="absolute inset-0 bg-black/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    {item.mediaType === "video" && item.videoUrl ? (
                                        <PlayCircle className="w-16 h-16 text-white drop-shadow-2xl" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                    )}
                                </div>
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 672px"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority={index === 0}
                                />
                            </button>
                        )}
                        {!item.imageUrl && (!item.gallery || item.gallery.length === 0) && (
                            <Link href={item.link} className="block w-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-8 text-center hover:bg-slate-800/40 transition-colors border-y border-white/5">
                                <span className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors">
                                    Read Full Post <ExternalLink className="w-4 h-4" />
                                </span>
                            </Link>
                        )}

                        {/* Action Bar */}
                        <div className="p-4 border-t border-white/5 bg-slate-900/40">
                            <div className="flex items-center gap-2">
                                <div className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-full transition-colors flex items-center px-1">
                                    <LikeButton articleId={item.id} />
                                </div>
                                
                                <button 
                                    onClick={() => toggleComments(item.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors text-sm border ${
                                        activeComments === item.id 
                                            ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' 
                                            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-700/50'
                                    }`}
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Comment
                                </button>
                                
                                <button 
                                    onClick={() => handleShare(item)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors text-sm border bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-700/50 ml-auto"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Expandable Comments Section */}
                        {activeComments === item.id && (
                            <div className="px-4 pb-4 bg-slate-900/40 animate-in slide-in-from-top-4 fade-in duration-300">
                                <div className="pt-4 border-t border-white/5">
                                    <CommentSection articleId={item.id} />
                                </div>
                            </div>
                        )}
                    </article>

                        {/* In-Feed Ad injected after every 4th post */}
                        {adToShow && (
                            <InFeedAd
                                key={`ad-${adToShow.id}-${index}`}
                                title={adToShow.title}
                                description={adToShow.description}
                                imageUrl={adToShow.imageUrl}
                                whatsappMessage={adToShow.whatsappMessage}
                                whatsappNumber={adToShow.whatsappNumber}
                            />
                        )}
                    </React.Fragment>
                );
            })}

            {loading && (
                <div className="py-8 flex justify-center">
                    <div className="w-8 h-8 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin"></div>
                </div>
            )}
            
            {!hasMore && items.length > 0 && (
                <div className="py-12 text-center text-slate-500 font-medium">
                    You&apos;ve reached the end! 🚀
                </div>
            )}
        </div>
    );
}
