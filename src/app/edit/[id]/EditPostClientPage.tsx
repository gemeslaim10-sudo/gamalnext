"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { detectTextDir } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { LoginPrompt } from "@/components/auth/LoginPrompt";
import { useCopy } from "@/components/providers/CopyProvider";
import { BackLink, Card, EmptyState, LoadingBlock, Page, PageHeader, Textarea } from "@/components/ui";
import { ImageEditorModal } from "@/components/feed/components/ImageEditorModal";
import { useEditPost } from "./hooks/useEditPost";
import { EditPostMedia } from "./components/EditPostMedia";
import { EditPostControls } from "./components/EditPostControls";

export default function EditPostClientPage({ id }: { id: string }) {
    const router = useRouter();
    const t = useCopy();
    const { user, loading: authLoading } = useAuth();
    const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        loading,
        loadFailed,
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

    // useEditPost waits for a user, so a signed-out visitor would otherwise see the spinner forever.
    // While the sign-in check runs, `loading` is still true, so the log in box never flashes.
    if (!authLoading && !user) {
        return <LoginPrompt title={t("account.editLockedTitle")} description={t("account.editLockedDescription")} />;
    }

    if (loading) {
        return (
            <Page>
                <LoadingBlock label={t("account.loading")} />
            </Page>
        );
    }

    // Not found / no permission redirect home; only a failed read stays here
    if (!post) {
        if (!loadFailed) return null;
        return (
            <Page>
                <div className="mx-auto max-w-content">
                    <BackLink onClick={() => router.back()}>{t("account.editBack")}</BackLink>
                    <EmptyState title={t("account.editLoadFailed")} />
                </div>
            </Page>
        );
    }

    return (
        <Page>
            <div className="mx-auto max-w-content">
                <BackLink onClick={() => router.back()}>{t("account.editBack")}</BackLink>
                <PageHeader title={t("account.editTitle")} />

                <Card>
                    <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onPaste={handlePaste}
                            placeholder={t("account.editPlaceholder")}
                            aria-label="Post content"
                            dir={detectTextDir(content)}
                            rows={6}
                            className="resize-none text-base"
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
                </Card>
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
        </Page>
    );
}
