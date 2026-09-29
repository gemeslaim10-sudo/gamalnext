"use client";

import { Save } from "lucide-react";
import { Button, LoadingBlock, PageHeader } from "@/components/ui";
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

    return (
        <div className="max-w-content">
            <PageHeader title="إعدادات الموقع" description="اسم الموقع وهويته، بياناتك الشخصية، وروابط التواصل." />

            {loading ? (
                <LoadingBlock />
            ) : (
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

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                            <Save />
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
