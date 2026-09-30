"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import type { PricingContent, PricingInfoCard, PricingSectionText } from "@/lib/pricing/types";
import { newId } from "@/lib/pricing/utils";
import { SectionTextCard, TextField, ToggleField } from "../components/fields";
import { ListEditor, type RowBadge } from "../components/ListEditor";
import { PricingEditor, usePricingPart } from "../components/PricingEditor";

interface InfoPart {
    section: PricingSectionText;
    cards: PricingInfoCard[];
}

const pick = (content: PricingContent): InfoPart => ({ section: content.sections.info, cards: content.infoCards });
const toPatch = (part: InfoPart) => ({ infoCards: part.cards, sections: { info: part.section } });

function cardBadges(card: PricingInfoCard): RowBadge[] {
    const badges: RowBadge[] = [];
    if (!card.title.trim() && !card.text.trim()) badges.push({ label: "فاضي، مش هيظهر", variant: "warning" });
    if (!card.visible) badges.push({ label: "مخفي" });
    return badges;
}

/** Short notes shown as cards ("Good to know"). */
export default function PricingInfoEditor() {
    const part = usePricingPart(pick, toPatch);

    return (
        <PricingEditor title="كروت المعلومات" description="ملاحظات قصيرة بتظهر ككروت، زي الهوية البصرية والصيانة." part={part}>
            {(draft) => (
                <>
                    <SectionCard title="الكروت" description={`${draft.cards.length} في القايمة.`}>
                        <ListEditor<PricingInfoCard>
                            items={draft.cards}
                            onChange={(fn) => part.change((current) => ({ ...current, cards: fn(current.cards) }))}
                            createItem={() => ({ id: newId("info"), title: "", text: "", visible: true })}
                            addLabel="إضافة كارت"
                            removeLabel="حذف الكارت"
                            emptyText="مفيش كروت لسه."
                            untitledLabel="كارت من غير عنوان"
                            getTitle={(card) => card.title}
                            getBadges={cardBadges}
                            renderFields={(card, change) => (
                                <>
                                    <TextField label="العنوان" value={card.title} onChange={(title) => change({ title })} />
                                    <TextField label="النص" rows={3} value={card.text} onChange={(text) => change({ text })} />
                                    <ToggleField label="ظاهر في الصفحة" checked={card.visible} onChange={(visible) => change({ visible })} />
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
