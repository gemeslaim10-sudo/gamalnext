"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import type { PricingContent } from "@/lib/pricing/types";
import { TextField, ToggleField } from "./fields";
import type { UpdateContent } from "./types";

interface GeneralTabProps {
    content: PricingContent;
    update: UpdateContent;
}

/** Page header, the offer banner and the search engine texts. */
export function GeneralTab({ content, update }: GeneralTabProps) {
    const { header, offer, seo } = content;
    const setHeader = (patch: Partial<PricingContent["header"]>) =>
        update((draft) => ({ ...draft, header: { ...draft.header, ...patch } }));
    const setOffer = (patch: Partial<PricingContent["offer"]>) =>
        update((draft) => ({ ...draft, offer: { ...draft.offer, ...patch } }));
    const setSeo = (patch: Partial<PricingContent["seo"]>) => update((draft) => ({ ...draft, seo: { ...draft.seo, ...patch } }));

    return (
        <>
            <SectionCard title="رأس الصفحة" description="أول ما يراه الزائر أعلى صفحة الأسعار.">
                <div className="space-y-4">
                    <TextField
                        label="سطر صغير فوق العنوان"
                        value={header.eyebrow}
                        onChange={(eyebrow) => setHeader({ eyebrow })}
                        hint="مثل اسم البراند. اختياري."
                    />
                    <TextField label="العنوان الرئيسي" value={header.title} onChange={(title) => setHeader({ title })} />
                    <TextField
                        label="الوصف"
                        rows={2}
                        value={header.description}
                        onChange={(description) => setHeader({ description })}
                    />
                </div>
            </SectionCard>

            <SectionCard title="شريط العرض" description="سطر يلفت النظر لعرض أو خصم، يظهر تحت العنوان.">
                <div className="space-y-4">
                    <ToggleField label="إظهار الشريط" checked={offer.enabled} onChange={(enabled) => setOffer({ enabled })} />
                    <TextField label="نص العرض" rows={2} value={offer.text} onChange={(text) => setOffer({ text })} />
                </div>
            </SectionCard>

            <SectionCard title="محركات البحث (SEO)" description="عنوان ووصف الصفحة في جوجل وعند مشاركة الرابط.">
                <div className="space-y-4">
                    <TextField
                        label="عنوان الصفحة"
                        value={seo.title}
                        onChange={(title) => setSeo({ title })}
                        hint={`${seo.title.length} حرف — الأفضل حتى 60. يظهر كما هو في تبويب المتصفح.`}
                    />
                    <TextField
                        label="وصف الصفحة"
                        rows={3}
                        value={seo.description}
                        onChange={(description) => setSeo({ description })}
                        hint={`${seo.description.length} حرف — الأفضل حتى 160.`}
                    />
                    <TextField
                        label="الكلمات المفتاحية"
                        rows={2}
                        value={seo.keywords}
                        onChange={(keywords) => setSeo({ keywords })}
                        hint="افصل بينها بفاصلة (,)."
                    />
                </div>
            </SectionCard>
        </>
    );
}
