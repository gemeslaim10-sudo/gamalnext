import { useState, useCallback, useRef } from "react";
import { openCloudinaryWidget, cloudinaryConfig } from "@/lib/cloudinary";
import toast from "react-hot-toast";

export function useMultiImageUpload(value: string[], onChange: (urls: string[]) => void) {
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const uploadFile = useCallback(async (file: File) => {
        if (!cloudinaryConfig.cloudName) {
            toast.error("إعدادات Cloudinary مش مظبوطة");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("جاري رفع الصورة…");
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", cloudinaryConfig.uploadPreset || "ml_default");

            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("الرفع ماتمّش");
            const data = await res.json();
            onChange([...value, data.secure_url]);
            toast.success("اترفعت بنجاح", { id: toastId });
        } catch {
            toast.error("الرفع ماتمّش", { id: toastId });
        } finally {
            setLoading(false);
        }
    }, [onChange, value]);

    const handleUpload = () => {
        setLoading(true);
        openCloudinaryWidget(
            (urls) => {
                const newUrls = Array.isArray(urls) ? urls : [urls];
                onChange([...value, ...newUrls]);
                setLoading(false);
            },
            (error) => {
                toast.error(error.message || "فشل فتح نافذة الرفع");
                setLoading(false);
            },
            { multiple: true }
        );
    };

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
            onChange([...value, text]);
            toast.success("اتلزق رابط الصورة");
            return;
        }

        if (text && /^https?:\/\//.test(text)) {
            e.preventDefault();
            onChange([...value, text]);
            toast.success("اتلزق الرابط");
            return;
        }
    }, [uploadFile, onChange, value]);

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
                } catch {}
            }

            const text = await navigator.clipboard.readText();
            if (!text?.trim()) {
                toast.error("الحافظة فاضية");
                return;
            }

            const trimmed = text.trim();
            if (/^https?:\/\//.test(trimmed) || /^data:image\//.test(trimmed)) {
                onChange([...value, trimmed]);
                toast.success("اتلزق الرابط");
            } else {
                toast.error("مفيش صورة أو رابط في الحافظة");
            }
        } catch {
            toast.error("مش قادر أوصل للحافظة. جرّب Ctrl+V");
        }
    }, [uploadFile, onChange, value]);

    const removeImage = (indexToRemove: number) => {
        onChange(value.filter((_, index) => index !== indexToRemove));
    };

    return {
        loading,
        containerRef,
        handleUpload,
        handlePaste,
        handleSmartPaste,
        removeImage
    };
}
