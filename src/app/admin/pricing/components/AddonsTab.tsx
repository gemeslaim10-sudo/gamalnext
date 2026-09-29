"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import type { PricingAddon, PricingContent, PricingLabels } from "@/lib/pricing/types";
import { discountPercent, fillTemplate, formatPrice, newId } from "@/lib/pricing/utils";
import { AmountField, SectionTextCard, TextField, ToggleField } from "./fields";
import { ListEditor, type RowBadge } from "./ListEditor";
import type { UpdateContent } from "./types";

interface AddonsTabProps {
    content: PricingContent;
    update: UpdateContent;
}

export function AddonsTab({ content, update }: AddonsTabProps) {
    const { labels } = content;

    return (
        <>
            <SectionTextCard
                title="عنوان قسم الإضافات"
                value={content.sections.addons}
                onChange={(value) => update((draft) => ({ ...draft, sections: { ...draft.sections, addons: value } }))}
            />

            <SectionCard
                title="الإضافات المدفوعة"
                description="اكتب السعر قبل الخصم وبعده، ونسبة الخصم تُحسب وتظهر تلقائيًا. اترك «قبل الخصم» فارغًا لو مفيش خصم."
            >
                <ListEditor<PricingAddon>
                    items={content.addons}
                    onChange={(fn) => update((draft) => ({ ...draft, addons: fn(draft.addons) }))}
                    createItem={createAddon}
                    addLabel="إضافة عنصر"
                    removeLabel="حذف الإضافة"
                    emptyText="لا توجد إضافات. أضف أول إضافة."
                    untitledLabel="إضافة بدون اسم"
                    getTitle={(addon) => addon.name}
                    getMeta={(addon) => addonSummary(addon, labels)}
                    getBadges={addonBadges}
                    renderFields={(addon, change) => <AddonFields addon={addon} change={change} labels={labels} />}
                />
            </SectionCard>
        </>
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
    if (addon.price === null) return "بدون سعر";
    const price = formatPrice(addon.price, labels.currency);
    const percent = discountPercent(addon.originalPrice, addon.price);
    return percent === null ? price : `${price} (خصم ${percent}%)`;
}

function addonBadges(addon: PricingAddon): RowBadge[] {
    const badges: RowBadge[] = [];
    if (!addon.name.trim()) badges.push({ label: "بدون اسم — لن تظهر", variant: "warning" });
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
                    hint="يظهر مشطوبًا. اختياري."
                />
                <AmountField
                    label={currency ? `السعر الحالي (${currency})` : "السعر الحالي"}
                    value={addon.price}
                    onChange={(price) => change({ price })}
                    disabled={addon.customQuote}
                    hint={
                        percent !== null
                            ? `الشارة: «${fillTemplate(labels.discount, { percent })}»`
                            : "لا يوجد خصم معروض."
                    }
                />
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
                <ToggleField
                    label="حسب الطلب"
                    hint={`بدون سعر، وزر «${labels.requestQuote}».`}
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
