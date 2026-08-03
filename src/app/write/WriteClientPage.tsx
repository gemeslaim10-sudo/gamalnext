"use client";

import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { Save, Loader2 } from "lucide-react";
import { LoginPrompt } from "@/components/auth/LoginPrompt";

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


    if (!user) return (
        <LoginPrompt 
            title="Publish Article" 
            description="Sign in to write and publish your article." 
        />
    );

    return (
        <div className="min-h-screen pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-4xl mx-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                    <h1 className="text-3xl font-bold text-white mb-2">Write a New Article 📝</h1>
                    <p className="text-slate-400 mb-8">Share your knowledge with the community</p>

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
                            {loading ? <Loader2 className="animate-spin" /> : <><Save /> Publish Article</>}
                        </button>
                    </form>
                </div>
            </div>
            <Toaster />
        </div>
    );
}
