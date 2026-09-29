import { Button, Field, Input, Select, Spinner, Textarea } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";
import { detectTextDir } from "@/lib/utils";
import type { SettingsFormData } from "../useSettings";

interface SettingsFormProps {
    formData: SettingsFormData;
    setFormData: React.Dispatch<React.SetStateAction<SettingsFormData>>;
    saving: boolean;
    handleSubmit: (e: React.FormEvent) => void;
}

export function SettingsForm({
    formData,
    setFormData,
    saving,
    handleSubmit
}: SettingsFormProps) {
    const t = useCopy();
    const update = (field: keyof SettingsFormData, value: string) => setFormData({ ...formData, [field]: value });

    return (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
            <Field label={t("account.settingsNameLabel")} htmlFor="settings-name">
                <Input
                    id="settings-name"
                    type="text"
                    value={formData.name}
                    onChange={e => update("name", e.target.value)}
                    dir={detectTextDir(formData.name)}
                />
            </Field>

            <Field label={t("account.settingsJobLabel")} htmlFor="settings-job-title">
                <Input
                    id="settings-job-title"
                    type="text"
                    value={formData.jobTitle}
                    onChange={e => update("jobTitle", e.target.value)}
                    placeholder={t("account.settingsJobPlaceholder")}
                    dir={detectTextDir(formData.jobTitle)}
                />
            </Field>

            <Field label={t("account.settingsLocationLabel")} htmlFor="settings-location">
                <Input
                    id="settings-location"
                    type="text"
                    value={formData.location}
                    onChange={e => update("location", e.target.value)}
                    placeholder={t("account.settingsLocationPlaceholder")}
                    dir={detectTextDir(formData.location)}
                />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t("account.settingsStatusLabel")} htmlFor="settings-social-status">
                    <Select
                        id="settings-social-status"
                        value={formData.socialStatus}
                        onChange={e => update("socialStatus", e.target.value)}
                    >
                        <option value="Single">{t("account.settingsStatusSingle")}</option>
                        <option value="Engaged">{t("account.settingsStatusEngaged")}</option>
                        <option value="Married">{t("account.settingsStatusMarried")}</option>
                        <option value="Complicated">{t("account.settingsStatusComplicated")}</option>
                    </Select>
                </Field>
                <Field label={t("account.settingsGenderLabel")} htmlFor="settings-gender">
                    <Select
                        id="settings-gender"
                        value={formData.gender}
                        onChange={e => update("gender", e.target.value)}
                    >
                        <option value="Male">{t("account.settingsGenderMale")}</option>
                        <option value="Female">{t("account.settingsGenderFemale")}</option>
                    </Select>
                </Field>
            </div>

            <Field label={t("account.settingsBioLabel")} htmlFor="settings-bio">
                <Textarea
                    id="settings-bio"
                    value={formData.bio}
                    onChange={e => update("bio", e.target.value)}
                    rows={4}
                    placeholder={t("account.settingsBioPlaceholder")}
                    dir={detectTextDir(formData.bio)}
                    className="resize-none"
                />
            </Field>

            <div className="flex justify-end">
                <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                    {saving && <Spinner className="size-4 text-primary-foreground" />}
                    {t("account.settingsSave")}
                </Button>
            </div>
        </form>
    );
}
