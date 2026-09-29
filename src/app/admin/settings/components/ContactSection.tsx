import { UseFormRegister } from "react-hook-form";
import { SettingsForm } from "../types";
import { SectionCard } from "@/components/admin/SectionCard";
import { Field, Input } from "@/components/ui";

interface ContactSectionProps {
    register: UseFormRegister<SettingsForm>;
}

export function ContactSection({ register }: ContactSectionProps) {
    return (
        <SectionCard title="Social Media & Contact" description="Links and numbers visitors use to reach you.">
            <div className="grid gap-4 md:grid-cols-2">
                <Field label="GitHub URL" htmlFor="settings-github">
                    <Input id="settings-github" {...register("githubUrl")} />
                </Field>
                <Field label="LinkedIn URL" htmlFor="settings-linkedin">
                    <Input id="settings-linkedin" {...register("linkedinUrl")} />
                </Field>
                <Field label="Email Address" htmlFor="settings-email">
                    <Input id="settings-email" {...register("emailAddress")} type="email" />
                </Field>
                <Field label="Phone Number" htmlFor="settings-phone">
                    <Input id="settings-phone" inputMode="tel" {...register("phoneDisplay")} />
                </Field>
                <Field label="WhatsApp Number" htmlFor="settings-whatsapp">
                    <Input id="settings-whatsapp" inputMode="tel" {...register("whatsappNumber")} />
                </Field>
                <Field label="Availability Badge (leave empty to hide)" htmlFor="settings-availability">
                    <Input id="settings-availability" {...register("availabilityStatus")} placeholder="Available" />
                </Field>
            </div>
        </SectionCard>
    );
}
