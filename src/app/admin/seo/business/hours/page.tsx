"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import { SEO_PARTS } from "../../seoEditor";
import { TextField } from "../../components/fields";
import { BUSINESS_CRUMBS, SeoEditor, useSeoPart } from "../../components/SeoEditor";

/** Opening hours and price range, in the formats Google reads. */
export default function SeoHoursEditor() {
    const part = useSeoPart(SEO_PARTS.hours);

    return (
        <SeoEditor title="المواعيد والأسعار" description="الاتنين اختياريين؛ الخانة الفاضية مش بتظهر لجوجل." breadcrumbs={BUSINESS_CRUMBS} part={part}>
            {(draft) => (
                <SectionCard title="المواعيد والأسعار">
                    <div className="space-y-4">
                        <TextField
                            label="مواعيد العمل"
                            dir="ltr"
                            value={draft.openingHours}
                            onChange={(openingHours) => part.set({ openingHours })}
                            placeholder="Sa-Th 10:00-20:00"
                            hint="بصيغة schema.org: أول حرفين من اسم اليوم بالإنجليزي (Sa Su Mo Tu We Th Fr) وبعدها الساعات بنظام 24 ساعة، مثال: Sa-Th 10:00-20:00."
                        />
                        <TextField
                            label="نطاق الأسعار"
                            dir="ltr"
                            value={draft.priceRange}
                            onChange={(priceRange) => part.set({ priceRange })}
                            placeholder="USD 300 – 4,000"
                            hint="فاضي = بيتحسب من صفحة الأسعار."
                        />
                    </div>
                </SectionCard>
            )}
        </SeoEditor>
    );
}
