"use client";

import { useState, useRef, useEffect } from "react";
import { Image as ImageIcon, Loader2, X, Save, Trash2, Edit2 } from "lucide-react";
import Image from "next/image";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { cloudinaryConfig } from "@/lib/cloudinary";
import { detectTextDir } from "@/lib/utils";
import type { FeedItem } from "../types";
import { ImageEditorModal } from "./ImageEditorModal";

interface EditPostModalProps {
    item: FeedItem;
    isOpen: boolean;
    onClose: () => void;
}

export function EditPostModal({ item, isOpen, onClose }: EditPostModalProps) {
    const [content, setContent] = useState(item.fullContent || item.description || "");
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize images when modal opens
    useEffect(() => {
        if (isOpen) {
            setContent(item.fullContent || item.description || "");
            const initialImages = [];
            if (item.gallery && item.gallery.length > 0) {
                initialImages.push(...item.gallery);
            } else if (item.imageUrl) {
                initialImages.push(item.imageUrl);
            }
            setImages(initialImages);
        }
    }, [isOpen, item]);

    if (!isOpen) return null;

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
            const postRef = doc(db, "posts", item.id);
            await updateDoc(postRef, {
                content: content.trim(),
                mediaUrl: images[0] || null,
                gallery: images,
                mediaType: images.length > 0 ? "image" : null,
            });
            
            toast.success("Post updated successfully!");
            onClose();
            // Optional: You might want to refresh the feed here or let real-time listeners handle it
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
            await deleteDoc(doc(db, "posts", item.id));
            toast.success("Post deleted successfully!");
            onClose();
            // The post will disappear on the next feed refresh
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                    <h2 className="text-lg font-bold text-white">Edit Post</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleUpdate}>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onPaste={handlePaste}
                            placeholder="What's on your mind? Paste images with Ctrl+V..."
                            dir={detectTextDir(content)}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none transition-all"
                            rows={5}
                        />

                        {/* Image Previews */}
                        {images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-700 group">
                                        <Image src={img} alt={`Upload ${idx + 1}`} fill sizes="96px" className="object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
                                            <button
                                                type="button"
                                                onClick={() => setEditingImageIndex(idx)}
                                                className="bg-blue-500/80 hover:bg-blue-500 text-white rounded-full p-1.5 transition-colors"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1.5 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={images.length >= 4 || isUploading}
                                    className="flex items-center gap-2 text-slate-400 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
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
                            
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isDeleting || isSubmitting || isUploading}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full font-medium transition-all disabled:opacity-50"
                                >
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    Delete
                                </button>
                                <button
                                    type="submit"
                                    disabled={(!content.trim() && images.length === 0) || isSubmitting || isUploading}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
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
