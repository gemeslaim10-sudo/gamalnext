"use client";

import CommentSection from "@/components/social/CommentSection";
import type { FeedItem } from "./types";
import { FeedPostHeader } from "./components/FeedPostHeader";
import { FeedPostContent } from "./components/FeedPostContent";
import { FeedPostMedia } from "./components/FeedPostMedia";
import { FeedPostActions } from "./components/FeedPostActions";

interface FeedPostCardProps {
    item: FeedItem;
    index: number;
    isLast: boolean;
    lastItemRef: ((node: HTMLDivElement | null) => void) | null;
    siteLogo?: string;
    siteName?: string;
    isExpanded: boolean;
    hasLongContent: boolean;
    isCommentActive: boolean;
    onToggleExpand: (id: string) => void;
    onToggleComments: (id: string) => void;
    onShare: (item: FeedItem) => void;
    onOpenLightbox: (images: string[], index: number, title: string) => void;
}

export default function FeedPostCard({
    item,
    index,
    isLast,
    lastItemRef,
    siteLogo,
    siteName,
    isExpanded,
    hasLongContent,
    isCommentActive,
    onToggleExpand,
    onToggleComments,
    onShare,
    onOpenLightbox,
}: FeedPostCardProps) {
    return (
        <article
            ref={isLast ? lastItemRef : null}
            className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl hover:border-white/10 transition-colors"
        >
            <FeedPostHeader 
                item={item} 
                siteLogo={siteLogo} 
                siteName={siteName} 
            />

            <FeedPostContent 
                item={item}
                isExpanded={isExpanded}
                hasLongContent={hasLongContent}
                onToggleExpand={onToggleExpand}
            />

            <FeedPostMedia 
                item={item}
                index={index}
                onOpenLightbox={onOpenLightbox}
            />

            <FeedPostActions 
                item={item}
                isCommentActive={isCommentActive}
                onToggleComments={onToggleComments}
                onShare={onShare}
            />

            {/* Expandable Comments Section */}
            {isCommentActive && (
                <div className="px-4 pb-4 bg-slate-900/40 animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="pt-4 border-t border-white/5">
                        <CommentSection articleId={item.id} />
                    </div>
                </div>
            )}
        </article>
    );
}
