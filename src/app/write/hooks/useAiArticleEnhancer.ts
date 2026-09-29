import { useState } from "react";
import { toast } from "react-hot-toast";
import type { WriteFormData } from "../types";
import { useAuth } from "@/context/AuthContext";
import { useCopy } from "@/components/providers/CopyProvider";

export function useAiArticleEnhancer(
    formData: WriteFormData,
    setFormData: React.Dispatch<React.SetStateAction<WriteFormData>>,
    setImageQuery: React.Dispatch<React.SetStateAction<string>>
) {
    const { user } = useAuth();
    const t = useCopy();
    const [generating, setGenerating] = useState(false);
    const [regeneratingImage, setRegeneratingImage] = useState(false);
    const [enhancingTitle, setEnhancingTitle] = useState(false);

    const handleAiImageRegenerate = async () => {
        if (!formData.title) return;
        setRegeneratingImage(true);
        toast.loading(t("account.writeAiImageLoading"), { id: "img-gen" });

        try {
            const token = user ? await user.getIdToken() : "";
            const res = await fetch("/api/generate-image", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ title: formData.title })
            });

            if (!res.ok) throw new Error("Correction failed");

            const data = await res.json();

            setFormData(prev => ({
                ...prev,
                media: [{ url: data.imageUrl, type: 'image' }]
            }));

            toast.success(t("account.writeAiImageDone"), { id: "img-gen" });

        } catch {
            toast.error(t("account.writeAiImageFailed"), { id: "img-gen" });
        } finally {
            setRegeneratingImage(false);
        }
    };

    const handleEnhanceTitle = async () => {
        if (!formData.title) return;
        setEnhancingTitle(true);
        toast.loading(t("account.writeEnhanceLoading"), { id: "enhance-title" });

        try {
            const token = user ? await user.getIdToken() : "";
            const res = await fetch("/api/enhance-title", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ title: formData.title })
            });

            const data = await res.json();
            if (data.improvedTitle) {
                setFormData(prev => ({ ...prev, title: data.improvedTitle }));
                toast.success(t("account.writeEnhanceDone"), { id: "enhance-title" });
            } else {
                throw new Error("Failed");
            }
        } catch {
            toast.error(t("account.writeEnhanceFailed"), { id: "enhance-title" });
        } finally {
            setEnhancingTitle(false);
        }
    };

    const handleAiGenerate = async () => {
        if (!formData.title) {
            toast.error(t("account.writeTitleRequired"));
            return;
        }

        setGenerating(true);
        toast.loading(t("account.writeGenerateLoading"), { id: "ai-gen" });

        try {
            const token = user ? await user.getIdToken() : "";
            const res = await fetch("/api/generate-article", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
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

            toast.success(t("account.writeGenerateDone"), { id: "ai-gen" });

        } catch (error: unknown) {
            console.error(error);
            toast.error(
                t("account.writeGenerateFailed", { error: error instanceof Error ? error.message : String(error) }),
                { id: "ai-gen" }
            );
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
