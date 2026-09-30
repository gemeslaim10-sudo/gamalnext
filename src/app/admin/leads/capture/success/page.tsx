"use client";

import { TextsEditor, type TextSection } from "../components/TextsEditor";

const SECTIONS: TextSection<"successTitle" | "successMessage" | "whatsappLabel" | "closeLabel">[] = [
    {
        title: "الرسالة",
        fields: [
            { key: "successTitle", label: "العنوان", hint: "{name} بيتبدّل بالاسم الأول للزائر.", wide: true },
            { key: "successMessage", label: "الرسالة", multiline: true },
        ],
    },
    {
        title: "الأزرار",
        fields: [
            { key: "whatsappLabel", label: "زرار واتساب" },
            { key: "closeLabel", label: "زرار الإغلاق" },
        ],
    },
];

const KEYS = SECTIONS.flatMap((section) => section.fields.map((field) => field.key));

export default function CaptureSuccessEditor() {
    return (
        <TextsEditor
            title="رسالة النجاح"
            description="بتظهر بعد ما الزائر يبعت رقمه، في النافذة وفي صفحة التواصل."
            keys={KEYS}
            sections={SECTIONS}
            withPreview
            note={<p className="text-xs text-subtle">عشان تشوفها في المعاينة: املا الفورم واضغط إرسال. المعاينة مش بتسجّل حاجة.</p>}
        />
    );
}
