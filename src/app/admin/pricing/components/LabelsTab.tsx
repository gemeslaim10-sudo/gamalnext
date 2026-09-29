"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import type { PricingContent, PricingLabels } from "@/lib/pricing/types";
import { TextField } from "./fields";
import type { UpdateContent } from "./types";

interface LabelField {
    key: keyof PricingLabels;
    label: string;
    hint?: string;
}

const GROUPS: { title: string; description: string; fields: LabelField[] }[] = [
    {
        title: "الأسعار والأزرار",
        description: "نصوص تتكرر في كل الكروت.",
        fields: [
            { key: "currency", label: "العملة", hint: "تظهر قبل كل سعر، مثل EGP." },
            { key: "customQuote", label: "بدل السعر (حسب الطلب)", hint: "يظهر مكان السعر للعناصر بدون سعر ثابت." },
            { key: "request", label: "زر الطلب" },
            { key: "requestQuote", label: "زر طلب عرض سعر", hint: "للعناصر بدون سعر ثابت." },
            { key: "featured", label: "شارة العنصر المميز" },
            { key: "discount", label: "شارة الخصم", hint: "{percent} تتبدل بنسبة الخصم تلقائيًا." },
            { key: "originalPrice", label: "السعر قبل الخصم (لقارئ الشاشة)", hint: "غير ظاهر؛ يُقرأ قبل السعر المشطوب." },
        ],
    },
    {
        title: "مواصفات الباقات",
        description: "عناوين سطور المواصفات داخل كل كارت.",
        fields: [
            { key: "pages", label: "الصفحات" },
            { key: "stack", label: "التقنيات" },
            { key: "hosting", label: "الاستضافة" },
            { key: "hostingCost", label: "تكلفة الاستضافة" },
            { key: "seo", label: "SEO" },
            { key: "editing", label: "سهولة التعديل" },
        ],
    },
    {
        title: "أزرار التواصل",
        description: "داخل قسم التواصل.",
        fields: [
            { key: "call", label: "زر الاتصال" },
            { key: "whatsapp", label: "زر واتساب" },
            { key: "email", label: "عنوان كارت البريد" },
            { key: "sendEmail", label: "زر إرسال بريد" },
        ],
    },
];

interface LabelsTabProps {
    content: PricingContent;
    update: UpdateContent;
}

/** Every small text of the page that isn't part of a specific item. */
export function LabelsTab({ content, update }: LabelsTabProps) {
    const setLabel = (key: keyof PricingLabels, value: string) =>
        update((draft) => ({ ...draft, labels: { ...draft.labels, [key]: value } }));

    return (
        <>
            {GROUPS.map((group) => (
                <SectionCard key={group.title} title={group.title} description={group.description}>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {group.fields.map((field) => (
                            <TextField
                                key={field.key}
                                label={field.label}
                                value={content.labels[field.key]}
                                onChange={(value) => setLabel(field.key, value)}
                                hint={field.hint}
                            />
                        ))}
                    </div>
                </SectionCard>
            ))}
        </>
    );
}
