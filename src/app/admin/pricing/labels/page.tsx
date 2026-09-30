"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import type { PricingContent, PricingLabels } from "@/lib/pricing/types";
import { TextField } from "../components/fields";
import { PricingEditor, usePricingPart } from "../components/PricingEditor";

interface LabelField {
    key: keyof PricingLabels;
    label: string;
    hint?: string;
}

const GROUPS: { title: string; description: string; fields: LabelField[] }[] = [
    {
        title: "الأسعار والأزرار",
        description: "نصوص بتتكرر في كل الكروت.",
        fields: [
            { key: "currency", label: "العملة", hint: "بتظهر قبل كل سعر، زي USD." },
            { key: "priceFrom", label: "قبل السعر اللي «بيبدأ من»", hint: "للخدمات اللي سعرها بيبدأ من رقم، زي From." },
            { key: "customQuote", label: "مكان السعر (حسب الطلب)", hint: "للعناصر اللي من غير سعر ثابت." },
            { key: "request", label: "زر الطلب" },
            { key: "requestQuote", label: "زر طلب عرض سعر", hint: "للعناصر اللي من غير سعر ثابت." },
            { key: "featured", label: "شارة العنصر المميز" },
            { key: "learnMore", label: "رابط صفحة الخدمة", hint: "تحت الباقات والخدمات اللي ليها صفحة خدمة." },
            { key: "discount", label: "شارة الخصم", hint: "{percent} بتتبدّل بنسبة الخصم لوحدها." },
            { key: "originalPrice", label: "السعر قبل الخصم (لقارئ الشاشة)", hint: "مش ظاهر؛ بيتقري قبل السعر المشطوب." },
        ],
    },
    {
        title: "سطور المواصفات",
        description: "عناوين السطور جوه كروت الباقات.",
        fields: [
            { key: "pages", label: "الصفحات" },
            { key: "hosting", label: "الاستضافة" },
            { key: "hostingCost", label: "تكلفة الاستضافة" },
        ],
    },
    {
        title: "أزرار التواصل",
        description: "جوه قسم التواصل.",
        fields: [
            { key: "call", label: "زر الاتصال" },
            { key: "whatsapp", label: "زر واتساب" },
            { key: "email", label: "عنوان كارت الإيميل" },
            { key: "sendEmail", label: "زر إرسال إيميل" },
        ],
    },
];

const pick = (content: PricingContent) => content.labels;
const toPatch = (labels: PricingLabels) => ({ labels });

/** Every small text of the page that isn't part of a specific item. */
export default function PricingLabelsEditor() {
    const part = usePricingPart(pick, toPatch);
    const setLabel = (key: keyof PricingLabels, value: string) => part.change((labels) => ({ ...labels, [key]: value }));

    return (
        <PricingEditor
            title="نصوص الأزرار والأسعار"
            description="الكلام الصغير اللي بيتكرر في الصفحة. عناوين الأقسام نفسها بتتعدّل من صفحة كل قسم."
            part={part}
        >
            {(labels) => (
                <>
                    {GROUPS.map((group) => (
                        <SectionCard key={group.title} title={group.title} description={group.description}>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {group.fields.map((field) => (
                                    <TextField
                                        key={field.key}
                                        label={field.label}
                                        value={labels[field.key]}
                                        onChange={(value) => setLabel(field.key, value)}
                                        hint={field.hint}
                                    />
                                ))}
                            </div>
                        </SectionCard>
                    ))}
                </>
            )}
        </PricingEditor>
    );
}
