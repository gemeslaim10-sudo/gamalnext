"use client";

import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEditArticle } from "./useEditArticle";
import { EditArticleForm } from "./components/EditArticleForm";

export default function EditArticlePage({ params }: { params: { id: string } }) {
    const { user, loading, saving, formData, setFormData, handleSubmit } = useEditArticle(params.id);

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-6">
                <div className="text-2xl font-bold">رجاء تسجيل الدخول أولاً</div>
                <p className="text-slate-400">يجب عليك تسجيل الدخول لتتمكن من تعديل المقالات</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-4xl mx-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-center gap-4 mb-6">
                        <Link
                            href={`/articles/${params.id}`}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white">تعديل المقال ✏️</h1>
                            <p className="text-slate-400 mt-2">قم بتحديث محتوى المقال</p>
                        </div>
                    </div>

                    <EditArticleForm
                        formData={formData}
                        setFormData={setFormData}
                        saving={saving}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
            <Toaster />
        </div>
    );
}
