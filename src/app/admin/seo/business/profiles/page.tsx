"use client";

import { Card } from "@/components/ui";
import { SEO_PARTS, isWebUrl } from "../../seoEditor";
import { ListField } from "../../components/fields";
import { BUSINESS_CRUMBS, SeoEditor, useSeoPart } from "../../components/SeoEditor";

/** Links to the business's profiles elsewhere (schema.org sameAs). */
export default function SeoProfilesEditor() {
    const part = useSeoPart(SEO_PARTS.profiles);

    return (
        <SeoEditor
            title="حساباتك على مواقع تانية"
            description="بتعرّف جوجل والمساعدات الذكية إن الحسابات دي كلها نفس النشاط."
            breadcrumbs={BUSINESS_CRUMBS}
            part={part}
        >
            {(draft) => (
                <Card padding="lg">
                    <ListField
                        label="الروابط (sameAs)"
                        hint="فيسبوك وإنستجرام و X ويوتيوب و Behance و LinkedIn و Google Business… رابط واحد في كل سطر. روابط GitHub و LinkedIn اللي في «إعدادات الموقع» بتتضاف لوحدها."
                        items={draft.sameAs}
                        onChange={(sameAs) => part.set({ sameAs })}
                        addLabel="إضافة رابط"
                        itemLabel={(index) => `الرابط ${index + 1}`}
                        emptyText="مفيش روابط لسه."
                        placeholder="https://www.facebook.com/…"
                        type="url"
                        dir="ltr"
                        check={(value) => (isWebUrl(value) ? undefined : "الرابط لازم يبدأ بـ https://")}
                    />
                </Card>
            )}
        </SeoEditor>
    );
}
