"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Check, X, Trash, Star, EyeOff } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

type Review = {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'hidden';
    createdAt: any;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
            setReviews(data);
        });
        return () => unsubscribe();
    }, []);

    const updateStatus = async (id: string, status: 'approved' | 'hidden') => {
        try {
            await updateDoc(doc(db, "reviews", id), { status });
            toast.success(`Review ${status}`);
        } catch (e) {
            toast.error("Error updating status");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this review?")) {
            try {
                await deleteDoc(doc(db, "reviews", id));
                toast.success("Review deleted");
            } catch (e) {
                toast.error("Error deleting review");
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <Toaster />
            <h1 className="text-3xl font-bold text-white mb-8">Manage Reviews</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                    <div key={review.id} className={`p-6 rounded-xl border ${review.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-slate-900 border-slate-800'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-white font-bold">{review.userName}</h3>
                                <div className="flex text-yellow-500 gap-1 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-500' : 'text-slate-700'}`} />
                                    ))}
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${review.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                    review.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-red-500/20 text-red-400'
                                }`}>
                                {review.status}
                            </span>
                        </div>

                        <p className="text-slate-300 text-sm mb-6 line-clamp-4">"{review.comment}"</p>

                        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-700/50">
                            {review.status !== 'approved' && (
                                <button onClick={() => updateStatus(review.id, 'approved')} className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold flex justify-center items-center gap-1">
                                    <Check className="w-3 h-3" /> Approve
                                </button>
                            )}
                            {review.status === 'approved' && (
                                <button onClick={() => updateStatus(review.id, 'hidden')} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-bold flex justify-center items-center gap-1">
                                    <EyeOff className="w-3 h-3" /> Hide
                                </button>
                            )}
                            <button onClick={() => handleDelete(review.id)} className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded">
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {reviews.length === 0 && <p className="text-slate-500 text-center py-10">No reviews found.</p>}
        </div>
    );
}
