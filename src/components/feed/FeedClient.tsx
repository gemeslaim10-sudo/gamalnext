"use client";

import React from "react";
import { useBrandingContext } from "@/components/providers/BrandingProvider";

// ── Feed Sub-Components ─────────────────────────────────────────────────────
import CreatePost from "./CreatePost";
import Lightbox from "./Lightbox";
import InFeedAd from "./InFeedAd";
import FeedPostCard from "./FeedPostCard";
import { FeedSkeleton, FeedErrorBanner, FeedEndMessage, FeedLoadingSpinner } from "./FeedStates";
import { useFeed } from "./hooks/useFeed";

export default function FeedClient() {
    const {
        items, loading, hasMore, error, activeComments, expandedItems, lightbox, inFeedAds,
        setError, setPage, lastItemElementRef, handleShare, toggleComments, toggleExpand,
        openLightbox, closeLightbox, prevImage, nextImage
    } = useFeed();
    
    const branding = useBrandingContext();
    const siteLogo = branding?.siteLogo;

    // ── Render ───────────────────────────────────────────────────────────────
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

            {error && (
                <FeedErrorBanner error={error} onRetry={() => { setError(null); setPage(p => p); }} />
            )}

            {loading && items.length === 0 && <FeedSkeleton />}
            
            {items.map((item, index) => {
                const isLast = items.length === index + 1;
                const isExpanded = expandedItems.has(item.id);
                const hasLongContent = item.fullContent && item.fullContent.length > item.description.length + 20;
                // Insert an in-feed ad after every 4th post
                const showAdAfter = inFeedAds.length > 0 && (index + 1) % 4 === 0;
                const adToShow = showAdAfter ? inFeedAds[(Math.floor(index / 4)) % inFeedAds.length] : null;
                
                return (
                    <React.Fragment key={`${item.id}-${index}`}>
                        <FeedPostCard
                            item={item}
                            index={index}
                            isLast={isLast}
                            lastItemRef={isLast ? lastItemElementRef : null}
                            siteLogo={siteLogo}
                            siteName={branding?.siteName}
                            isExpanded={isExpanded}
                            hasLongContent={!!hasLongContent}
                            isCommentActive={activeComments === item.id}
                            onToggleExpand={toggleExpand}
                            onToggleComments={toggleComments}
                            onShare={handleShare}
                            onOpenLightbox={openLightbox}
                        />

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

            {loading && <FeedLoadingSpinner />}
            
            {!hasMore && items.length > 0 && <FeedEndMessage />}
        </div>
    );
}
