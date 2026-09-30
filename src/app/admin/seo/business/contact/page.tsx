"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import { SEO_PARTS, inheritedPhone, inheritedPlaceholder } from "../../seoEditor";
import { TextField } from "../../components/fields";
import { BUSINESS_CRUMBS, SeoEditor, useInheritedSettings, useSeoPart } from "../../components/SeoEditor";

const digitsOnly = (value: string) => value.replace(/\D/g, "");

/** Phone, WhatsApp and email Google shows for the business. Empty fields use Settings. */
export default function SeoBusinessContactEditor() {
    const part = useSeoPart(SEO_PARTS.contact);
    const inherited = useInheritedSettings();

    return (
        <SeoEditor
            title="التواصل"
            description="أي خانة فاضية بتاخد القيمة المكتوبة في «إعدادات الموقع»، فمش لازم تكتبها مرتين."
            breadcrumbs={BUSINESS_CRUMBS}
            part={part}
            inherited={inherited}
        >
            {(draft) => (
                <SectionCard title="بيانات التواصل">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField
                            label="رقم التليفون"
                            type="tel"
                            inputMode="tel"
                            dir="ltr"
                            value={draft.phone}
                            onChange={(phone) => part.set({ phone })}
                            placeholder={inheritedPlaceholder(inheritedPhone(inherited.data))}
                            hint="بالصيغة الدولية، مثال: +201024531452. بيتحط كمان مكان {phone} في النصوص."
                        />
                        <TextField
                            label="رقم واتساب"
                            type="tel"
                            inputMode="numeric"
                            dir="ltr"
                            value={draft.whatsapp}
                            onChange={(value) => part.set({ whatsapp: digitsOnly(value) })}
                            placeholder={inheritedPlaceholder(inherited.data?.whatsapp)}
                            hint="أرقام بس بكود الدولة، من غير + أو مسافات."
                        />
                        <TextField
                            label="الإيميل"
                            type="email"
                            inputMode="email"
                            dir="ltr"
                            value={draft.email}
                            onChange={(email) => part.set({ email })}
                            placeholder={inheritedPlaceholder(inherited.data?.email)}
                            className="sm:col-span-2"
                        />
                    </div>
                </SectionCard>
            )}
        </SeoEditor>
    );
}
