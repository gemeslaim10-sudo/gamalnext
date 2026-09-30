"use client";

import { TextsEditor, type TextSection } from "../components/TextsEditor";

const SECTIONS: TextSection<"title" | "subtitle" | "submitLabel" | "maybeLaterLabel">[] = [
    {
        title: "الترحيب",
        description: "صورتك واسمك ولقبك اللي فوقه بييجوا من «إعدادات الموقع».",
        fields: [
            { key: "title", label: "الترحيب", wide: true },
            { key: "subtitle", label: "رسالتك", hint: "سطر قصير منك، بصيغة المتكلم.", multiline: true },
        ],
    },
    {
        title: "الأزرار",
        fields: [
            { key: "submitLabel", label: "زرار الإرسال" },
            { key: "maybeLaterLabel", label: "زرار «بعدين»" },
        ],
    },
];

const KEYS = SECTIONS.flatMap((section) => section.fields.map((field) => field.key));

export default function CapturePopupEditor() {
    return <TextsEditor title="نصوص النافذة" description="أول حاجة الزائر بيقراها في النافذة." keys={KEYS} sections={SECTIONS} withPreview />;
}
