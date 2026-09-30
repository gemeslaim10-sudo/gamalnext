"use client";

import { ExternalLink } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { TextsEditor, type TextSection } from "../components/TextsEditor";

type ContactKey =
    | "contactTitle"
    | "contactDescription"
    | "contactDetailsTitle"
    | "contactFormTitle"
    | "contactFormDescription"
    | "contactMessageLabel"
    | "contactMessagePlaceholder"
    | "contactSubmitLabel";

const SECTIONS: TextSection<ContactKey>[] = [
    {
        title: "رأس الصفحة",
        fields: [
            { key: "contactTitle", label: "عنوان الصفحة" },
            { key: "contactDetailsTitle", label: "عنوان بيانات التواصل" },
            { key: "contactDescription", label: "وصف الصفحة", multiline: true },
        ],
    },
    {
        title: "الفورم",
        description: "خانات الاسم والرقم وملاحظة الخصوصية ورسالة النجاح بتتعدّل من «الفورم والأخطاء» و«رسالة النجاح».",
        fields: [
            { key: "contactFormTitle", label: "عنوان الفورم" },
            { key: "contactSubmitLabel", label: "زرار الإرسال" },
            { key: "contactFormDescription", label: "وصف الفورم", multiline: true },
            { key: "contactMessageLabel", label: "عنوان خانة الرسالة" },
            { key: "contactMessagePlaceholder", label: "مثال جوه خانة الرسالة" },
        ],
    },
];

const KEYS = SECTIONS.flatMap((section) => section.fields.map((field) => field.key));

export default function CaptureContactEditor() {
    return (
        <TextsEditor
            title="صفحة التواصل"
            description="رقمك وإيميلك ولينكاتك في الصفحة بييجوا من «إعدادات الموقع»."
            keys={KEYS}
            sections={SECTIONS}
            actions={
                <ButtonLink href="/contact" external variant="secondary" size="sm">
                    <ExternalLink />
                    عرض الصفحة
                </ButtonLink>
            }
        />
    );
}
