"use client";

import { Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { useComments } from "./hooks/useComments";

export default function CommentSection({ articleId }: { articleId: string }) {
    const {
        user,
        comments,
        newComment,
        setNewComment,
        submitting,
        handleSubmit,
        handleDelete
    } = useComments(articleId);

    return (
        <div className="mt-16 border-t border-slate-800 pt-10">
            <h3 className="text-2xl font-bold text-white mb-8">Comments ({comments.length})</h3>

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
                            placeholder="Share your thoughts..."
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
                    <p className="text-slate-400 mb-4">Log in to join the discussion</p>
                    <span className="text-sm text-slate-500">Use the login button in the top menu</span>
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
                                {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString('en-US') : 'Just now'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
