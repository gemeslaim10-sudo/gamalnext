"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import type { PricingContent, PricingItem, PricingLabels, SpecKey } from "@/lib/pricing/types";
import { SPEC_KEYS } from "@/lib/pricing/types";
import { formatPrice, newId } from "@/lib/pricing/utils";
import { AmountField, SectionTextCard, TextField, ToggleField } from "./fields";
import { ListEditor, type RowBadge } from "./ListEditor";
import type { UpdateContent } from "./types";

/** Arabic names of the spec fields in the dashboard (the visitor sees the English labels from the "Texts" tab). */
const SPEC_NAMES: Record<SpecKey, string> = {
    pages: "الصفحات",
    stack: "التقنيات",
    hosting: "الاستضافة",
    hostingCost: "تكلفة الاستضافة",
    seo: "SEO",
    editing: "سهولة التعديل",
};

const COPY = {
    packages: {
        sectionTitle: "عنوان قسم الباقات",
        listTitle: "الباقات",
        listDescription: "كل باقة تظهر ككارت في صفحة الأسعار بنفس الترتيب هنا.",
        add: "إضافة باقة",
        remove: "حذف الباقة",
        empty: "لا توجد باقات. أضف أول باقة.",
        untitled: "باقة بدون اسم",
        idPrefix: "package",
    },
    services: {
        sectionTitle: "عنوان قسم الخدمات",
        listTitle: "خدمات بعرض سعر",
        listDescription: "خدمات بدون سعر ثابت (تحليل الأعمال، ERP، CRM، ثيمات Shopify، الاستضافة…). تظهر في قسم مستقل بزر «طلب عرض سعر».",
        add: "إضافة خدمة",
        remove: "حذف الخدمة",
        empty: "لا توجد خدمات. أضف أول خدمة.",
        untitled: "خدمة بدون اسم",
        idPrefix: "service",
    },
} as const;

interface ItemsTabProps {
    kind: "packages" | "services";
    content: PricingContent;
    update: UpdateContent;
}

/** Packages and custom-quote services share the same card, so they share this editor too. */
export function ItemsTab({ kind, content, update }: ItemsTabProps) {
    const copy = COPY[kind];
    const { labels } = content;

    return (
        <>
            <SectionTextCard
                title={copy.sectionTitle}
                value={content.sections[kind]}
                onChange={(value) => update((draft) => ({ ...draft, sections: { ...draft.sections, [kind]: value } }))}
            />

            <SectionCard title={copy.listTitle} description={copy.listDescription}>
                <ListEditor<PricingItem>
                    items={content[kind]}
                    onChange={(fn) => update((draft) => ({ ...draft, [kind]: fn(draft[kind]) }))}
                    createItem={() => createItem(copy.idPrefix, kind === "services")}
                    addLabel={copy.add}
                    removeLabel={copy.remove}
                    emptyText={copy.empty}
                    untitledLabel={copy.untitled}
                    getTitle={(item) => item.name}
                    getMeta={(item) => priceSummary(item, labels)}
                    getBadges={itemBadges}
                    renderFields={(item, change) => <ItemFields item={item} change={change} labels={labels} />}
                />
            </SectionCard>
        </>
    );
}

function createItem(prefix: string, customQuote: boolean): PricingItem {
    return {
        id: newId(prefix),
        name: "",
        price: null,
        customQuote,
        description: "",
        pages: "",
        stack: "",
        hosting: "",
        hostingCost: "",
        seo: "",
        editing: "",
        featured: false,
        visible: true,
    };
}

function priceSummary(item: PricingItem, labels: PricingLabels) {
    if (item.customQuote) return "حسب الطلب";
    if (item.price === null) return "بدون سعر";
    return formatPrice(item.price, labels.currency);
}

function itemBadges(item: PricingItem): RowBadge[] {
    const badges: RowBadge[] = [];
    if (!item.name.trim()) badges.push({ label: "بدون اسم — لن تظهر", variant: "warning" });
    if (!item.visible) badges.push({ label: "مخفية" });
    if (item.featured) badges.push({ label: "مميزة", variant: "neutral" });
    return badges;
}

interface ItemFieldsProps {
    item: PricingItem;
    change: (patch: Partial<PricingItem>) => void;
    labels: PricingLabels;
}

function ItemFields({ item, change, labels }: ItemFieldsProps) {
    return (
        <>
            <TextField label="الاسم" value={item.name} onChange={(name) => change({ name })} />

            <div className="grid gap-4 sm:grid-cols-2">
                <AmountField
                    label={labels.currency.trim() ? `السعر (${labels.currency.trim()})` : "السعر"}
                    value={item.price}
                    onChange={(price) => change({ price })}
                    disabled={item.customQuote}
                    hint={item.customQuote ? "لن يظهر لأن «حسب الطلب» مفعّل." : "أرقام فقط، بدون فواصل."}
                />
                <ToggleField
                    label="حسب الطلب (بدون سعر ثابت)"
                    hint={`يظهر «${labels.customQuote}» وزر «${labels.requestQuote}».`}
                    checked={item.customQuote}
                    onChange={(customQuote) => change({ customQuote })}
                    className="sm:pt-7"
                />
            </div>

            <TextField
                label="وصف مختصر"
                rows={2}
                value={item.description}
                onChange={(description) => change({ description })}
                hint="يظهر تحت السعر."
            />

            <fieldset className="space-y-3">
                <legend className="text-sm font-medium text-foreground">المواصفات</legend>
                <p className="text-xs text-subtle">اترك أي حقل فارغًا لإخفاء سطره من الكارت.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                    {SPEC_KEYS.map((key) => (
                        <TextField
                            key={key}
                            label={SPEC_NAMES[key]}
                            value={item[key]}
                            onChange={(value) => change({ [key]: value } as Partial<PricingItem>)}
                        />
                    ))}
                </div>
            </fieldset>

            <div className="grid gap-2 sm:grid-cols-2">
                <ToggleField
                    label="ظاهرة في الصفحة"
                    checked={item.visible}
                    onChange={(visible) => change({ visible })}
                />
                <ToggleField
                    label="مميزة"
                    hint={`إطار أوضح، شارة «${labels.featured}» وزر أساسي.`}
                    checked={item.featured}
                    onChange={(featured) => change({ featured })}
                />
            </div>
        </>
    );
}
