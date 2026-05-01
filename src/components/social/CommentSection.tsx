"use client";

import { Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { useComments } from "./hooks/useComments";
import { useAuth } from "@/context/AuthContext";

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
    const { signInWithGoogle } = useAuth();

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
                <div className="bg-gradient-to-b from-slate-900/80 to-slate-900/40 border border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center text-center mb-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 rotate-3">
                        <svg className="w-8 h-8 text-blue-400 -rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">Join the Discussion</h4>
                    <p className="text-slate-400 mb-8 max-w-md text-lg">Sign in to share your thoughts, ask questions, and connect with the community instantly.</p>
                    <button
                        onClick={signInWithGoogle}
                        className="group bg-white text-slate-900 hover:bg-slate-50 font-bold py-3.5 px-8 rounded-xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
                    >
                        <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                    </button>
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
