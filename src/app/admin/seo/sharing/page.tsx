"use client";

import { ExternalLink } from "lucide-react";
import { SectionCard } from "@/components/admin/SectionCard";
import { ButtonLink } from "@/components/ui";
import { SEO_PARTS, inheritedPlaceholder } from "../seoEditor";
import { TextField } from "../components/fields";
import { SeoEditor, useInheritedSettings, useSeoPart } from "../components/SeoEditor";

/** How links to the site look when shared on WhatsApp, Facebook, LinkedIn or X. */
export default function SeoSharingEditor() {
    const part = useSeoPart(SEO_PARTS.sharing);
    const inherited = useInheritedSettings();

    return (
        <SeoEditor
            title="مشاركة الروابط"
            description="لما حد يبعت رابط من الموقع على واتساب أو فيسبوك أو LinkedIn أو X."
            part={part}
            inherited={inherited}
            actions={
                <ButtonLink href="/opengraph-image" external variant="secondary" size="sm">
                    <ExternalLink />
                    صورة المشاركة
                </ButtonLink>
            }
        >
            {(draft) => (
                <SectionCard title="الاسم وصورة المشاركة" description="الموقع بيعمل صورة المشاركة لوحده: اسم الموقع وتحته السطر ده.">
                    <div className="space-y-4">
                        <TextField
                            label="اسم الموقع في الروابط المشاركة"
                            value={draft.shareSiteName}
                            onChange={(shareSiteName) => part.set({ shareSiteName })}
                            placeholder={inheritedPlaceholder(inherited.data?.siteName)}
                            hint="فاضي = اسم الموقع من الإعدادات."
                        />
                        <TextField
                            label="السطر اللي تحت الاسم في صورة المشاركة"
                            value={draft.shareTagline}
                            onChange={(shareTagline) => part.set({ shareTagline })}
                            hint="الصورة بتعرض آخر نسخة محفوظة — احفظ الأول عشان تشوف التعديل."
                        />
                        <TextField
                            label="حساب X (تويتر)"
                            dir="ltr"
                            value={draft.twitterHandle}
                            onChange={(twitterHandle) => part.set({ twitterHandle })}
                            placeholder="@gtech"
                            hint="اختياري، لو عندك حساب على X."
                        />
                    </div>
                </SectionCard>
            )}
        </SeoEditor>
    );
}
