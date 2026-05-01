"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function LikeButton({ articleId }: { articleId: string }) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [userLikeId, setUserLikeId] = useState<string | null>(null);

    // Fetch Like Status
    useEffect(() => {
        async function fetchCount() {
            try {
                const qCount = query(collection(db, "likes"), where("articleId", "==", articleId));
                const snapshot = await getCountFromServer(qCount);
                setLikeCount(snapshot.data().count);
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
        setLiked(!liked);
        setLikeCount(prevCount => prevLiked ? prevCount - 1 : prevCount + 1);

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
            toast.error("Update failed");
        }
    };

    return (
        <button
            onClick={handleToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${liked ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-red-500/50 hover:text-red-400'}`}
        >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span className="font-bold">{likeCount}</span>
        </button>
    );
}
