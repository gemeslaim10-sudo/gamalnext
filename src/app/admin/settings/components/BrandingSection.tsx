import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { SettingsForm } from "../types";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SectionCard } from "@/components/admin/SectionCard";
import { Field, Input, Textarea } from "@/components/ui";

interface BrandingSectionProps {
    register: UseFormRegister<SettingsForm>;
    watch: UseFormWatch<SettingsForm>;
    setValue: UseFormSetValue<SettingsForm>;
}

export function BrandingSection({ register, watch, setValue }: BrandingSectionProps) {
    return (
        <SectionCard title="Branding & Identity" description="The name, photo and description used across the site.">
            <div className="grid gap-4 md:grid-cols-2">
                <Field label="Site Name" htmlFor="settings-site-name">
                    <Input id="settings-site-name" {...register("siteName")} />
                </Field>
                <ImageUpload
                    label="Profile Photo / Site Logo"
                    value={watch("siteLogo")}
                    onChange={(url) => setValue("siteLogo", url)}
                />
                <Field label="Site Description" htmlFor="settings-site-description" className="md:col-span-2">
                    <Textarea id="settings-site-description" {...register("siteDescription")} rows={2} />
                </Field>
            </div>
        </SectionCard>
    );
}
