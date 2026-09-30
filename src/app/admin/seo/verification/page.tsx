"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import type { SeoVerification } from "@/lib/seo/settings";
import { SEO_PARTS, verificationCode } from "../seoEditor";
import { TextField } from "../components/fields";
import { SeoEditor, useSeoPart } from "../components/SeoEditor";

const FIELDS: { key: keyof SeoVerification; label: string; hint: string }[] = [
    {
        key: "google",
        label: "Google Search Console",
        hint: "من Google Search Console: Add property ← URL prefix ← طريقة HTML tag. انسخ اللي جوه content=\"…\" بس، أو الصق الـ tag كله وهنطلّع الكود منه.",
    },
    {
        key: "bing",
        label: "Bing Webmaster Tools",
        hint: "من Bing Webmaster Tools: Add site ← HTML Meta Tag (msvalidate.01). وممكن كمان تستورد الموقع من Search Console من غير كود.",
    },
    {
        key: "yandex",
        label: "Yandex Webmaster",
        hint: "من Yandex Webmaster: Add site ← Meta tag (yandex-verification).",
    },
];

/** Ownership codes for the webmaster tools. */
export default function SeoVerificationEditor() {
    const part = useSeoPart(SEO_PARTS.verification);

    return (
        <SeoEditor
            title="أكواد التحقق"
            description="كل خدمة بتديك كود يثبت إن الموقع بتاعك. حطه هنا واحفظ، وبعدها ارجع للخدمة واضغط Verify."
            part={part}
        >
            {(draft) => (
                <SectionCard title="الأكواد">
                    <div className="space-y-4">
                        {FIELDS.map((field) => (
                            <TextField
                                key={field.key}
                                label={field.label}
                                dir="ltr"
                                value={draft[field.key]}
                                onChange={(value) => part.set({ [field.key]: verificationCode(value) })}
                                hint={field.hint}
                            />
                        ))}
                    </div>
                </SectionCard>
            )}
        </SeoEditor>
    );
}
