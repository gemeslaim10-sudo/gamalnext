import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { loadFirestore } from "@/lib/firebase-app";
import { toast } from "react-hot-toast";
import { refreshSite } from "@/lib/refreshSite";
import { reportEvent } from "@/lib/reportEvent";
import { uploadToCloudinary } from "@/lib/cloudinary/upload";
import { ALLOWED_ADMINS } from "@/lib/constants";
import { useCopy } from "@/components/providers/CopyProvider";
export function useCreatePost() {
    const { user } = useAuth();
    const t = useCopy();
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isAdmin = !!(user?.email && ALLOWED_ADMINS.includes(user.email));
    // Shared upload logic for both file input and clipboard paste
    const uploadFiles = async (files: File[]) => {
        if (!files.length) return;
        if (images.length + files.length > 4) {
            toast.error(t("home.maxImages"));
            return;
        }
        setIsUploading(true);
        const newUrls: string[] = [];
        try {
            for (const file of files) {
                const url = await uploadToCloudinary(file);
                newUrls.push(url);
            }
            setImages(prev => [...prev, ...newUrls]);
            if (newUrls.length > 0) {
                toast.success(t("home.imagesAttached", { count: newUrls.length }), { duration: 2000 });
            }
        } catch (error) {
            console.error("Image upload error:", error);
            toast.error(t("home.uploadFailed"));
        } finally {
            setIsUploading(false);
        }
    };
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        await uploadFiles(files);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };
    // Handle Ctrl+V paste of images from clipboard
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
            e.preventDefault(); // Prevent pasting image data as text
            await uploadFiles(imageFiles);
        }
    };
    const updateEditedImage = async (indexToUpdate: number, editedFile: File) => {
        setIsUploading(true);
        try {
            const url = await uploadToCloudinary(editedFile);
            setImages(prev => {
                const newImages = [...prev];
                newImages[indexToUpdate] = url;
                return newImages;
            });
            toast.success(t("home.imageUpdated"));
        } catch (error) {
            console.error("Image update error:", error);
            toast.error(t("home.imageUpdateFailed"));
        } finally {
            setIsUploading(false);
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
            const { db, addDoc, collection, serverTimestamp } = await loadFirestore();
            // Posts are public, so they carry the name and photo only — never the email
            const postRef = await addDoc(collection(db, "posts"), {
                userId: user?.uid,
                userName: user?.displayName || "User",
                userPhoto: user?.photoURL || null,
                content: content.trim(),
                mediaUrl: images[0] || null,
                gallery: images,
                mediaType: images.length > 0 ? "image" : null,
                status: isAdmin ? "approved" : "pending",
                createdAt: serverTimestamp(),
            });
            
            setContent("");
            setImages([]);
            if (isAdmin) {
                // Published right away: put it in the cached home feed (posts waiting for review don't need this)
                void refreshSite({ postId: postRef.id });
                toast.success(t("home.postPublished"), {
                    duration: 3000,
                });
            } else {
                // Waiting for review: the owner can get an email about it
                reportEvent({ event: "post.pending", id: postRef.id });
                toast.success(t("home.postPending"), {
                    duration: 5000,
                });
            }
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error(t("home.postFailed"));
        } finally {
            setIsSubmitting(false);
        }
    };
    return {
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
    };
}
