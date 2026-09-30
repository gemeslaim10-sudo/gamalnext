"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import type { PricingContent, PricingItem, PricingLabels, PricingSectionText, SpecKey } from "@/lib/pricing/types";
import { DEFAULT_PRICING } from "@/lib/pricing/defaults";
import { SPEC_KEYS } from "@/lib/pricing/types";
import { formatPrice, newId } from "@/lib/pricing/utils";
import { AmountField, SectionTextCard, TextField, ToggleField } from "./fields";
import { ListEditor, type RowBadge } from "./ListEditor";
import { PricingEditor, usePricingPart } from "./PricingEditor";

// Website packages and custom-quote services share the same card on the page, so they share this editor.

type Kind = "packages" | "services";

interface ItemsPart {
    section: PricingSectionText;
    items: PricingItem[];
}

/** Arabic names of the spec rows in the dashboard (visitors see the English labels from "نصوص الأزرار والأسعار"). */
const SPEC_NAMES: Record<SpecKey, string> = {
    pages: "الصفحات",
    hosting: "الاستضافة",
    hostingCost: "تكلفة الاستضافة",
};

// Stable per kind: the editor hook needs `pick` and `toPatch` defined outside the component
const PARTS = {
    packages: {
        pick: (content: PricingContent): ItemsPart => ({ section: content.sections.packages, items: content.packages }),
        toPatch: (part: ItemsPart) => ({ packages: part.items, sections: { packages: part.section } }),
    },
    services: {
        pick: (content: PricingContent): ItemsPart => ({ section: content.sections.services, items: content.services }),
        toPatch: (part: ItemsPart) => ({ services: part.items, sections: { services: part.section } }),
    },
} satisfies Record<Kind, unknown>;

const COPY = {
    packages: {
        title: "الباقات",
        description: "كل باقة بتظهر ككارت في صفحة الأسعار بنفس الترتيب هنا. افتح الباقة عشان تعدّلها.",
        listTitle: "الباقات",
        add: "إضافة باقة",
        remove: "حذف الباقة",
        empty: "مفيش باقات لسه. ضيف أول باقة.",
        untitled: "باقة من غير اسم",
        idPrefix: "package",
    },
    services: {
        title: "الخدمات بعرض سعر",
        description: "خدمات من غير سعر ثابت (تحليل الأعمال، ERP، CRM، ثيمات Shopify، الاستضافة…) بتظهر في قسم لوحدها بزر «طلب عرض سعر».",
        listTitle: "الخدمات",
        add: "إضافة خدمة",
        remove: "حذف الخدمة",
        empty: "مفيش خدمات لسه. ضيف أول خدمة.",
        untitled: "خدمة من غير اسم",
        idPrefix: "service",
    },
} as const;

export function ItemsEditor({ kind }: { kind: Kind }) {
    const copy = COPY[kind];
    const part = usePricingPart(PARTS[kind].pick, PARTS[kind].toPatch);
    const labels = part.content?.labels ?? DEFAULT_PRICING.labels;

    return (
        <PricingEditor title={copy.title} description={copy.description} part={part}>
            {(draft) => (
                <>
                    <SectionCard title={copy.listTitle} description={`${draft.items.length} في القايمة.`}>
                        <ListEditor<PricingItem>
                            items={draft.items}
                            onChange={(fn) => part.change((current) => ({ ...current, items: fn(current.items) }))}
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

                    <SectionTextCard value={draft.section} onChange={(section) => part.change((current) => ({ ...current, section }))} />
                </>
            )}
        </PricingEditor>
    );
}

function createItem(prefix: string, customQuote: boolean): PricingItem {
    return {
        id: newId(prefix),
        name: "",
        price: null,
        customQuote,
        priceFrom: false,
        description: "",
        pages: "",
        hosting: "",
        hostingCost: "",
        featured: false,
        visible: true,
    };
}

function priceSummary(item: PricingItem, labels: PricingLabels) {
    if (item.customQuote) return "حسب الطلب";
    if (item.price === null) return "من غير سعر";
    return `${item.priceFrom ? "يبدأ من " : ""}${formatPrice(item.price, labels.currency)}`;
}

function itemBadges(item: PricingItem): RowBadge[] {
    const badges: RowBadge[] = [];
    if (!item.name.trim()) badges.push({ label: "من غير اسم، مش هتظهر", variant: "warning" });
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
    const currency = labels.currency.trim();
    return (
        <>
            <TextField label="الاسم" value={item.name} onChange={(name) => change({ name })} />

            <div className="grid gap-4 sm:grid-cols-2">
                <AmountField
                    label={currency ? `السعر (${currency})` : "السعر"}
                    value={item.price}
                    onChange={(price) => change({ price })}
                    disabled={item.customQuote}
                    hint={item.customQuote ? "مش هيظهر عشان «حسب الطلب» شغال." : "أرقام بس، من غير فواصل."}
                />
                <ToggleField
                    label="حسب الطلب (من غير سعر ثابت)"
                    hint={`بيظهر «${labels.customQuote}» وزر «${labels.requestQuote}».`}
                    checked={item.customQuote}
                    onChange={(customQuote) => change({ customQuote })}
                    className="sm:pt-7"
                />
            </div>

            {!item.customQuote && (
                <ToggleField
                    label="السعر ده بداية (يبدأ من)"
                    hint={`بيظهر «${labels.priceFrom}» قبل السعر، للأنظمة اللي سعرها بيزيد حسب المطلوب.`}
                    checked={Boolean(item.priceFrom)}
                    onChange={(priceFrom) => change({ priceFrom })}
                />
            )}

            <TextField
                label="وصف قصير"
                rows={2}
                value={item.description}
                onChange={(description) => change({ description })}
                hint="بيظهر تحت السعر."
            />

            <fieldset className="space-y-3">
                <legend className="text-sm font-medium text-foreground">المواصفات</legend>
                <p className="text-xs text-subtle">سيب أي خانة فاضية عشان سطرها يختفي من الكارت.</p>
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

            <div className="space-y-1">
                <ToggleField label="ظاهرة في الصفحة" checked={item.visible} onChange={(visible) => change({ visible })} />
                <ToggleField
                    label="مميزة"
                    hint={`إطار أوضح، وشارة «${labels.featured}»، وزر أساسي.`}
                    checked={item.featured}
                    onChange={(featured) => change({ featured })}
                />
            </div>
        </>
    );
}
