"use client";

import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { Send, Trash2, User } from "lucide-react";
import Link from "next/link";

type Comment = {
    id: string;
    userId: string;
    userName: string;
    userPhoto: string;
    content: string;
    createdAt: any;
}

export default function CommentSection({ articleId }: { articleId: string }) {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const q = query(
            collection(db, "comments"),
            where("articleId", "==", articleId),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Comment));
            setComments(data);
        }, (error) => {
            console.error("Comments subscription error:", error);
            if (error.code === 'failed-precondition') {
                toast.error("مطلوب إنشاء Index للتعليقات (راجع الكونسول)");
            }
        });

        return () => unsubscribe();
    }, [articleId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("يجب تسجيل الدخول للتعليق");
            return;
        }
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            await addDoc(collection(db, "comments"), {
                articleId,
                userId: user.uid,
                userName: user.displayName || "User",
                userPhoto: user.photoURL || "",
                content: newComment,
                createdAt: serverTimestamp()
            });
            setNewComment("");
            toast.success("تم إضافة تعليقك");
        } catch (e: any) {
            console.error("Error submitting comment:", e);
            if (e.code === 'permission-denied') {
                toast.error("آسف، ليس لديك صلاحية للتعليق. يرجى تسجيل الدخول مرة أخرى.");
            } else {
                toast.error("حدث خطأ أثناء نشر التعليق.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("حذف هذا التعليق؟")) return;
        try {
            await deleteDoc(doc(db, "comments", id));
            toast.success("تم الحذف");
        } catch (e) {
            toast.error("خطأ في الحذف");
        }
    };

    return (
        <div className="mt-16 border-t border-slate-800 pt-10">
            <h3 className="text-2xl font-bold text-white mb-8">التعليقات ({comments.length})</h3>

            {/* Input */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-12 flex gap-4">
                    <div className="flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                            alt={user.displayName || "User"}
                            className="w-12 h-12 rounded-full border border-slate-700"
                        />
                    </div>
                    <div className="flex-1 relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="شاركنا رأيك..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none min-h-[100px]"
                            required
                        />
                        <button
                            type="submit"
                            disabled={submitting}
                            className="absolute bottom-4 left-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center mb-12">
                    <p className="text-slate-400 mb-4">سجل الدخول للمشاركة في النقاش</p>
                    {/* Trigger Auth Modal logic needs context or parent passing. For now strictly informational or rely on Navbar login */}
                    <span className="text-sm text-slate-500">استخدم زر تسجيل الدخول في القائمة العلوية</span>
                </div>
            )}

            {/* List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 group">
                        <Link href={`/users/${comment.userId}`} className="flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={comment.userPhoto || `https://ui-avatars.com/api/?name=${comment.userName}`}
                                alt={comment.userName}
                                className="w-10 h-10 rounded-full border border-slate-800"
                            />
                        </Link>
                        <div className="flex-1">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-4 relative">
                                <div className="flex justify-between items-start mb-2">
                                    <Link href={`/users/${comment.userId}`} className="font-bold text-white text-sm hover:text-blue-400">
                                        {comment.userName}
                                    </Link>
                                    {user && (user.uid === comment.userId || user.email === 'montasrrm@gmail.com') && (
                                        <button onClick={() => handleDelete(comment.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed">{comment.content}</p>
                            </div>
                            <span className="text-xs text-slate-600 mt-1 block mr-2">
                                {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString('ar-EG') : 'Just now'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
