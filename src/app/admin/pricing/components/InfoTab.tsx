"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import type { PricingContent, PricingFaqItem, PricingInfoCard } from "@/lib/pricing/types";
import { newId } from "@/lib/pricing/utils";
import { SectionTextCard, TextField, ToggleField } from "./fields";
import { ListEditor, type RowBadge } from "./ListEditor";
import type { UpdateContent } from "./types";

interface InfoTabProps {
    content: PricingContent;
    update: UpdateContent;
}

/** The info cards ("Good to know") and the FAQ. */
export function InfoTab({ content, update }: InfoTabProps) {
    return (
        <>
            <SectionTextCard
                title="عنوان قسم المعلومات"
                value={content.sections.info}
                onChange={(value) => update((draft) => ({ ...draft, sections: { ...draft.sections, info: value } }))}
            />

            <SectionCard title="كروت المعلومات" description="ملاحظات قصيرة تظهر ككروت، مثل الهوية البصرية والصيانة.">
                <ListEditor<PricingInfoCard>
                    items={content.infoCards}
                    onChange={(fn) => update((draft) => ({ ...draft, infoCards: fn(draft.infoCards) }))}
                    createItem={() => ({ id: newId("info"), title: "", text: "", visible: true })}
                    addLabel="إضافة كارت"
                    removeLabel="حذف الكارت"
                    emptyText="لا توجد كروت."
                    untitledLabel="كارت بدون عنوان"
                    getTitle={(card) => card.title}
                    getBadges={(card) => hiddenBadge(card.visible, !card.title.trim() && !card.text.trim())}
                    renderFields={(card, change) => (
                        <>
                            <TextField label="العنوان" value={card.title} onChange={(title) => change({ title })} />
                            <TextField label="النص" rows={3} value={card.text} onChange={(text) => change({ text })} />
                            <ToggleField label="ظاهر في الصفحة" checked={card.visible} onChange={(visible) => change({ visible })} />
                        </>
                    )}
                />
            </SectionCard>

            <SectionTextCard
                title="عنوان قسم الأسئلة الشائعة"
                value={content.sections.faq}
                onChange={(value) => update((draft) => ({ ...draft, sections: { ...draft.sections, faq: value } }))}
            />

            <SectionCard title="الأسئلة الشائعة" description="القسم يختفي من الصفحة لو مفيش أسئلة ظاهرة.">
                <ListEditor<PricingFaqItem>
                    items={content.faq}
                    onChange={(fn) => update((draft) => ({ ...draft, faq: fn(draft.faq) }))}
                    createItem={() => ({ id: newId("faq"), question: "", answer: "", visible: true })}
                    addLabel="إضافة سؤال"
                    removeLabel="حذف السؤال"
                    emptyText="لا توجد أسئلة."
                    untitledLabel="سؤال بدون نص"
                    getTitle={(item) => item.question}
                    getBadges={(item) => hiddenBadge(item.visible, !item.question.trim() || !item.answer.trim())}
                    renderFields={(item, change) => (
                        <>
                            <TextField label="السؤال" value={item.question} onChange={(question) => change({ question })} />
                            <TextField label="الإجابة" rows={3} value={item.answer} onChange={(answer) => change({ answer })} />
                            <ToggleField label="ظاهر في الصفحة" checked={item.visible} onChange={(visible) => change({ visible })} />
                        </>
                    )}
                />
            </SectionCard>
        </>
    );
}

function hiddenBadge(visible: boolean, incomplete: boolean): RowBadge[] {
    const badges: RowBadge[] = [];
    if (incomplete) badges.push({ label: "ناقص — لن يظهر", variant: "warning" });
    if (!visible) badges.push({ label: "مخفي" });
    return badges;
}
