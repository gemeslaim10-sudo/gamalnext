"use client";

import { MediaUpload } from "@/components/admin/MediaUpload";
import { LoginPrompt } from "@/components/auth/LoginPrompt";
import { useCopy } from "@/components/providers/CopyProvider";
import { Button, LoadingBlock, Page, PageHeader, Spinner } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { ALLOWED_ADMINS } from "@/lib/constants";

import { useWriteArticle } from "./useWriteArticle";
import { TitleInput } from "./components/TitleInput";
import { ArticleContent } from "./components/ArticleContent";
import { ImageHelper } from "./components/ImageHelper";
import { ArticleMeta } from "./components/ArticleMeta";

export default function WriteArticlePage() {
    const { loading: authLoading } = useAuth();
    const t = useCopy();
    const {
        user,
        formData,
        setFormData,
        imageQuery,
        loading,
        generating,
        regeneratingImage,
        enhancingTitle,
        handleAiImageRegenerate,
        handleEnhanceTitle,
        handleAiGenerate,
        handleSubmit
    } = useWriteArticle();

    // Until the sign-in check finishes we don't know which view to show, so neither flashes
    if (authLoading) {
        return (
            <Page>
                <LoadingBlock label={t("account.loading")} />
            </Page>
        );
    }

    if (!user) return (
        <LoginPrompt
            title={t("account.writeLockedTitle")}
            description={t("account.writeLockedDescription")}
        />
    );

    // Same rule the submit handler uses: admins publish directly, everyone else goes to review
    const isAdmin = !!user.email && ALLOWED_ADMINS.includes(user.email);

    return (
        <Page>
            <div className="mx-auto max-w-content">
                <PageHeader title={t("account.writeTitle")} description={t("account.writeDescription")} />

                {/* noValidate: empty fields are reported with the dashboard texts (see useWriteArticle) */}
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                    <TitleInput
                        formData={formData}
                        setFormData={setFormData}
                        enhancingTitle={enhancingTitle}
                        generating={generating}
                        handleEnhanceTitle={handleEnhanceTitle}
                        handleAiGenerate={handleAiGenerate}
                    />

                    <ArticleContent
                        formData={formData}
                        setFormData={setFormData}
                    />

                    <div className="flex flex-col gap-4">
                        <MediaUpload
                            items={formData.media}
                            onChange={(media) => setFormData({ ...formData, media })}
                        />
                        <ImageHelper
                            formData={formData}
                            setFormData={setFormData}
                            regeneratingImage={regeneratingImage}
                            imageQuery={imageQuery}
                            handleAiImageRegenerate={handleAiImageRegenerate}
                        />
                    </div>

                    <ArticleMeta
                        formData={formData}
                        setFormData={setFormData}
                    />

                    <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-subtle">
                            {isAdmin ? t("account.writeAdminHint") : t("account.writeUserHint")}
                        </p>
                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                            {loading && <Spinner className="size-4 text-primary-foreground" />}
                            {t("account.writePublish")}
                        </Button>
                    </div>
                </form>
            </div>
        </Page>
    );
}
