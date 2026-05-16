import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { cloudinaryConfig } from "@/lib/cloudinary";
import { ALLOWED_ADMINS } from "@/lib/constants";

export function useCreatePost() {
    const { user } = useAuth();
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

    const removeImage = (indexToRemove: number) => {
        setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && images.length === 0) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "posts"), {
                userId: user?.uid,
                userName: user?.displayName || "User",
                userEmail: user?.email,
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
                toast.success("Post published successfully! 🚀", {
                    duration: 3000,
                    icon: '✅'
                });
            } else {
                toast.success("Post submitted for approval! It will appear once an admin approves it.", {
                    duration: 5000,
                    icon: '⏳'
                });
            }
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Failed to submit post. Please try again.");
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
        removeImage,
        handleSubmit
    };
}
