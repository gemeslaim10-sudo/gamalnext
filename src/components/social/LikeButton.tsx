"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

// Module-level cache to prevent re-fetching counts on every mount
const _likeCountCache = new Map<string, number>();

export default function LikeButton({ articleId }: { articleId: string }) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(_likeCountCache.get(articleId) ?? 0);
    const [userLikeId, setUserLikeId] = useState<string | null>(null);

    // Fetch Like Status
    useEffect(() => {
        // Skip if already cached
        if (_likeCountCache.has(articleId)) {
            setLikeCount(_likeCountCache.get(articleId)!);
            return;
        }

        async function fetchCount() {
            try {
                const qCount = query(collection(db, "likes"), where("articleId", "==", articleId));
                const snapshot = await getCountFromServer(qCount);
                const count = snapshot.data().count;
                _likeCountCache.set(articleId, count);
                setLikeCount(count);
            } catch {
                console.error("Error fetching likes count");
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
            toast.error("You must log in to like this article");
            return;
        }

        // Optimistic UI
        const prevLiked = liked;
        const newCount = prevLiked ? likeCount - 1 : likeCount + 1;
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
            setLikeCount(likeCount);
            _likeCountCache.set(articleId, likeCount);
            toast.error("Update failed");
        }
    };

    return (
        <button
            onClick={handleToggle}
            aria-label={liked ? `Unlike (${likeCount} likes)` : `Like (${likeCount} likes)`}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all text-xs sm:text-sm ${liked ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-red-500/50 hover:text-red-400'}`}
        >
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${liked ? 'fill-current' : ''}`} />
            <span className="font-bold">{likeCount}</span>
        </button>
    );
}
