"use client";

import { ImagePlus, Pencil, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { detectTextDir } from "@/lib/utils";
import { Button, Card, Spinner, Textarea } from "@/components/ui";
import { useCreatePost } from "./hooks/useCreatePost";
import { useCopy } from "@/components/providers/CopyProvider";
import { ImageEditorModal } from "./components/ImageEditorModal";

/** Composer for signed-in users. Visitors don't see it; they can log in from the navbar. */
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
        handlePaste,
        updateEditedImage,
        removeImage,
        handleSubmit
    } = useCreatePost();
    const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
    const t = useCopy();

    if (!user) return null;

    return (
        <Card>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onPaste={handlePaste}
                    placeholder={t("home.composerPlaceholder")}
                    aria-label="Post content"
                    dir={detectTextDir(content)}
                    rows={3}
                    className="resize-none"
                />

                {images.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative size-20 overflow-hidden rounded-control border border-border bg-surface-hover">
                                <Image src={img} alt={`Upload ${idx + 1}`} fill sizes="80px" className="object-cover" />
                                <div className="absolute right-1 top-1 flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setEditingImageIndex(idx)}
                                        aria-label={`Edit image ${idx + 1}`}
                                        className="flex size-6 items-center justify-center rounded-full bg-overlay text-foreground hover:bg-background"
                                    >
                                        <Pencil className="size-3" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        aria-label={`Remove image ${idx + 1}`}
                                        className="flex size-6 items-center justify-center rounded-full bg-overlay text-foreground hover:bg-background"
                                    >
                                        <X className="size-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={images.length >= 4 || isUploading}
                    >
                        {isUploading ? <Spinner className="size-4" /> : <ImagePlus />}
                        {t("home.composerPhotos")} {images.length > 0 && `${images.length}/4`}
                    </Button>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    <span className="text-xs text-subtle">
                        {isAdmin ? t("home.composerAdminHint") : t("home.composerUserHint")}
                    </span>
                    <Button
                        type="submit"
                        size="sm"
                        className="ml-auto"
                        disabled={(!content.trim() && images.length === 0) || isSubmitting || isUploading}
                    >
                        {isSubmitting && <Spinner className="size-4 text-primary-foreground" />}
                        {isAdmin ? t("home.composerPublish") : t("home.composerPost")}
                    </Button>
                </div>
            </form>

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
        </Card>
    );
}
