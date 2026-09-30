"use client";

import { useBrandingContext } from "@/components/providers/BrandingProvider";
import Lightbox from "@/components/media/Lightbox";
import CreatePost from "./CreatePost";
import FeedPostCard from "./FeedPostCard";
import { FeedSkeleton, FeedErrorBanner, FeedEndMessage, FeedLoadingSpinner } from "./FeedStates";
import { useFeed, type FeedInitialPage } from "./hooks/useFeed";

export default function FeedClient({ initialPage }: { initialPage?: FeedInitialPage | null }) {
    const {
        items, loading, hasMore, error, activeComments, expandedItems, lightbox, lightboxOpen,
        retry, lastItemElementRef, handleShare, toggleComments, toggleExpand,
        openLightbox, closeLightbox
    } = useFeed(initialPage);

    const branding = useBrandingContext();

    return (
        <div className="min-w-0 space-y-4">
            {lightbox && (
                <Lightbox
                    open={lightboxOpen}
                    items={lightbox.images.map((url) => ({ url, type: "image" as const }))}
                    index={lightbox.index}
                    title={lightbox.title}
                    onIndexChange={(index) => openLightbox(lightbox.images, index, lightbox.title)}
                    onClose={closeLightbox}
                />
            )}

            <CreatePost />

            {error && <FeedErrorBanner error={error} onRetry={retry} />}

            {(loading || (!error && items.length === 0 && hasMore)) && items.length === 0 && <FeedSkeleton />}

            {items.map((item, index) => {
                const isLast = items.length === index + 1;
                const hasLongContent = !!item.fullContent && item.fullContent.length > item.description.length + 20;

                return (
                    <FeedPostCard
                        key={`${item.id}-${index}`}
                        item={item}
                        index={index}
                        isLast={isLast}
                        lastItemRef={isLast ? lastItemElementRef : null}
                        siteLogo={branding?.siteLogo}
                        siteName={branding?.siteName}
                        isExpanded={expandedItems.has(item.id)}
                        hasLongContent={hasLongContent}
                        isCommentActive={activeComments === item.id}
                        onToggleExpand={toggleExpand}
                        onToggleComments={toggleComments}
                        onShare={handleShare}
                        onOpenLightbox={openLightbox}
                    />
                );
            })}

            {loading && items.length > 0 && <FeedLoadingSpinner />}

            {!hasMore && items.length > 0 && <FeedEndMessage />}
        </div>
    );
}
