"use client";

import { BookOpen, FlaskConical, Save } from "lucide-react";
import { Alert, Button, ButtonLink, LoadingBlock, PageHeader } from "@/components/ui";
import { useAiSettings } from "./useAiSettings";
import { IdentitySection } from "./components/IdentitySection";
import { InstructionsSection } from "./components/InstructionsSection";
import { WelcomeSection } from "./components/WelcomeSection";
import { ModelSection } from "./components/ModelSection";
import { AiKeysForm } from "./components/AiKeysForm";

export default function AdminAiPage() {
    const { loading, loadError, saving, dirty, formData, update, handleSave } = useAiSettings();

    const saveButton = (
        <Button onClick={handleSave} disabled={saving || loading || loadError || !dirty} className="flex-1 sm:flex-none">
            <Save /> {saving ? "جاري الحفظ…" : "حفظ التغييرات"}
        </Button>
    );

    return (
        <div className="max-w-content">
            <PageHeader
                title="إعدادات المساعد الذكي"
                description="هوية المساعد، تعليماته، رسالة الترحيب والموديل. المعلومات نفسها في قاعدة المعرفة."
                actions={
                    <>
                        <ButtonLink href="/admin/ai/knowledge" variant="secondary" className="flex-1 sm:flex-none">
                            <BookOpen /> قاعدة المعرفة
                        </ButtonLink>
                        <ButtonLink href="/admin/ai/test" variant="secondary" className="flex-1 sm:flex-none">
                            <FlaskConical /> جرّب المساعد
                        </ButtonLink>
                    </>
                }
            />

            {loading ? (
                <LoadingBlock />
            ) : loadError ? (
                <Alert variant="danger">تعذّر تحميل الإعدادات. تأكد من الاتصال وأعد تحميل الصفحة.</Alert>
            ) : (
                <div className="space-y-6">
                    <IdentitySection formData={formData} update={update} />
                    <InstructionsSection formData={formData} update={update} />
                    <WelcomeSection formData={formData} update={update} />
                    <ModelSection formData={formData} update={update} />
                    <AiKeysForm formData={formData} update={update} />

                    <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-end gap-3 border-t border-border bg-background px-4 py-3 sm:mx-0 sm:rounded-card sm:border">
                        <p className="me-auto text-xs text-subtle">{dirty ? "فيه تغييرات لم تُحفظ" : "كل التغييرات محفوظة"}</p>
                        {saveButton}
                    </div>
                </div>
            )}
        </div>
    );
}
