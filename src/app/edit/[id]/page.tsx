"use client";

import { useState, useRef, useEffect } from "react";
import { Image as ImageIcon, Loader2, X, Save, Trash2, Edit2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { cloudinaryConfig } from "@/lib/cloudinary";
import { detectTextDir } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ALLOWED_ADMINS } from "@/lib/constants";
import { ImageEditorModal } from "@/components/feed/components/ImageEditorModal";
import type { FeedItem } from "@/components/feed/types";

export default function EditPostPage({ params }: { params: { id: string } }) {
    const { user } = useAuth();
    const router = useRouter();
    
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<FeedItem | null>(null);
    const [content, setContent] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, "posts", params.id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    
                    // Permission Check
                    const isAdmin = ALLOWED_ADMINS.includes(user.email || "");
                    const isOwner = user.uid === data.userId;
                    if (!isAdmin && !isOwner) {
                        toast.error("You don't have permission to edit this post");
                        router.push("/");
                        return;
                    }

                    const loadedPost = { id: docSnap.id, ...data } as unknown as FeedItem;
                    setPost(loadedPost);
                    setContent(data.content || "");
                    
                    const initialImages = [];
                    if (data.gallery && data.gallery.length > 0) {
                        initialImages.push(...data.gallery);
                    } else if (data.mediaUrl) {
                        initialImages.push(data.mediaUrl);
                    }
                    setImages(initialImages);
                } else {
                    toast.error("Post not found");
                    router.push("/");
                }
            } catch (err) {
                console.error("Error fetching post:", err);
                toast.error("Failed to load post");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [params.id, user, router]);

    const uploadFiles = async (files: File[]) => {
        if (!files.length) return;

        if (images.length + files.length > 4) {
            toast.error("You can upload a maximum of 4 images.");
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
            if (newUrls.length > 0) {
                toast.success(`${newUrls.length} image${newUrls.length > 1 ? 's' : ''} attached!`, { icon: '📎', duration: 2000 });
            }
        } catch (error) {
            console.error("Image upload error:", error);
            toast.error("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const updateEditedImage = async (indexToUpdate: number, editedFile: File) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", editedFile);
            formData.append("upload_preset", cloudinaryConfig.uploadPreset || "ml_default");

            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            
            setImages(prev => {
                const newImages = [...prev];
                newImages[indexToUpdate] = data.secure_url;
                return newImages;
            });
            toast.success("Image updated successfully!");
        } catch (error) {
            console.error("Image update error:", error);
            toast.error("Failed to update edited image.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        await uploadFiles(files);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handlePaste = async (e: React.ClipboardEvent) => {
        const clipboardItems = e.clipboardData?.items;
        if (!clipboardItems) return;

        const imageFiles: File[] = [];
        for (let i = 0; i < clipboardItems.length; i++) {
            const item = clipboardItems[i];
            if (item.type.startsWith("image/")) {
                const file = item.getAsFile();
                if (file) imageFiles.push(file);
            }
        }

        if (imageFiles.length > 0) {
            e.preventDefault();
            await uploadFiles(imageFiles);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && images.length === 0) return;

        setIsSubmitting(true);
        try {
            const postRef = doc(db, "posts", params.id);
            await updateDoc(postRef, {
                content: content.trim(),
                mediaUrl: images[0] || null,
                gallery: images,
                mediaType: images.length > 0 ? "image" : null,
            });
            
            toast.success("Post updated successfully!");
            router.push("/");
        } catch (error) {
            console.error("Error updating post:", error);
            toast.error("Failed to update post.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        
        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, "posts", params.id));
            toast.success("Post deleted successfully!");
            router.push("/");
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!post) return null;

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col animate-in fade-in duration-300 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-6 py-4 flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-white">Edit Post</h1>
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-6 mt-4">
                <form onSubmit={handleUpdate} className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-4 sm:p-6 shadow-xl">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onPaste={handlePaste}
                        placeholder="What's on your mind? Paste images with Ctrl+V..."
                        dir={detectTextDir(content)}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none transition-all text-lg"
                        rows={6}
                    />

                    {/* Image Previews */}
                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-6">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-slate-700 group shadow-lg">
                                    <Image src={img} alt={`Upload ${idx + 1}`} fill sizes="128px" className="object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                        <button
                                            type="button"
                                            onClick={() => setEditingImageIndex(idx)}
                                            className="bg-blue-500 hover:bg-blue-400 text-white rounded-full p-2.5 transition-colors shadow-lg"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="bg-red-500 hover:bg-red-400 text-white rounded-full p-2.5 transition-colors shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 pt-6 border-t border-slate-800 gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={images.length >= 4 || isUploading}
                                className="flex items-center gap-2 text-slate-400 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
                                <span className="text-sm font-medium">{images.length}/4 Images</span>
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>
                        
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting || isSubmitting || isUploading}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full font-medium transition-all disabled:opacity-50"
                            >
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                Delete
                            </button>
                            <button
                                type="submit"
                                disabled={(!content.trim() && images.length === 0) || isSubmitting || isUploading}
                                className="flex-2 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Post
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <ImageEditorModal
                isOpen={editingImageIndex !== null}
                imageUrl={editingImageIndex !== null ? images[editingImageIndex] : ""}
                onClose={() => setEditingImageIndex(null)}
                onSave={async (file) => {
                    if (editingImageIndex !== null) {
                        await updateEditedImage(editingImageIndex, file);
                        setEditingImageIndex(null);
                    }
                }}
            />
        </div>
    );
}
