"use client";

import { TextsEditor, type TextSection } from "../components/TextsEditor";

type FormKey =
    | "nameLabel"
    | "namePlaceholder"
    | "phoneLabel"
    | "phonePlaceholder"
    | "sendingLabel"
    | "nameError"
    | "phoneError"
    | "errorMessage"
    | "privacyNote";

const SECTIONS: TextSection<FormKey>[] = [
    {
        title: "الخانات",
        description: "في النافذة وفي صفحة التواصل.",
        fields: [
            { key: "nameLabel", label: "عنوان خانة الاسم" },
            { key: "namePlaceholder", label: "مثال جوه خانة الاسم" },
            { key: "phoneLabel", label: "عنوان خانة الرقم" },
            { key: "phonePlaceholder", label: "مثال جوه خانة الرقم" },
            { key: "sendingLabel", label: "زرار الإرسال وهو بيبعت" },
            { key: "privacyNote", label: "ملاحظة الخصوصية", multiline: true },
        ],
    },
    {
        title: "رسايل الأخطاء",
        fields: [
            { key: "nameError", label: "لو الاسم ناقص" },
            { key: "phoneError", label: "لو الرقم مش صح" },
            { key: "errorMessage", label: "لو الإرسال فشل", wide: true },
        ],
    },
];

const KEYS = SECTIONS.flatMap((section) => section.fields.map((field) => field.key));

export default function CaptureFormEditor() {
    return (
        <TextsEditor
            title="الفورم والأخطاء"
            description="مشتركة بين النافذة وصفحة التواصل. الخانة الفاضية بترجع للنص الافتراضي اللي باين فيها."
            keys={KEYS}
            sections={SECTIONS}
            withPreview
        />
    );
}
