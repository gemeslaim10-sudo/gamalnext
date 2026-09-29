"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCopy } from "@/components/providers/CopyProvider";
import { BackLink, LoadingBlock, Page, PageHeader } from "@/components/ui";
import { useEditArticle } from "./useEditArticle";
import { EditArticleForm } from "./components/EditArticleForm";
import { LoginPrompt } from "@/components/auth/LoginPrompt";

export default function EditArticlePage() {
    const t = useCopy();
    // `params` is a Promise in Next 16, so the id is read from the router instead
    const { id } = useParams<{ id: string }>();
    const { loading: authLoading } = useAuth();
    const { user, loading, saving, formData, setFormData, handleSubmit } = useEditArticle(id);

    if (authLoading) {
        return (
            <Page>
                <LoadingBlock label={t("blog.loading")} />
            </Page>
        );
    }

    if (!user) {
        return <LoginPrompt title={t("blog.editLoginTitle")} description={t("blog.editLoginText")} />;
    }

    if (loading) {
        return (
            <Page>
                <LoadingBlock label={t("blog.loading")} />
            </Page>
        );
    }

    return (
        <Page>
            <div className="mx-auto max-w-content">
                <BackLink href={`/articles/${id}`}>{t("blog.backToArticle")}</BackLink>

                <PageHeader title={t("blog.editTitle")} description={t("blog.editDescription")} />

                <EditArticleForm
                    formData={formData}
                    setFormData={setFormData}
                    saving={saving}
                    onSubmit={handleSubmit}
                />
            </div>
        </Page>
    );
}
