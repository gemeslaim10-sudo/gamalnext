import { useState } from "react";
import { toast } from "react-hot-toast";
import type { WriteFormData } from "../types";

export function useAiArticleEnhancer(
    formData: WriteFormData,
    setFormData: React.Dispatch<React.SetStateAction<WriteFormData>>,
    setImageQuery: React.Dispatch<React.SetStateAction<string>>
) {
    const [generating, setGenerating] = useState(false);
    const [regeneratingImage, setRegeneratingImage] = useState(false);
    const [enhancingTitle, setEnhancingTitle] = useState(false);

    const handleAiImageRegenerate = async () => {
        if (!formData.title) return;
        setRegeneratingImage(true);
        toast.loading("جاري البحث عن صورة جديدة...", { id: "img-gen" });

        try {
            const res = await fetch("/api/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: formData.title })
            });

            if (!res.ok) throw new Error("Correction failed");

            const data = await res.json();

            setFormData(prev => ({
                ...prev,
                media: [{ url: data.imageUrl, type: 'image' }]
            }));

            toast.success("تم تحديث الصورة بنجاح! 🎨", { id: "img-gen" });

        } catch {
            toast.error("فشل تحديث الصورة", { id: "img-gen" });
        } finally {
            setRegeneratingImage(false);
        }
    };

    const handleEnhanceTitle = async () => {
        if (!formData.title) return;
        setEnhancingTitle(true);
        toast.loading("جاري تحسين العنوان ...", { id: "enhance-title" });

        try {
            const res = await fetch("/api/enhance-title", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: formData.title })
            });

            const data = await res.json();
            if (data.improvedTitle) {
                setFormData(prev => ({ ...prev, title: data.improvedTitle }));
                toast.success("تم تحسين العنوان! 🚀", { id: "enhance-title" });
            } else {
                throw new Error("Failed");
            }
        } catch {
            toast.error("فشل تحسين العنوان", { id: "enhance-title" });
        } finally {
            setEnhancingTitle(false);
        }
    };

    const handleAiGenerate = async () => {
        if (!formData.title) {
            toast.error("الرجاء كتابة عنوان المقال أولاً");
            return;
        }

        setGenerating(true);
        toast.loading("جاري توليد المقال والصورة بالذكاء الاصطناعي...", { id: "ai-gen" });

        try {
            const res = await fetch("/api/generate-article", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: formData.title })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setFormData(prev => ({
                ...prev,
                content: data.content,
                summary: data.metaDescription, // Populate from API
                tags: data.seoKeywords,       // Populate from API
                media: [{ url: data.imageUrl, type: 'image' }] // Auto-add AI image
            }));
            setImageQuery(data.imageSearchQuery); // Store query for manual options

            toast.success("تم إستحداث المحتوى! 🪄 الرجاء اختيار صورة مناسبة.", { id: "ai-gen" });

        } catch (error: unknown) {
            console.error(error);
            toast.error("حدث خطأ أثناء التوليد: " + (error instanceof Error ? error.message : String(error)), { id: "ai-gen" });
        } finally {
            setGenerating(false);
        }
    };

    return {
        generating,
        regeneratingImage,
        enhancingTitle,
        handleAiImageRegenerate,
        handleEnhanceTitle,
        handleAiGenerate
    };
}
