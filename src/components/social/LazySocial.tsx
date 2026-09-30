"use client";

import dynamic from "next/dynamic";
import { Heart } from "lucide-react";
import { Button, Skeleton } from "@/components/ui";

// Likes and comments read the database live, so they load right after the page is shown instead of
// being part of its first download (the database library is the biggest one on the site). The
// placeholders take the same space, so nothing moves when the real ones appear.

function LikeButtonPlaceholder() {
    return (
        <Button variant="ghost" size="sm" aria-hidden tabIndex={-1} className="pointer-events-none">
            <Heart />
            <span className="h-3 w-3 animate-pulse rounded-control bg-surface-hover" />
        </Button>
    );
}

function CommentsPlaceholder() {
    return (
        <div aria-hidden className="space-y-3 py-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-2/3" />
        </div>
    );
}

export const LikeButton = dynamic(() => import("./LikeButton"), { ssr: false, loading: LikeButtonPlaceholder });

export const CommentSection = dynamic(() => import("./CommentSection"), { ssr: false, loading: CommentsPlaceholder });
