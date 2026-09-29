import { UseFormRegister } from "react-hook-form";
import { SettingsForm } from "../types";
import { SectionCard } from "@/components/admin/SectionCard";
import { Field, Input, Textarea } from "@/components/ui";

interface PersonalSectionProps {
    register: UseFormRegister<SettingsForm>;
}

export function PersonalSection({ register }: PersonalSectionProps) {
    return (
        <SectionCard title="Personal Information" description="Your name, title and bio as visitors see them.">
            <div className="grid gap-4 md:grid-cols-2">
                <Field label="Owner Name" htmlFor="settings-owner-name">
                    <Input id="settings-owner-name" {...register("ownerName")} />
                </Field>
                <Field label="Job Title / Tagline" htmlFor="settings-owner-title">
                    <Input id="settings-owner-title" {...register("ownerTitle")} />
                </Field>
                <Field label="Biography" htmlFor="settings-owner-bio" className="md:col-span-2">
                    <Textarea id="settings-owner-bio" {...register("ownerBio")} rows={3} />
                </Field>
                <Field label="Company Role" htmlFor="settings-owner-role">
                    <Input id="settings-owner-role" {...register("ownerRole")} />
                </Field>
                <Field label="Location" htmlFor="settings-owner-location">
                    <Input id="settings-owner-location" {...register("ownerLocation")} />
                </Field>
                <Field label="Profile Badges (comma separated)" htmlFor="settings-owner-badges" className="md:col-span-2">
                    <Input
                        id="settings-owner-badges"
                        {...register("ownerBadges")}
                        placeholder="React & Next.js, AI Integration, Performance"
                    />
                </Field>
            </div>
        </SectionCard>
    );
}
