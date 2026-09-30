"use client";

import { use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SectionCard } from "@/components/admin/SectionCard";
import { useAdminDoc } from "@/components/admin/kit";
import { normalizePricing, formatPrice } from "@/lib/pricing/utils";
import { cleanSlug, servicePath } from "@/lib/services/content";
import type { ServiceItem, ServicesContent } from "@/lib/services/types";
import { TextField, ToggleField } from "../../../pricing/components/fields";
import { ServicesEditorFrame } from "../../ServicesEditorFrame";
import { SERVICES_CRUMBS, replaceService, useServicesPart } from "../../useServicesPart";

const RESERVED = new Set(["texts"]);

/** A service's visibility, address, the prices it shows and the words that pick related projects and articles. */
export default function ServiceBasicsEditor({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const pick = useCallback((content: ServicesContent) => content.items.find((item) => item.slug === slug) ?? null, [slug]);
    const apply = useCallback((content: ServicesContent, item: ServiceItem) => ({ items: replaceService(content, slug, { ...item, slug: cleanSlug(item.slug) }) }), [slug]);
    // A new address moves the editor with it
    const onSaved = useCallback((item: ServiceItem) => {
        const next = cleanSlug(item.slug);
        if (next !== slug) router.replace(`/admin/services/${next}/basics`);
    }, [slug, router]);
    const part = useServicesPart(pick, apply, onSaved);
    // For choosing which prices this page shows (read once, shared with the pricing editors)
    const pricing = useAdminDoc("site_content/pricing", normalizePricing);

    const draftSlug = part.draft ? cleanSlug(part.draft.slug) : "";
    const slugTaken = Boolean(part.content?.items.some((item) => item.slug === draftSlug && item.slug !== slug)) || RESERVED.has(draftSlug);
    const slugInvalid = !draftSlug || slugTaken;
    const priced = pricing.data ? [...pricing.data.packages, ...pricing.data.services].filter((entry) => entry.name.trim()) : [];

    return (
        <ServicesEditorFrame
            title="الظهور والربط"
            breadcrumbs={[...SERVICES_CRUMBS, { label: part.draft?.en.name || slug, href: `/admin/services/${slug}` }]}
            part={part}
            viewHref={servicePath(slug)}
            saveDisabled={slugInvalid}
        >
            {(item) => (
                <>
                    <SectionCard title="الظهور">
                        <ToggleField
                            label="الصفحة ظاهرة في الموقع"
                            hint="مخفية = مش في الموقع ولا في جوجل. كل لغة بتظهر لما يكون ليها اسم وعنوان رئيسي."
                            checked={item.visible}
                            onChange={(visible) => part.change((current) => ({ ...current, visible }))}
                        />
                        <TextField
                            label="الرابط"
                            dir="ltr"
                            value={item.slug}
                            onChange={(value) => part.change((current) => ({ ...current, slug: value }))}
                            hint={
                                slugTaken
                                    ? "الرابط ده مستخدم لخدمة تانية."
                                    : `${servicePath(draftSlug || "…")} و ${servicePath(draftSlug || "…", "ar")}. تغييره بيبطّل اللينك القديم، فغيّره قبل ما جوجل يفهرس الصفحة لو ينفع.`
                            }
                        />
                    </SectionCard>

                    <SectionCard title="الأسعار في الصفحة" description="الباقات والخدمات اللي أسعارها تظهر في جنب الصفحة (من صفحة الأسعار).">
                        {pricing.data ? (
                            <ul className="grid gap-2 sm:grid-cols-2">
                                {priced.map((entry) => {
                                    const checked = item.pricingIds.includes(entry.id);
                                    return (
                                        <li key={entry.id}>
                                            <label className="flex cursor-pointer items-start gap-3 rounded-control border border-border p-3 text-sm transition-colors hover:bg-surface-hover">
                                                <input
                                                    type="checkbox"
                                                    className="mt-0.5 size-4 accent-foreground"
                                                    checked={checked}
                                                    onChange={() =>
                                                        part.change((current) => ({
                                                            ...current,
                                                            pricingIds: checked ? current.pricingIds.filter((id) => id !== entry.id) : [...current.pricingIds, entry.id],
                                                        }))
                                                    }
                                                />
                                                <span className="min-w-0">
                                                    <span dir="auto" className="block text-foreground">
                                                        {entry.name}
                                                    </span>
                                                    <span dir="ltr" className="block text-end text-xs text-subtle">
                                                        {entry.customQuote || !entry.price ? "حسب الطلب" : formatPrice(entry.price, pricing.data!.labels.currency)}
                                                    </span>
                                                </span>
                                            </label>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted">{pricing.status === "error" ? "مقدرناش نقرا صفحة الأسعار." : "جاري التحميل…"}</p>
                        )}
                    </SectionCard>

                    <SectionCard title="المحتوى المرتبط" description="كلمات بتختار المشاريع والمقالات اللي تظهر تحت الصفحة، وبتربط المقالات والمشاريع بالخدمة دي.">
                        <TextField
                            label="كلمات المشاريع"
                            dir="ltr"
                            value={item.projectKeywords}
                            onChange={(projectKeywords) => part.change((current) => ({ ...current, projectKeywords }))}
                            hint="مفصولة بفاصلة. أي مشروع اسمه أو تقنياته أو نوعه فيه كلمة منهم بيظهر، زي: Dashboard, Firebase."
                        />
                        <TextField
                            label="كلمات المقالات"
                            dir="ltr"
                            value={item.articleKeywords}
                            onChange={(articleKeywords) => part.change((current) => ({ ...current, articleKeywords }))}
                            hint="مفصولة بفاصلة. أي مقال وسومه أو عنوانه فيه كلمة منهم بيظهر، زي: ERP, Operations."
                        />
                    </SectionCard>
                </>
            )}
        </ServicesEditorFrame>
    );
}
