"use client";

import React, { useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { detectTextDir } from "@/lib/utils";
import { ImageEditorModal } from "@/components/feed/components/ImageEditorModal";
import { useEditPost } from "./hooks/useEditPost";
import { EditPostMedia } from "./components/EditPostMedia";
import { EditPostHeader } from "./components/EditPostHeader";
import { EditPostControls } from "./components/EditPostControls";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        loading,
        post,
        content,
        setContent,
        images,
        isSubmitting,
        isUploading,
        isDeleting,
        uploadFiles,
        updateEditedImage,
        removeImage,
        handleUpdate,
        handleDelete
    } = useEditPost(id);

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
            <EditPostHeader onBack={() => router.back()} />

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

                    <EditPostMedia
                        images={images}
                        onEditImage={setEditingImageIndex}
                        onRemoveImage={removeImage}
                    />
                    
                    <EditPostControls
                        imagesCount={images.length}
                        isUploading={isUploading}
                        isSubmitting={isSubmitting}
                        isDeleting={isDeleting}
                        isFormEmpty={!content.trim() && images.length === 0}
                        onAddImageClick={() => fileInputRef.current?.click()}
                        onDelete={handleDelete}
                    />

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                    />
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
