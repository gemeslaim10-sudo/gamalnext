'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Star, Send, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AddReview({ onAdded }: { onAdded?: () => void }) {
    const { user } = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [guestName, setGuestName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user && !guestName.trim()) {
            toast.error("يرجى إدخال الاسم للمتابعة");
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, "reviews"), {
                uid: user ? user.uid : "guest",
                userName: user ? (user.displayName || "Anonymous") : guestName,
                userImage: user ? (user.photoURL || "") : "",
                rating,
                comment,
                status: "pending", // Default pending approval
                createdAt: serverTimestamp(),
                isGuest: !user
            });
            toast.success("تم استلام التقييم بنجاح، قيد المراجعة.");
            setComment("");
            setGuestName("");
            setRating(5);
            if (onAdded) onAdded();
        } catch (e) {
            toast.error("تعذر إرسال التقييم، يرجى المحاولة لاحقاً");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card border border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-transparent opacity-50"></div>

            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="bg-yellow-500/10 p-2 rounded-xl">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                </div>
                مشاركة التقييم الفني
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">درجة التقييم</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`w-8 h-8 transition-colors ${rating >= star ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-slate-700'}`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {!user && (
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">الاسم الكامل</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 pl-12 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                                placeholder="يرجى كتابة الاسم..."
                            />
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">الانطباع العام والملاحظات</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        rows={4}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none placeholder:text-slate-600"
                        placeholder="يرجى تدوين الملاحظات هنا..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/25 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 active:scale-[0.98]"
                >
                    <Send className="w-5 h-5" />
                    {loading ? "جاري المعالجة..." : "اعتماد وإرسال التقييم"}
                </button>
            </form>
        </div>
    );
}
