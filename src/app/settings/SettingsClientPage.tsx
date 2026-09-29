"use client";

import { useAuth } from "@/context/AuthContext";
import { LoginPrompt } from "@/components/auth/LoginPrompt";
import { useCopy } from "@/components/providers/CopyProvider";
import { Card, LoadingBlock, Page, PageHeader } from "@/components/ui";

import { useSettings } from "./useSettings";
import { ProfileAvatar } from "./components/ProfileAvatar";
import { SettingsForm } from "./components/SettingsForm";
import { DangerZone } from "./components/DangerZone";

export default function SettingsClientPage() {
    const { loading: authLoading } = useAuth();
    const t = useCopy();
    const {
        user,
        loading,
        saving,
        formData,
        setFormData,
        handlePhotoUpload,
        handleSubmit,
        handleDeleteAccount
    } = useSettings();

    // Waits for both the sign-in check and the saved profile, so neither the log in box
    // nor an empty form flashes before the real content
    if (authLoading || loading) {
        return (
            <Page>
                <LoadingBlock label={t("account.loading")} />
            </Page>
        );
    }

    if (!user) {
        return <LoginPrompt title={t("account.settingsLockedTitle")} description={t("account.settingsLockedDescription")} />;
    }

    return (
        <Page>
            <div className="mx-auto max-w-content">
                <PageHeader title={t("account.settingsTitle")} />

                <div className="flex flex-col gap-6">
                    <Card padding="lg">
                        <ProfileAvatar
                            photoURL={formData.photoURL}
                            name={formData.name}
                            handlePhotoUpload={handlePhotoUpload}
                        />
                        <SettingsForm
                            formData={formData}
                            setFormData={setFormData}
                            saving={saving}
                            handleSubmit={handleSubmit}
                        />
                    </Card>

                    <DangerZone handleDeleteAccount={handleDeleteAccount} />
                </div>
            </div>
        </Page>
    );
}
