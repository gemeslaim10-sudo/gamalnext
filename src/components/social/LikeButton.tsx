"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function LikeButton({ articleId }: { articleId: string }) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userLikeId, setUserLikeId] = useState<string | null>(null);

    // Fetch Like Status
    useEffect(() => {
        // Real-time count
        const qCount = query(collection(db, "likes"), where("articleId", "==", articleId));
        const unsubscribe = onSnapshot(qCount, (snap) => {
            setLikeCount(snap.size);

            // Check if user liked from the snapshot? 
            // Better to do a separate check for the exact document if possible or filter client side quickly if small scale.
            // For separate user check:
        });

        return () => unsubscribe();
    }, [articleId]);

    // Check if CURRENT user liked (one-time check on auth change)
    useEffect(() => {
        async function checkUserLike() {
            if (!user) {
                setLiked(false);
                setUserLikeId(null);
                setLoading(false);
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
            setLoading(false);
        }
        checkUserLike();
    }, [user, articleId]);

    const handleToggle = async () => {
        if (!user) {
            toast.error("يجب تسجيل الدخول للإعجاب بالمقال");
            return;
        }

        // Optimistic UI
        const prevLiked = liked;
        setLiked(!liked);

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
        } catch (e) {
            // Revert
            setLiked(prevLiked);
            toast.error("فشل التحديث");
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
