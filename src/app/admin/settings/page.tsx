"use client";

import { Save } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useSettings } from "./useSettings";
import { BrandingSection } from "./components/BrandingSection";
import { PersonalSection } from "./components/PersonalSection";
import { ContactSection } from "./components/ContactSection";

export default function SettingsPage() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        isSubmitting,
        loading,
        onSubmit
    } = useSettings();

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <Toaster />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">إعدادات الموقع</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <BrandingSection 
                    register={register} 
                    watch={watch} 
                    setValue={setValue} 
                />

                <PersonalSection 
                    register={register} 
                />

                <ContactSection 
                    register={register} 
                />

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
