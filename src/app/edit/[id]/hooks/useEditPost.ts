import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { uploadToCloudinary } from "@/lib/cloudinary/upload";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ALLOWED_ADMINS } from "@/lib/constants";
import type { FeedItem } from "@/components/feed/types";
import { useCopy } from "@/components/providers/CopyProvider";
import { updatePostData, deletePostData, fetchPostData } from "./api";
export function useEditPost(postId: string) {
    const { user } = useAuth();
    const router = useRouter();
    const t = useCopy();
    
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<FeedItem | null>(null);
    const [content, setContent] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    // The read itself failed (not found / no permission redirect instead)
    const [loadFailed, setLoadFailed] = useState(false);
    useEffect(() => {
        const fetchPost = async () => {
            if (!user) return;
            try {
                const data = await fetchPostData(postId);
                
                if (data) {
                    const isAdmin = ALLOWED_ADMINS.includes(user.email || "");
                    const isOwner = user.uid === data.userId;
                    if (!isAdmin && !isOwner) {
                        toast.error(t("account.editNoPermission"));
                        router.push("/");
                        return;
                    }
                    const loadedPost = data as unknown as FeedItem;
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
                    toast.error(t("account.editNotFound"));
                    router.push("/");
                }
            } catch (err) {
                console.error("Error fetching post:", err);
                toast.error(t("account.editLoadFailed"));
                setLoadFailed(true);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId, user, router, t]);
    const uploadFiles = async (files: File[]) => {
        if (!files.length) return;
        if (images.length + files.length > 4) {
            toast.error(t("account.editMaxImages"));
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
                toast.success(t("account.editImagesAttached", { count: newUrls.length }), { duration: 2000 });
            }
        } catch (error) {
            console.error("Image upload error:", error);
            toast.error(t("account.editUploadFailed"));
        } finally {
            setIsUploading(false);
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
            toast.success(t("account.editImageUpdated"));
        } catch (error) {
            console.error("Image update error:", error);
            toast.error(t("account.editImageUpdateFailed"));
        } finally {
            setIsUploading(false);
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
            await updatePostData(postId, content, images);
            toast.success(t("account.editSaved"));
            router.push("/");
        } catch (error) {
            console.error("Error updating post:", error);
            toast.error(t("account.editSaveFailed"));
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async () => {
        if (!window.confirm(t("account.editDeleteConfirm"))) return;
        
        setIsDeleting(true);
        try {
            await deletePostData(postId);
            toast.success(t("account.editDeleted"));
            router.push("/");
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error(t("account.editDeleteFailed"));
        } finally {
            setIsDeleting(false);
        }
    };
    return {
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
    };
}
