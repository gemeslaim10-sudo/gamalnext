"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { toast, Toaster } from "react-hot-toast";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { Save, Loader2 } from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";

import { useWriteArticle } from "./useWriteArticle";
import { TitleInput } from "./components/TitleInput";
import { ImageHelper } from "./components/ImageHelper";
import { ArticleContent } from "./components/ArticleContent";

export default function WriteArticlePage() {
    const {
        user,
        formData,
        setFormData,
        imageQuery,
        loading,
        generating,
        regeneratingImage,
        enhancingTitle,
        handleAiImageRegenerate,
        handleEnhanceTitle,
        handleAiGenerate,
        handleSubmit
    } = useWriteArticle();

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    if (!user) return (
        <>
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-6">
                <div className="text-2xl font-bold">رجاء تسجيل الدخول أولاً</div>
                <p className="text-slate-400">يجب عليك تسجيل الدخول لتتمكن من كتابة ونشر المقالات</p>
                <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                >
                    تسجيل الدخول
                </button>
            </div>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );

    return (
        <div className="min-h-screen pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-4xl mx-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                    <h1 className="text-3xl font-bold text-white mb-2">كتابة مقال جديد 📝</h1>
                    <p className="text-slate-400 mb-8">شارك خبراتك ومعرفتك مع المجتمع</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <TitleInput
                            formData={formData}
                            setFormData={setFormData}
                            enhancingTitle={enhancingTitle}
                            generating={generating}
                            handleEnhanceTitle={handleEnhanceTitle}
                            handleAiGenerate={handleAiGenerate}
                        />

                        <MediaUpload
                            items={formData.media}
                            onChange={(media) => setFormData({ ...formData, media })}
                        />

                        <ImageHelper
                            formData={formData}
                            setFormData={setFormData}
                            regeneratingImage={regeneratingImage}
                            imageQuery={imageQuery}
                            handleAiImageRegenerate={handleAiImageRegenerate}
                        />

                        <ArticleContent
                            formData={formData}
                            setFormData={setFormData}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><Save /> إرسال للنشر</>}
                        </button>
                    </form>
                </div>
            </div>
            <Toaster />
        </div>
    );
}
