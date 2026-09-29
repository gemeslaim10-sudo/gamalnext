"use client";

import CommentSection from "@/components/social/CommentSection";
import { Card } from "@/components/ui";
import { usePresence } from "@/hooks/usePresence";
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
    const comments = usePresence(isCommentActive);

    return (
        <Card padding="none" className="animate-rise-in overflow-hidden" ref={isLast ? lastItemRef : null}>
            <article>
                <FeedPostHeader item={item} siteLogo={siteLogo} siteName={siteName} />

                <FeedPostContent
                    item={item}
                    isExpanded={isExpanded}
                    hasLongContent={hasLongContent}
                    onToggleExpand={onToggleExpand}
                />

                <FeedPostMedia item={item} index={index} onOpenLightbox={onOpenLightbox} />

                <FeedPostActions
                    item={item}
                    isCommentActive={isCommentActive}
                    onToggleComments={onToggleComments}
                    onShare={onShare}
                />

                {/* Grid rows 0fr → 1fr lets the section open to its natural height smoothly */}
                {comments.mounted && (
                    <div
                        data-state={comments.state}
                        className="grid transition-[grid-template-rows,opacity] duration-(--motion-base) ease-out data-[state=closed]:grid-rows-[0fr] data-[state=closed]:opacity-0 data-[state=open]:grid-rows-[1fr]"
                    >
                        <div className="overflow-hidden">
                            <div className="border-t border-border px-4 py-4 sm:px-5">
                                <CommentSection articleId={item.id} />
                            </div>
                        </div>
                    </div>
                )}
            </article>
        </Card>
    );
}
