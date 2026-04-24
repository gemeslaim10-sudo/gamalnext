"use client";

import { CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import { useAdminPosts } from "./hooks/useAdminPosts";

export default function AdminPostsPage() {
    const { posts, loading, handleUpdateStatus, handleDelete } = useAdminPosts();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold text-white">Community Posts Moderation</h1>
                <p className="text-slate-400 text-sm mt-1">Review, approve, or reject posts submitted by users for the Explore feed.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin"></div>
                </div>
            ) : posts.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Posts Found</h3>
                    <p className="text-slate-400">Users haven't submitted any posts yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {posts.map(post => (
                        <div key={post.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white">{post.userName}</span>
                                        <span className="text-xs text-slate-500">({post.userEmail})</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        post.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                        post.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    }`}>
                                        {post.status}
                                    </span>
                                </div>
                                <p className="text-slate-300 bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
                                    {post.content}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2 md:flex-col w-full md:w-auto shrink-0">
                                {post.status !== 'approved' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(post.id, "approved")}
                                        className="flex-1 md:w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg transition-colors"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Approve
                                    </button>
                                )}
                                {post.status !== 'rejected' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(post.id, "rejected")}
                                        className="flex-1 md:w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition-colors"
                                    >
                                        <XCircle className="w-4 h-4" /> Reject
                                    </button>
                                )}
                                <button 
                                    onClick={() => handleDelete(post.id)}
                                    className="flex-1 md:w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
