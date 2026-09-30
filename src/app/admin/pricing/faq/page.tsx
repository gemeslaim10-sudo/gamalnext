"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import type { PricingContent, PricingFaqItem, PricingSectionText } from "@/lib/pricing/types";
import { newId } from "@/lib/pricing/utils";
import { SectionTextCard, TextField, ToggleField } from "../components/fields";
import { ListEditor, type RowBadge } from "../components/ListEditor";
import { PricingEditor, usePricingPart } from "../components/PricingEditor";

interface FaqPart {
    section: PricingSectionText;
    faq: PricingFaqItem[];
}

const pick = (content: PricingContent): FaqPart => ({ section: content.sections.faq, faq: content.faq });
const toPatch = (part: FaqPart) => ({ faq: part.faq, sections: { faq: part.section } });

function questionBadges(item: PricingFaqItem): RowBadge[] {
    const badges: RowBadge[] = [];
    if (!item.question.trim() || !item.answer.trim()) badges.push({ label: "ناقص، مش هيظهر", variant: "warning" });
    if (!item.visible) badges.push({ label: "مخفي" });
    return badges;
}

/** Questions and answers at the end of the pricing page. */
export default function PricingFaqEditor() {
    const part = usePricingPart(pick, toPatch);

    return (
        <PricingEditor title="الأسئلة الشائعة" description="القسم بيختفي من الصفحة لو مفيش أسئلة ظاهرة." part={part}>
            {(draft) => (
                <>
                    <SectionCard title="الأسئلة" description={`${draft.faq.length} في القايمة.`}>
                        <ListEditor<PricingFaqItem>
                            items={draft.faq}
                            onChange={(fn) => part.change((current) => ({ ...current, faq: fn(current.faq) }))}
                            createItem={() => ({ id: newId("faq"), question: "", answer: "", visible: true })}
                            addLabel="إضافة سؤال"
                            removeLabel="حذف السؤال"
                            emptyText="مفيش أسئلة لسه."
                            untitledLabel="سؤال من غير نص"
                            getTitle={(item) => item.question}
                            getBadges={questionBadges}
                            renderFields={(item, change) => (
                                <>
                                    <TextField label="السؤال" value={item.question} onChange={(question) => change({ question })} />
                                    <TextField label="الإجابة" rows={4} value={item.answer} onChange={(answer) => change({ answer })} />
                                    <ToggleField label="ظاهر في الصفحة" checked={item.visible} onChange={(visible) => change({ visible })} />
                                </>
                            )}
                        />
                    </SectionCard>

                    <SectionTextCard value={draft.section} onChange={(section) => part.change((current) => ({ ...current, section }))} />
                </>
            )}
        </PricingEditor>
    );
}
