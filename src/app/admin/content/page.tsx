"use client";

import { Save } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useAdminContent } from "./hooks/useAdminContent";

export default function ContentPage() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        isSubmitting,
        loading,
        onSubmit
    } = useAdminContent();

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <Toaster />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">General Content</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Hero Section */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Hero Section</h2>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-400 mb-2">Profile Avatar Image</label>
                        <ImageUpload
                            value={watch("avatarImage")}
                            onChange={(url) => setValue("avatarImage", url)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Main Title (Name)</label>
                            <input
                                {...register("heroTitle")}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Subtitle</label>
                            <input
                                {...register("heroSubtitle")}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Lead Paragraph</label>
                        <textarea
                            {...register("heroDescription")}
                            rows={4}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">WhatsApp Number (No +)</label>
                            <input
                                {...register("whatsappNumber")}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
                >
                    <Save className="w-5 h-5" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
