"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import { SEO_PARTS, isWebUrl } from "../../seoEditor";
import { TextField } from "../../components/fields";
import { BUSINESS_CRUMBS, SeoEditor, useSeoPart } from "../../components/SeoEditor";

/** Where the business is and where it works: helps Google show it to people searching nearby. */
export default function SeoAddressEditor() {
    const part = useSeoPart(SEO_PARTS.address);
    const country = part.draft?.country.trim() ?? "";
    const mapUrl = part.draft?.mapUrl.trim() ?? "";
    const countryInvalid = country !== "" && country.length !== 2;
    const mapInvalid = mapUrl !== "" && !isWebUrl(mapUrl);

    return (
        <SeoEditor
            title="العنوان ومنطقة الشغل"
            description="بيساعد جوجل يظهرك للي بيدوّروا في منطقتك."
            breadcrumbs={BUSINESS_CRUMBS}
            part={part}
            saveDisabled={countryInvalid || mapInvalid}
        >
            {(draft) => (
                <>
                    <SectionCard title="العنوان">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextField
                                label="الشارع"
                                value={draft.streetAddress}
                                onChange={(streetAddress) => part.set({ streetAddress })}
                                hint="اختياري، سيبه فاضي لو مش عايز عنوانك يظهر."
                                className="sm:col-span-2"
                            />
                            <TextField
                                label="المدينة"
                                value={draft.city}
                                onChange={(city) => part.set({ city })}
                                hint="بتتحط كمان مكان {city} في النصوص."
                            />
                            <TextField label="المحافظة / المنطقة" value={draft.region} onChange={(region) => part.set({ region })} />
                            <TextField
                                label="الرمز البريدي"
                                dir="ltr"
                                value={draft.postalCode}
                                onChange={(postalCode) => part.set({ postalCode })}
                            />
                            <TextField
                                label="الدولة"
                                dir="ltr"
                                maxLength={2}
                                value={draft.country}
                                onChange={(value) => part.set({ country: value.toUpperCase().replace(/[^A-Z]/g, "") })}
                                placeholder="EG"
                                inputClassName="w-24 uppercase"
                                error={countryInvalid ? "الكود حرفين، مثال: EG" : undefined}
                                hint="كود من حرفين بالإنجليزي: EG مصر، SA السعودية، AE الإمارات."
                            />
                            <TextField
                                label="رابط خرائط جوجل أو Google Business Profile"
                                type="url"
                                inputMode="url"
                                dir="ltr"
                                value={draft.mapUrl}
                                onChange={(value) => part.set({ mapUrl: value })}
                                placeholder="https://maps.app.goo.gl/…"
                                error={mapInvalid ? "الرابط لازم يبدأ بـ https://" : undefined}
                                hint="اختياري."
                                className="sm:col-span-2"
                            />
                        </div>
                    </SectionCard>

                    <SectionCard title="منطقة الشغل واللغات">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextField
                                label="المناطق اللي بتخدمها"
                                value={draft.areaServed}
                                onChange={(areaServed) => part.set({ areaServed })}
                                hint="افصل بفاصلة، مثال: Egypt, Worldwide"
                            />
                            <TextField
                                label="لغات التعامل مع العملاء"
                                value={draft.languages}
                                onChange={(languages) => part.set({ languages })}
                                hint="افصل بفاصلة، مثال: English, Arabic"
                            />
                        </div>
                    </SectionCard>
                </>
            )}
        </SeoEditor>
    );
}
