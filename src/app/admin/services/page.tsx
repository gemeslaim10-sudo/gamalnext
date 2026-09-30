"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronLeft, Plus, Trash2, Type } from "lucide-react";
import { SectionCard } from "@/components/admin/SectionCard";
import { AdminHub } from "@/components/admin/kit";
import { Badge, Button, Field, Input } from "@/components/ui";
import { EMPTY_COPY, cleanSlug, hasPage, servicePath } from "@/lib/services/content";
import type { ServiceItem, ServicesContent } from "@/lib/services/types";
import { ServicesEditorFrame } from "./ServicesEditorFrame";
import { useServicesPart } from "./useServicesPart";

const pick = (content: ServicesContent) => content.items;
const apply = (_content: ServicesContent, items: ServiceItem[]) => ({ items });

// Addresses the dashboard itself uses under /admin/services
const RESERVED = new Set(["texts"]);

/** The service pages: their order, which ones are live, adding and removing. Each opens its own editor. */
export default function ServicesListEditor() {
    const part = useServicesPart(pick, apply);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");

    return (
        <ServicesEditorFrame
            title="صفحات الخدمات"
            description="صفحة لكل خدمة، بالإنجليزي وبالعربي، عشان اللي بيدوّر على الخدمة في جوجل يلاقيك. اضغط على أي خدمة عشان تعدّلها."
            breadcrumbs={[]}
            part={part}
            viewHref="/services"
        >
            {(items) => {
                const move = (index: number, offset: -1 | 1) =>
                    part.change((list) => {
                        const next = [...list];
                        const [moved] = next.splice(index, 1);
                        next.splice(index + offset, 0, moved);
                        return next;
                    });
                const remove = (item: ServiceItem) => {
                    if (!window.confirm(`تمسح صفحة «${item.en.name || item.slug}»؟ لينكها هيبطّل بعد الحفظ.`)) return;
                    part.change((list) => list.filter((entry) => entry.slug !== item.slug));
                };
                const newSlug = cleanSlug(slug || name);
                const slugTaken = items.some((item) => item.slug === newSlug) || RESERVED.has(newSlug);
                const add = () => {
                    if (!name.trim() || !newSlug || slugTaken) return;
                    part.change((list) => [
                        ...list,
                        {
                            slug: newSlug,
                            // Hidden until its texts are written, so no near-empty page goes live
                            visible: false,
                            pricingIds: [],
                            projectKeywords: "",
                            articleKeywords: "",
                            en: { ...EMPTY_COPY, name: name.trim(), h1: name.trim() },
                            ar: { ...EMPTY_COPY },
                        },
                    ]);
                    setName("");
                    setSlug("");
                };

                return (
                    <>
                        <SectionCard title="الخدمات" description={`${items.length} صفحة. الترتيب هنا هو ترتيبها في الموقع.`}>
                            <ul className="divide-y divide-border rounded-card border border-border">
                                {items.map((item, index) => (
                                    <li key={item.slug} className="flex items-center gap-1 p-2 sm:px-3">
                                        <Link
                                            href={`/admin/services/${item.slug}`}
                                            className="flex min-w-0 flex-1 items-center gap-3 rounded-control p-2 transition-colors hover:bg-surface-hover"
                                        >
                                            <span className="min-w-0 flex-1">
                                                <span dir="auto" className="block truncate text-sm font-medium text-foreground">
                                                    {item.en.name || item.ar.name || item.slug}
                                                </span>
                                                <span dir="ltr" className="mt-0.5 block truncate text-end text-xs text-subtle">
                                                    {servicePath(item.slug)}
                                                </span>
                                                <span className="mt-1.5 flex flex-wrap gap-1.5">
                                                    {!item.visible && <Badge variant="warning">مخفية</Badge>}
                                                    {item.visible && hasPage(item, "en") && <Badge>إنجليزي</Badge>}
                                                    {item.visible && hasPage(item, "ar") && <Badge>عربي</Badge>}
                                                </span>
                                            </span>
                                            <ChevronLeft aria-hidden className="size-4 shrink-0 text-subtle" />
                                        </Link>
                                        <div className="flex shrink-0 flex-col gap-0.5 sm:flex-row">
                                            <Button variant="ghost" size="icon-sm" aria-label="لفوق" disabled={index === 0} onClick={() => move(index, -1)}>
                                                <ArrowUp />
                                            </Button>
                                            <Button variant="ghost" size="icon-sm" aria-label="لتحت" disabled={index === items.length - 1} onClick={() => move(index, 1)}>
                                                <ArrowDown />
                                            </Button>
                                            <Button variant="ghost" size="icon-sm" aria-label="حذف" onClick={() => remove(item)}>
                                                <Trash2 />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </SectionCard>

                        <SectionCard title="إضافة خدمة" description="بتتضاف مخفية لحد ما تكتب نصوصها وتظهّرها من «الأساسيات».">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="اسم الخدمة بالإنجليزي" htmlFor="new-service-name">
                                    <Input id="new-service-name" dir="ltr" value={name} onChange={(e) => setName(e.target.value)} placeholder="Inventory management system" />
                                </Field>
                                <Field
                                    label="الرابط"
                                    htmlFor="new-service-slug"
                                    hint={newSlug ? `/services/${newSlug}` : "حروف إنجليزي صغيرة وشَرطة. فاضي = من الاسم."}
                                    error={newSlug && slugTaken ? "الرابط ده مستخدم." : undefined}
                                >
                                    <Input id="new-service-slug" dir="ltr" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="inventory-management-system" />
                                </Field>
                            </div>
                            <Button variant="secondary" onClick={add} disabled={!name.trim() || !newSlug || slugTaken} className="mt-4">
                                <Plus />
                                إضافة
                            </Button>
                        </SectionCard>

                        <AdminHub
                            groups={[
                                {
                                    title: "النصوص العامة",
                                    items: [
                                        { href: "/admin/services/texts/en", title: "صفحة الخدمات والنصوص بالإنجليزي", description: "عنوان ووصف صفحة /services والنصوص الصغيرة في كل صفحة خدمة.", icon: Type },
                                        { href: "/admin/services/texts/ar", title: "صفحة الخدمات والنصوص بالعربي", description: "عنوان ووصف صفحة /ar/services والنصوص الصغيرة بالعربي.", icon: Type },
                                    ],
                                },
                            ]}
                        />
                    </>
                );
            }}
        </ServicesEditorFrame>
    );
}
