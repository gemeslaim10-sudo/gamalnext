"use client";

import { use, useCallback } from "react";
import { notFound } from "next/navigation";
import { SectionCard } from "@/components/admin/SectionCard";
import { servicesIndexPath } from "@/lib/services/content";
import type { ServiceLabels, ServiceLang, ServicesContent, ServicesIndexCopy } from "@/lib/services/types";
import { TextField } from "../../../pricing/components/fields";
import { ServicesEditorFrame } from "../../ServicesEditorFrame";
import { LANG_LABEL, SERVICES_CRUMBS, useServicesPart } from "../../useServicesPart";

interface TextsDraft {
    index: ServicesIndexCopy;
    labels: ServiceLabels;
}

const LABEL_FIELDS: { key: keyof ServiceLabels; label: string }[] = [
    { key: "home", label: "«الرئيسية» في مسار الصفحة" },
    { key: "services", label: "«الخدمات» في مسار الصفحة" },
    { key: "startingFrom", label: "عنوان كارت الأسعار" },
    { key: "priceFrom", label: "قبل السعر اللي بيبدأ من" },
    { key: "allPrices", label: "لينك كل الأسعار" },
    { key: "ctaButton", label: "زر الطلب" },
    { key: "contactLink", label: "لينك التواصل تحت الزر" },
    { key: "relatedProjects", label: "عنوان المشاريع المرتبطة" },
    { key: "relatedArticles", label: "عنوان المقالات المرتبطة" },
    { key: "otherServices", label: "عنوان الخدمات التانية" },
    { key: "learnMore", label: "لينك الكارت في صفحة الخدمات" },
    { key: "otherLanguage", label: "لينك نفس الصفحة باللغة التانية" },
];

/** The services list page (/services or /ar/services) and the small texts every service page repeats. */
export default function ServicesTextsEditor({ params }: { params: Promise<{ lang: string }> }) {
    const { lang: rawLang } = use(params);
    if (rawLang !== "en" && rawLang !== "ar") notFound();
    const lang = rawLang as ServiceLang;

    const pick = useCallback((content: ServicesContent): TextsDraft => ({ index: content.index[lang], labels: content.labels[lang] }), [lang]);
    const apply = useCallback(
        (content: ServicesContent, draft: TextsDraft) => ({
            index: { ...content.index, [lang]: draft.index },
            labels: { ...content.labels, [lang]: draft.labels },
        }),
        [lang]
    );
    const part = useServicesPart(pick, apply);

    return (
        <ServicesEditorFrame
            title={`النصوص العامة ${LANG_LABEL[lang]}`}
            description={`صفحة ${servicesIndexPath(lang)} والنصوص الصغيرة اللي بتتكرر في كل صفحة خدمة.`}
            breadcrumbs={SERVICES_CRUMBS}
            part={part}
            viewHref={servicesIndexPath(lang)}
        >
            {(draft) => (
                <>
                    <SectionCard title={`صفحة ${servicesIndexPath(lang)}`}>
                        <TextField label="العنوان الرئيسي (H1)" value={draft.index.h1} onChange={(h1) => part.change((current) => ({ ...current, index: { ...current.index, h1 } }))} />
                        <TextField label="المقدمة" rows={4} value={draft.index.intro} onChange={(intro) => part.change((current) => ({ ...current, index: { ...current.index, intro } }))} />
                        <TextField
                            label="عنوان جوجل"
                            value={draft.index.seoTitle}
                            onChange={(seoTitle) => part.change((current) => ({ ...current, index: { ...current.index, seoTitle } }))}
                            hint={`بيتضاف بعده « | GTech». (${draft.index.seoTitle.length}/52)`}
                        />
                        <TextField
                            label="وصف جوجل"
                            rows={3}
                            value={draft.index.seoDescription}
                            onChange={(seoDescription) => part.change((current) => ({ ...current, index: { ...current.index, seoDescription } }))}
                            hint={`(${draft.index.seoDescription.length}/160)`}
                        />
                    </SectionCard>

                    <SectionCard title="نصوص صفحات الخدمات">
                        <div className="grid gap-4 sm:grid-cols-2">
                            {LABEL_FIELDS.map((field) => (
                                <TextField
                                    key={field.key}
                                    label={field.label}
                                    value={draft.labels[field.key]}
                                    onChange={(value) => part.change((current) => ({ ...current, labels: { ...current.labels, [field.key]: value } }))}
                                />
                            ))}
                        </div>
                    </SectionCard>
                </>
            )}
        </ServicesEditorFrame>
    );
}
