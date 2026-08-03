import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { uploadToCloudinary } from "@/lib/cloudinary/upload";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ALLOWED_ADMINS } from "@/lib/constants";
import type { FeedItem } from "@/components/feed/types";
import { updatePostData, deletePostData, fetchPostData } from "./api";
export function useEditPost(postId: string) {
    const { user } = useAuth();
    const router = useRouter();
    
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<FeedItem | null>(null);
    const [content, setContent] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    useEffect(() => {
        const fetchPost = async () => {
            if (!user) return;
            try {
                const data = await fetchPostData(postId);
                
                if (data) {
                    const isAdmin = ALLOWED_ADMINS.includes(user.email || "");
                    const isOwner = user.uid === data.userId;
                    if (!isAdmin && !isOwner) {
                        toast.error("You don't have permission to edit this post");
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
    }, [postId, user, router]);
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
                const url = await uploadToCloudinary(file);
                newUrls.push(url);
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
            const url = await uploadToCloudinary(editedFile);
            setImages(prev => {
                const newImages = [...prev];
                newImages[indexToUpdate] = url;
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
    const removeImage = (indexToRemove: number) => {
        setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && images.length === 0) return;
        setIsSubmitting(true);
        try {
            await updatePostData(postId, content, images);
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
            await deletePostData(postId);
            toast.success("Post deleted successfully!");
            router.push("/");
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post.");
        } finally {
            setIsDeleting(false);
        }
    };
    return {
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
    };
}
