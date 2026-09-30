"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import { DEFAULT_PRICING } from "@/lib/pricing/defaults";
import type { PricingAddon, PricingContent, PricingLabels, PricingSectionText } from "@/lib/pricing/types";
import { discountPercent, fillTemplate, formatPrice, newId } from "@/lib/pricing/utils";
import { AmountField, SectionTextCard, TextField, ToggleField } from "../components/fields";
import { ListEditor, type RowBadge } from "../components/ListEditor";
import { PricingEditor, usePricingPart } from "../components/PricingEditor";

interface AddonsPart {
    section: PricingSectionText;
    addons: PricingAddon[];
}

const pick = (content: PricingContent): AddonsPart => ({ section: content.sections.addons, addons: content.addons });
const toPatch = (part: AddonsPart) => ({ addons: part.addons, sections: { addons: part.section } });

/** Paid extras, usually with a limited-time discount. */
export default function PricingAddonsEditor() {
    const part = usePricingPart(pick, toPatch);
    const labels = part.content?.labels ?? DEFAULT_PRICING.labels;

    return (
        <PricingEditor
            title="الإضافات"
            description="اكتب السعر قبل الخصم وبعده، ونسبة الخصم بتتحسب وتظهر لوحدها. سيب «قبل الخصم» فاضي لو مفيش خصم."
            part={part}
        >
            {(draft) => (
                <>
                    <SectionCard title="الإضافات المدفوعة" description={`${draft.addons.length} في القايمة.`}>
                        <ListEditor<PricingAddon>
                            items={draft.addons}
                            onChange={(fn) => part.change((current) => ({ ...current, addons: fn(current.addons) }))}
                            createItem={createAddon}
                            addLabel="إضافة عنصر"
                            removeLabel="حذف الإضافة"
                            emptyText="مفيش إضافات لسه. ضيف أول إضافة."
                            untitledLabel="إضافة من غير اسم"
                            getTitle={(addon) => addon.name}
                            getMeta={(addon) => addonSummary(addon, labels)}
                            getBadges={addonBadges}
                            renderFields={(addon, change) => <AddonFields addon={addon} change={change} labels={labels} />}
                        />
                    </SectionCard>

                    <SectionTextCard value={draft.section} onChange={(section) => part.change((current) => ({ ...current, section }))} />
                </>
            )}
        </PricingEditor>
    );
}

function createAddon(): PricingAddon {
    return {
        id: newId("addon"),
        name: "",
        description: "",
        originalPrice: null,
        price: null,
        customQuote: false,
        featured: false,
        visible: true,
    };
}

function addonSummary(addon: PricingAddon, labels: PricingLabels) {
    if (addon.customQuote) return "حسب الطلب";
    if (addon.price === null) return "من غير سعر";
    const price = formatPrice(addon.price, labels.currency);
    const percent = discountPercent(addon.originalPrice, addon.price);
    return percent === null ? price : `${price} (خصم ${percent}%)`;
}

function addonBadges(addon: PricingAddon): RowBadge[] {
    const badges: RowBadge[] = [];
    if (!addon.name.trim()) badges.push({ label: "من غير اسم، مش هتظهر", variant: "warning" });
    if (!addon.visible) badges.push({ label: "مخفية" });
    if (addon.featured) badges.push({ label: "مميزة", variant: "neutral" });
    return badges;
}

interface AddonFieldsProps {
    addon: PricingAddon;
    change: (patch: Partial<PricingAddon>) => void;
    labels: PricingLabels;
}

function AddonFields({ addon, change, labels }: AddonFieldsProps) {
    const currency = labels.currency.trim();
    const percent = addon.customQuote ? null : discountPercent(addon.originalPrice, addon.price);

    return (
        <>
            <TextField label="الاسم" value={addon.name} onChange={(name) => change({ name })} />
            <TextField label="الوصف" rows={2} value={addon.description} onChange={(description) => change({ description })} />

            <div className="grid gap-4 sm:grid-cols-2">
                <AmountField
                    label={currency ? `السعر قبل الخصم (${currency})` : "السعر قبل الخصم"}
                    value={addon.originalPrice}
                    onChange={(originalPrice) => change({ originalPrice })}
                    disabled={addon.customQuote}
                    hint="بيظهر مشطوب. اختياري."
                />
                <AmountField
                    label={currency ? `السعر الحالي (${currency})` : "السعر الحالي"}
                    value={addon.price}
                    onChange={(price) => change({ price })}
                    disabled={addon.customQuote}
                    hint={percent !== null ? `الشارة: «${fillTemplate(labels.discount, { percent })}»` : "مفيش خصم ظاهر."}
                />
            </div>

            <div className="space-y-1">
                <ToggleField
                    label="حسب الطلب"
                    hint={`من غير سعر، وزر «${labels.requestQuote}».`}
                    checked={addon.customQuote}
                    onChange={(customQuote) => change({ customQuote })}
                />
                <ToggleField label="ظاهرة في الصفحة" checked={addon.visible} onChange={(visible) => change({ visible })} />
                <ToggleField
                    label="مميزة"
                    hint={`شارة «${labels.featured}» وزر أساسي.`}
                    checked={addon.featured}
                    onChange={(featured) => change({ featured })}
                />
            </div>
        </>
    );
}
