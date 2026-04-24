"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { Image as ImageIcon, Send, Loader2, X } from "lucide-react";
import { cloudinaryConfig } from "@/lib/cloudinary";
import Image from "next/image";
import { detectTextDir } from "@/lib/utils";

export default function CreatePost() {
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!user) {
        return (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 text-center text-slate-400">
                Please <button onClick={() => document.dispatchEvent(new CustomEvent('open-auth-modal'))} className="text-blue-400 font-bold hover:underline">Sign In</button> to share a post.
            </div>
        );
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        if (images.length + files.length > 3) {
            toast.error("You can upload a maximum of 3 images.");
            return;
        }

        setIsUploading(true);
        const newUrls: string[] = [];

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", cloudinaryConfig.uploadPreset || "ml_default");

                const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`, {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) throw new Error("Upload failed");
                const data = await res.json();
                newUrls.push(data.secure_url);
            }

            setImages(prev => [...prev, ...newUrls]);
        } catch (error) {
            console.error("Image upload error:", error);
            toast.error("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && images.length === 0) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "posts"), {
                userId: user.uid,
                userName: user.displayName || "User",
                userEmail: user.email,
                content: content.trim(),
                mediaUrl: images[0] || null,
                gallery: images,
                mediaType: images.length > 0 ? "image" : null,
                status: "pending", // Requires admin approval
                createdAt: serverTimestamp(),
            });
            
            setContent("");
            setImages([]);
            toast.success("Post submitted for approval! It will appear once an admin approves it.", {
                duration: 5000,
                icon: '⏳'
            });
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Failed to submit post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        
                        <div className="text-xs text-amber-500/70 hidden sm:flex items-center gap-2 border-l border-slate-800 pl-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50"></span>
                            Requires admin approval
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={(!content.trim() && images.length === 0) || isSubmitting || isUploading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
}
