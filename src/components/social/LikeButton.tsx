"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useCopy } from "@/components/providers/CopyProvider";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

// Module-level cache to prevent re-fetching counts on every mount
const _likeCountCache = new Map<string, number>();

export default function LikeButton({ articleId }: { articleId: string }) {
    const t = useCopy();
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);
    // null = still loading (a placeholder shows instead of a made-up 0)
    const [likeCount, setLikeCount] = useState<number | null>(_likeCountCache.get(articleId) ?? null);
    const [userLikeId, setUserLikeId] = useState<string | null>(null);
    const [countFor, setCountFor] = useState(articleId);

    // A different article: start from its cached count (adjusted during render, not in an effect)
    if (countFor !== articleId) {
        setCountFor(articleId);
        setLikeCount(_likeCountCache.get(articleId) ?? null);
    }

    // Fetch Like Status
    useEffect(() => {
        // Skip if already cached
        if (_likeCountCache.has(articleId)) return;

        async function fetchCount() {
            try {
                const qCount = query(collection(db, "likes"), where("articleId", "==", articleId));
                const snapshot = await getCountFromServer(qCount);
                const count = snapshot.data().count;
                _likeCountCache.set(articleId, count);
                setLikeCount(count);
            } catch {
                console.error("Error fetching likes count");
                // Only when the count can't be read: start from zero (not cached, so the next visit retries)
                setLikeCount((current) => current ?? 0);
            }
        }
        fetchCount();
    }, [articleId]);

    // Check if CURRENT user liked (one-time check on auth change)
    useEffect(() => {
        async function checkUserLike() {
            if (!user) {
                setLiked(false);
                setUserLikeId(null);
                return;
            }

            const q = query(
                collection(db, "likes"),
                where("articleId", "==", articleId),
                where("userId", "==", user.uid)
            );
            const snap = await getDocs(q);
            if (!snap.empty) {
                setLiked(true);
                setUserLikeId(snap.docs[0].id);
            } else {
                setLiked(false);
                setUserLikeId(null);
            }
        }
        checkUserLike();
    }, [user, articleId]);

    const handleToggle = async () => {
        if (!user) {
            toast.error(t("blog.likeLoginRequired"));
            return;
        }

        // Optimistic UI
        const prevLiked = liked;
        const prevCount = likeCount ?? 0;
        const newCount = prevLiked ? prevCount - 1 : prevCount + 1;
        setLiked(!liked);
        setLikeCount(newCount);
        _likeCountCache.set(articleId, newCount); // Update cache too

        try {
            if (prevLiked && userLikeId) {
                // Unlike
                await deleteDoc(doc(db, "likes", userLikeId));
                setUserLikeId(null);
            } else {
                // Like
                const ref = await addDoc(collection(db, "likes"), {
                    articleId,
                    userId: user.uid,
                    createdAt: new Date()
                });
                setUserLikeId(ref.id);
            }
        } catch {
            // Revert
            setLiked(prevLiked);
            setLikeCount(prevCount);
            _likeCountCache.set(articleId, prevCount);
            toast.error(t("blog.likeFailed"));
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            aria-label={liked ? `Unlike (${likeCount ?? 0} likes)` : `Like (${likeCount ?? 0} likes)`}
            className={cn(liked && "text-foreground")}
        >
            <Heart className={cn(liked && "fill-current")} />
            {likeCount === null ? (
                <span aria-hidden className="h-3 w-3 animate-pulse rounded-control bg-surface-hover" />
            ) : (
                <span className="tabular-nums">{likeCount}</span>
            )}
        </Button>
    );
}
