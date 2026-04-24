import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { cloudinaryConfig } from "@/lib/cloudinary";

export function useCreatePost() {
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                userId: user?.uid,
                userName: user?.displayName || "User",
                userEmail: user?.email,
                content: content.trim(),
                mediaUrl: images[0] || null,
                gallery: images,
                mediaType: images.length > 0 ? "image" : null,
                status: "pending",
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

    return {
        user,
        content,
        setContent,
        isSubmitting,
        images,
        isUploading,
        fileInputRef,
        handleImageUpload,
        removeImage,
        handleSubmit
    };
}
