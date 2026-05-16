"use client";

import { Image as ImageIcon, Send, Loader2, X, Shield } from "lucide-react";
import Image from "next/image";
import { detectTextDir } from "@/lib/utils";
import { useCreatePost } from "./hooks/useCreatePost";

export default function CreatePost() {
    const {
        user,
        content,
        setContent,
        isSubmitting,
        isAdmin,
        images,
        isUploading,
        fileInputRef,
        handleImageUpload,
        removeImage,
        handleSubmit
    } = useCreatePost();

    if (!user) {
        return (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 text-center text-slate-400">
                Please <button onClick={() => document.dispatchEvent(new CustomEvent('open-auth-modal'))} className="text-blue-400 font-bold hover:underline">Sign In</button> to share a post.
            </div>
        );
    }

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-4 sm:p-6 mb-8 shadow-xl">
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind? Share an idea or ask a question..."
                    dir={detectTextDir(content)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none transition-all"
                    rows={3}
                />

                {/* Image Previews */}
                {images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700 group">
                                <Image src={img} alt={`Upload ${idx + 1}`} fill className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="flex items-center justify-between mt-4 border-t border-slate-800 pt-4">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={images.length >= 3 || isUploading}
                            className="flex items-center gap-2 text-slate-400 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                            <span className="text-sm font-medium">{images.length}/3 Images</span>
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        
                        {isAdmin ? (
                            <div className="text-xs text-emerald-400/80 hidden sm:flex items-center gap-2 border-l border-slate-800 pl-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Publishes instantly
                            </div>
                        ) : (
                            <div className="text-xs text-amber-500/70 hidden sm:flex items-center gap-2 border-l border-slate-800 pl-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50"></span>
                                Requires admin approval
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={(!content.trim() && images.length === 0) || isSubmitting || isUploading}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            isAdmin 
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                                : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : isAdmin ? <Shield className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                        {isAdmin ? 'Publish' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}

