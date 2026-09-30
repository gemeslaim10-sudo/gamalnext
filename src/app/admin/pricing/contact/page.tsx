"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import type { PricingContactNumber, PricingContent, PricingSectionText } from "@/lib/pricing/types";
import { newId, phoneLinks } from "@/lib/pricing/utils";
import { SectionTextCard, TextField, ToggleField } from "../components/fields";
import { ListEditor, type RowBadge } from "../components/ListEditor";
import { PricingEditor, usePricingPart } from "../components/PricingEditor";

interface ContactPart {
    section: PricingSectionText;
    contact: PricingContent["contact"];
}

const pick = (content: PricingContent): ContactPart => ({ section: content.sections.contact, contact: content.contact });
const toPatch = (part: ContactPart) => ({ contact: part.contact, sections: { contact: part.section } });

/** Phone numbers (call + WhatsApp buttons) and the email card of the contact section. */
export default function PricingContactEditor() {
    const part = usePricingPart(pick, toPatch);
    const setContact = (patch: Partial<ContactPart["contact"]>) =>
        part.change((current) => ({ ...current, contact: { ...current.contact, ...patch } }));

    return (
        <PricingEditor title="أرقام التواصل" description="قسم التواصل في آخر صفحة الأسعار: كل رقم في كارت بزر اتصال، وزر واتساب لو شغّلته." part={part}>
            {({ section, contact }) => {
                const numberBadges = (entry: PricingContactNumber): RowBadge[] => [
                    ...(phoneLinks(entry.number, contact.countryCode) ? [] : [{ label: "من غير رقم، مش هيظهر", variant: "warning" as const }]),
                    ...(entry.whatsapp ? [{ label: "واتساب" }] : []),
                ];

                return (
                    <>
                        <SectionCard title="الأرقام">
                            <div className="space-y-5">
                                <ListEditor<PricingContactNumber>
                                    items={contact.numbers}
                                    onChange={(fn) =>
                                        part.change((current) => ({ ...current, contact: { ...current.contact, numbers: fn(current.contact.numbers) } }))
                                    }
                                    createItem={() => ({ id: newId("number"), label: "", number: "", whatsapp: true })}
                                    addLabel="إضافة رقم"
                                    removeLabel="حذف الرقم"
                                    emptyText="مفيش أرقام لسه."
                                    untitledLabel="رقم من غير اسم"
                                    getTitle={(entry) => entry.label || entry.number}
                                    getMeta={(entry) => (entry.label ? <bdi dir="ltr">{entry.number}</bdi> : undefined)}
                                    getBadges={numberBadges}
                                    renderFields={(entry, change) => {
                                        const links = phoneLinks(entry.number, contact.countryCode);
                                        return (
                                            <>
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <TextField
                                                        label="الاسم الظاهر"
                                                        value={entry.label}
                                                        onChange={(label) => change({ label })}
                                                        placeholder="Primary"
                                                    />
                                                    <TextField
                                                        label="الرقم"
                                                        type="tel"
                                                        dir="ltr"
                                                        value={entry.number}
                                                        onChange={(number) => change({ number })}
                                                        placeholder="01024531452"
                                                        hint="زي ما الزائر هيقراه."
                                                    />
                                                </div>
                                                <ToggleField
                                                    label="عليه واتساب"
                                                    hint="بيضيف زر واتساب جنب زر الاتصال."
                                                    checked={entry.whatsapp}
                                                    onChange={(whatsapp) => change({ whatsapp })}
                                                />
                                                {links && (
                                                    <p className="break-all text-xs text-subtle">
                                                        <bdi dir="ltr">
                                                            {links.tel}
                                                            {entry.whatsapp && ` · ${links.whatsapp}`}
                                                        </bdi>
                                                    </p>
                                                )}
                                            </>
                                        );
                                    }}
                                />

                                <TextField
                                    label="كود الدولة"
                                    dir="ltr"
                                    value={contact.countryCode}
                                    onChange={(countryCode) => setContact({ countryCode })}
                                    placeholder="20"
                                    hint="من غير +. بيحوّل الأرقام المحلية (01…) لروابط اتصال وواتساب دولية."
                                    className="sm:max-w-56"
                                />
                            </div>
                        </SectionCard>

                        <SectionCard title="الإيميل" description="اختياري. بيظهر في كارت بزر «إرسال إيميل».">
                            <TextField
                                label="الإيميل"
                                type="email"
                                dir="ltr"
                                value={contact.email}
                                onChange={(email) => setContact({ email })}
                                hint="سيبه فاضي عشان الكارت يختفي."
                            />
                        </SectionCard>

                        <SectionTextCard value={section} onChange={(next) => part.change((current) => ({ ...current, section: next }))} />
                    </>
                );
            }}
        </PricingEditor>
    );
}
