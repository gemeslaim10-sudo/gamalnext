"use client";

import { Save } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SectionCard } from "@/components/admin/SectionCard";
import { Button, Field, Input, LoadingBlock, PageHeader, Textarea } from "@/components/ui";
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

    return (
        <div className="max-w-content">
            <PageHeader title="General Content" description="Text, photo and WhatsApp number for the hero section." />

            {loading ? (
                <LoadingBlock />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Hero Section */}
                    <SectionCard title="Hero Section">
                        <div className="space-y-4">
                            <ImageUpload
                                label="Profile Avatar Image"
                                value={watch("avatarImage")}
                                onChange={(url) => setValue("avatarImage", url)}
                            />

                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Main Title (Name)" htmlFor="content-hero-title">
                                    <Input id="content-hero-title" {...register("heroTitle")} />
                                </Field>
                                <Field label="Subtitle" htmlFor="content-hero-subtitle">
                                    <Input id="content-hero-subtitle" {...register("heroSubtitle")} />
                                </Field>
                            </div>

                            <Field label="Lead Paragraph" htmlFor="content-hero-description">
                                <Textarea id="content-hero-description" {...register("heroDescription")} rows={4} />
                            </Field>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="WhatsApp Number (No +)" htmlFor="content-whatsapp">
                                    <Input id="content-whatsapp" inputMode="tel" {...register("whatsappNumber")} />
                                </Field>
                            </div>
                        </div>
                    </SectionCard>

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
