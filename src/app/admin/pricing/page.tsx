"use client";

import { useState } from "react";
import { ExternalLink, RotateCcw, Save } from "lucide-react";
import { Alert, Button, ButtonLink, Chip, LoadingBlock, PageHeader } from "@/components/ui";
import type { PricingContent } from "@/lib/pricing/types";
import { AddonsTab } from "./components/AddonsTab";
import { ContactTab } from "./components/ContactTab";
import { GeneralTab } from "./components/GeneralTab";
import { InfoTab } from "./components/InfoTab";
import { ItemsTab } from "./components/ItemsTab";
import { LabelsTab } from "./components/LabelsTab";
import { usePricingEditor } from "./usePricingEditor";

const TABS: { id: string; label: string; count?: (content: PricingContent) => number }[] = [
    { id: "general", label: "رأس الصفحة و SEO" },
    { id: "packages", label: "الباقات", count: (c) => c.packages.length },
    { id: "addons", label: "الإضافات", count: (c) => c.addons.length },
    { id: "services", label: "الخدمات", count: (c) => c.services.length },
    { id: "info", label: "معلومات وأسئلة" },
    { id: "contact", label: "التواصل" },
    { id: "labels", label: "النصوص" },
];

const savedAtFormat = new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" });

export default function AdminPricingPage() {
    const { status, draft, update, dirty, saving, save, discard, retry, updatedAt } = usePricingEditor();
    const [tab, setTab] = useState("packages");

    const canSave = !saving && (dirty || status === "missing");
    const statusText = saving
        ? "جارٍ الحفظ…"
        : dirty
          ? "توجد تغييرات غير محفوظة."
          : status === "missing"
            ? "المحتوى الافتراضي، لم يُحفظ بعد."
            : updatedAt
              ? `آخر حفظ: ${savedAtFormat.format(updatedAt)}`
              : "لا توجد تغييرات.";

    const confirmDiscard = () => {
        if (window.confirm("تجاهل كل التغييرات غير المحفوظة؟")) discard();
    };

    return (
        <div className="max-w-content">
            <PageHeader
                title="الأسعار والباقات"
                description="كل محتوى صفحة الأسعار: الباقات، الإضافات، الخدمات، المعلومات، الأسئلة والتواصل."
                actions={
                    <ButtonLink href="/pricing" external variant="secondary">
                        <ExternalLink />
                        عرض الصفحة
                    </ButtonLink>
                }
            />

            {status === "loading" && <LoadingBlock label="جارٍ تحميل المحتوى…" />}

            {status === "error" && (
                <Alert variant="danger" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span>تعذر تحميل محتوى صفحة الأسعار. المحرر مغلق حتى لا يُستبدل المحتوى الحالي بالمحتوى الافتراضي.</span>
                    <Button variant="secondary" onClick={retry} className="shrink-0">
                        <RotateCcw />
                        إعادة المحاولة
                    </Button>
                </Alert>
            )}

            {draft && (
                <>
                    {status === "missing" && (
                        <Alert variant="warning" className="mb-6">
                            لا يوجد محتوى محفوظ لصفحة الأسعار بعد، والصفحة لن تظهر للزوار حتى تحفظ. المعروض هنا هو المحتوى
                            الافتراضي: راجعه ثم اضغط «حفظ».
                        </Alert>
                    )}

                    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
                        {TABS.map((item) => (
                            <Chip key={item.id} active={tab === item.id} onClick={() => setTab(item.id)}>
                                {item.label}
                                {item.count && <span className="tabular-nums opacity-60">{item.count(draft)}</span>}
                            </Chip>
                        ))}
                    </div>

                    <div className="mt-6 space-y-6">
                        {tab === "general" && <GeneralTab content={draft} update={update} />}
                        {tab === "packages" && <ItemsTab kind="packages" content={draft} update={update} />}
                        {tab === "addons" && <AddonsTab content={draft} update={update} />}
                        {tab === "services" && <ItemsTab kind="services" content={draft} update={update} />}
                        {tab === "info" && <InfoTab content={draft} update={update} />}
                        {tab === "contact" && <ContactTab content={draft} update={update} />}
                        {tab === "labels" && <LabelsTab content={draft} update={update} />}
                    </div>

                    {/* Always reachable: one Save writes the whole page */}
                    <div className="sticky bottom-3 z-20 mt-8 flex flex-wrap items-center justify-between gap-3 rounded-card border border-border-strong bg-surface px-4 py-3">
                        <p role="status" className="min-w-0 text-xs text-subtle">
                            {statusText}
                        </p>
                        <div className="flex gap-2">
                            <Button variant="ghost" onClick={confirmDiscard} disabled={!dirty || saving}>
                                <RotateCcw />
                                تراجع
                            </Button>
                            <Button onClick={save} disabled={!canSave}>
                                <Save />
                                {saving ? "جارٍ الحفظ…" : "حفظ"}
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
