"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import type { PricingContent } from "@/lib/pricing/types";
import { TextField, ToggleField } from "../components/fields";
import { PricingEditor, usePricingPart } from "../components/PricingEditor";

type HeaderPart = Pick<PricingContent, "header" | "offer">;

const pick = (content: PricingContent): HeaderPart => ({ header: content.header, offer: content.offer });
const toPatch = (part: HeaderPart) => ({ header: part.header, offer: part.offer });

/** The top of the pricing page and the offer banner under it. */
export default function PricingHeaderEditor() {
    const part = usePricingPart(pick, toPatch);
    const setHeader = (patch: Partial<HeaderPart["header"]>) => part.change((draft) => ({ ...draft, header: { ...draft.header, ...patch } }));
    const setOffer = (patch: Partial<HeaderPart["offer"]>) => part.change((draft) => ({ ...draft, offer: { ...draft.offer, ...patch } }));

    return (
        <PricingEditor title="رأس الصفحة والعرض" description="أول حاجة الزائر بيشوفها فوق صفحة الأسعار." part={part}>
            {({ header, offer }) => (
                <>
                    <SectionCard title="رأس الصفحة">
                        <div className="space-y-4">
                            <TextField
                                label="سطر صغير فوق العنوان"
                                value={header.eyebrow}
                                onChange={(eyebrow) => setHeader({ eyebrow })}
                                hint="زي اسم البراند. اختياري."
                            />
                            <TextField label="العنوان الرئيسي" value={header.title} onChange={(title) => setHeader({ title })} />
                            <TextField label="الوصف" rows={3} value={header.description} onChange={(description) => setHeader({ description })} />
                        </div>
                    </SectionCard>

                    <SectionCard title="شريط العرض" description="سطر بيلفت النظر لعرض أو خصم، بيظهر تحت العنوان.">
                        <div className="space-y-4">
                            <ToggleField label="إظهار الشريط" checked={offer.enabled} onChange={(enabled) => setOffer({ enabled })} />
                            <TextField label="نص العرض" rows={2} value={offer.text} onChange={(text) => setOffer({ text })} />
                        </div>
                    </SectionCard>
                </>
            )}
        </PricingEditor>
    );
}
