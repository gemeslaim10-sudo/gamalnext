"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import type { PricingContactNumber, PricingContent } from "@/lib/pricing/types";
import { newId, phoneLinks } from "@/lib/pricing/utils";
import { SectionTextCard, TextField, ToggleField } from "./fields";
import { ListEditor } from "./ListEditor";
import type { UpdateContent } from "./types";

interface ContactTabProps {
    content: PricingContent;
    update: UpdateContent;
}

export function ContactTab({ content, update }: ContactTabProps) {
    const { contact } = content;
    const setContact = (patch: Partial<PricingContent["contact"]>) =>
        update((draft) => ({ ...draft, contact: { ...draft.contact, ...patch } }));

    return (
        <>
            <SectionTextCard
                title="عنوان قسم التواصل"
                value={content.sections.contact}
                onChange={(value) => update((draft) => ({ ...draft, sections: { ...draft.sections, contact: value } }))}
            />

            <SectionCard title="أرقام التواصل" description="كل رقم يظهر في كارت بزر اتصال، وزر واتساب لو فعّلته.">
                <div className="space-y-5">
                    <TextField
                        label="كود الدولة"
                        dir="ltr"
                        value={contact.countryCode}
                        onChange={(countryCode) => setContact({ countryCode })}
                        placeholder="20"
                        hint="بدون +. يُستخدم لتحويل الأرقام المحلية (01…) لروابط اتصال وواتساب دولية."
                        className="sm:max-w-48"
                    />

                    <ListEditor<PricingContactNumber>
                        items={contact.numbers}
                        onChange={(fn) => update((draft) => ({ ...draft, contact: { ...draft.contact, numbers: fn(draft.contact.numbers) } }))}
                        createItem={() => ({ id: newId("number"), label: "", number: "", whatsapp: true })}
                        addLabel="إضافة رقم"
                        removeLabel="حذف الرقم"
                        emptyText="لا توجد أرقام."
                        untitledLabel="رقم بدون اسم"
                        getTitle={(entry) => entry.label || entry.number}
                        getMeta={(entry) => (entry.label ? entry.number : undefined)}
                        getBadges={(entry) => [
                            ...(phoneLinks(entry.number, contact.countryCode)
                                ? []
                                : [{ label: "بدون رقم — لن يظهر", variant: "warning" as const }]),
                            ...(entry.whatsapp ? [{ label: "واتساب" }] : []),
                        ]}
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
                                            hint="كما سيقرؤه الزائر."
                                        />
                                    </div>
                                    <ToggleField
                                        label="عليه واتساب"
                                        hint="يضيف زر واتساب بجانب زر الاتصال."
                                        checked={entry.whatsapp}
                                        onChange={(whatsapp) => change({ whatsapp })}
                                    />
                                    {links && (
                                        <p dir="ltr" className="break-all text-xs text-subtle">
                                            {links.tel}
                                            {entry.whatsapp && ` · ${links.whatsapp}`}
                                        </p>
                                    )}
                                </>
                            );
                        }}
                    />
                </div>
            </SectionCard>

            <SectionCard title="البريد الإلكتروني" description="اختياري. يظهر في كارت مع زر إرسال بريد.">
                <TextField
                    label="البريد"
                    type="email"
                    dir="ltr"
                    value={contact.email}
                    onChange={(email) => setContact({ email })}
                    hint="اتركه فارغًا لإخفائه."
                />
            </SectionCard>
        </>
    );
}
