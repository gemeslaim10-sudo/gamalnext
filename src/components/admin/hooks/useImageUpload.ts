import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { openCloudinaryWidget, cloudinaryConfig } from "@/lib/cloudinary";

export function useImageUpload(onChange: (value: string) => void) {
    const [loading, setLoading] = useState(false);

    const uploadFile = useCallback(async (file: File) => {
        if (!cloudinaryConfig.cloudName) {
            toast.error("Cloudinary is not configured correctly");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Uploading...");
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", cloudinaryConfig.uploadPreset || "ml_default");

            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            onChange(data.secure_url);
            toast.success("Uploaded successfully!", { id: toastId });
        } catch (err) {
            toast.error("Upload failed", { id: toastId });
        } finally {
            setLoading(false);
        }
    }, [onChange]);

    const handleUpload = useCallback(() => {
        setLoading(true);
        openCloudinaryWidget(
            (url) => {
                const singleUrl = Array.isArray(url) ? url[0] : url;
                if (singleUrl) {
                    onChange(singleUrl);
                }
                setLoading(false);
            },
            (error) => {
                toast.error(error.message || "Failed to open upload widget");
                setLoading(false);
            }
        );
    }, [onChange]);

    const handlePaste = useCallback(async (e: React.ClipboardEvent | ClipboardEvent) => {
        const clipboardData = (e as ClipboardEvent).clipboardData || (e as React.ClipboardEvent).clipboardData;
        if (!clipboardData) return;

        const items = clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    e.preventDefault();
                    await uploadFile(file);
                    return;
                }
            }
        }

        const text = clipboardData.getData("text/plain")?.trim();
        if (text && /^https?:\/\/.+\.(png|jpe?g|gif|svg|webp|avif|bmp|ico|tiff?|jfif)/i.test(text)) {
            e.preventDefault();
            onChange(text);
            toast.success("Image URL pasted!");
            return;
        }

        if (text && /^https?:\/\//.test(text)) {
            e.preventDefault();
            onChange(text);
            toast.success("URL pasted!");
            return;
        }
    }, [uploadFile, onChange]);

    const handleSmartPaste = useCallback(async () => {
        try {
            if (navigator.clipboard && typeof navigator.clipboard.read === 'function') {
                try {
                    const clipboardItems = await navigator.clipboard.read();
                    for (const item of clipboardItems) {
                        const imageType = item.types.find(t => t.startsWith('image/'));
                        if (imageType) {
                            const blob = await item.getType(imageType);
                            const file = new File([blob], `paste-${Date.now()}.${imageType.split('/')[1]}`, { type: imageType });
                            await uploadFile(file);
                            return;
                        }
                    }
                } catch {
                    // Fallback to text
                }
            }

            const text = await navigator.clipboard.readText();
            if (!text?.trim()) {
                toast.error("Clipboard is empty");
                return;
            }

            const trimmed = text.trim();
            if (/^https?:\/\//.test(trimmed)) {
                onChange(trimmed);
                toast.success("URL pasted!");
            } else if (/^data:image\//.test(trimmed)) {
                onChange(trimmed);
                toast.success("Image data pasted!");
            } else {
                toast.error("No image or URL found in clipboard");
            }
        } catch (err) {
            toast.error("Cannot access clipboard. Try Ctrl+V instead.");
        }
    }, [uploadFile, onChange]);

    return {
        loading,
        uploadFile,
        handleUpload,
        handlePaste,
        handleSmartPaste
    };
}
