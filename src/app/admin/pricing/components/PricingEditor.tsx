"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ExternalLink, RotateCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import { AdminPage, SaveBar, useAdminDoc, useDraft, useUnsavedChangesGuard, type AdminDoc } from "@/components/admin/kit";
import { Alert, Button, ButtonLink, Skeleton } from "@/components/ui";
import type { PricingContent } from "@/lib/pricing/types";
import { normalizePricing } from "@/lib/pricing/utils";

// Every pricing editor edits one part of the same document (site_content/pricing). The document is
// read once per visit and shared, and each editor saves only the fields it owns.

const PRICING_DOC = "site_content/pricing";

export interface PricingPart<P> {
    doc: AdminDoc<PricingContent>;
    /** The whole saved document (for display only, e.g. the currency) */
    content: PricingContent | null;
    draft: P | null;
    /** Changes the draft, always from its latest value */
    change: (fn: (draft: P) => P) => void;
    dirty: boolean;
    reset: () => void;
    saving: boolean;
    save: () => Promise<void>;
}

/**
 * `pick` takes the part out of the document and `toPatch` turns the edited part back into the fields
 * it owns (e.g. `{ packages, sections: { packages } }`). Define both outside the component.
 */
export function usePricingPart<P>(pick: (content: PricingContent) => P, toPatch: (part: P) => Record<string, unknown>): PricingPart<P> {
    const doc = useAdminDoc(PRICING_DOC, normalizePricing);
    const saved = useMemo(() => (doc.data ? pick(doc.data) : null), [doc.data, pick]);
    const { draft, setDraft, dirty, reset } = useDraft(saved);
    const [saving, setSaving] = useState(false);
    useUnsavedChangesGuard(dirty);

    const change = useCallback((fn: (current: P) => P) => setDraft((current) => (current ? fn(current) : current)), [setDraft]);

    const save = async () => {
        if (!draft) return;
        setSaving(true);
        try {
            await doc.save(toPatch(draft));
            toast.success("اتحفظ، وصفحة الأسعار اتحدّثت.");
        } catch (error) {
            console.error("Saving the pricing page failed:", error);
            toast.error("ما اتحفظش. اتأكد إنك داخل بحساب الأدمن وجرّب تاني.");
        } finally {
            setSaving(false);
        }
    };

    return { doc, content: doc.data, draft, change, dirty, reset, saving, save };
}

interface PricingEditorProps<P> {
    title: string;
    description?: ReactNode;
    part: PricingPart<P>;
    /** Blocks saving (e.g. an invalid field) */
    saveDisabled?: boolean;
    /** Rendered once the document has loaded */
    children: (draft: P) => ReactNode;
}

/** Frame of a pricing editor: breadcrumbs, loading and read errors, the fields, and the save bar. */
export function PricingEditor<P>({ title, description, part, saveDisabled, children }: PricingEditorProps<P>) {
    const { doc, draft } = part;

    return (
        <AdminPage
            title={title}
            description={description}
            breadcrumbs={[{ label: "الأسعار والباقات", href: "/admin/pricing" }]}
            actions={
                <ButtonLink href="/pricing" external variant="secondary" size="sm">
                    <ExternalLink />
                    عرض الصفحة
                </ButtonLink>
            }
        >
            {draft !== null ? (
                <>
                    {doc.status === "error" && (
                        <Alert variant="warning" className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <span>مقدرناش نجيب آخر نسخة، واللي قدامك هي النسخة اللي اتحمّلت قبل كده.</span>
                            <Button variant="secondary" size="sm" onClick={() => void doc.reload()} className="shrink-0">
                                <RotateCcw />
                                جرّب تاني
                            </Button>
                        </Alert>
                    )}
                    {/* Locked while saving, so nothing typed meanwhile is lost when the saved values come back */}
                    <fieldset disabled={part.saving} className="min-w-0 space-y-6">
                        {children(draft)}
                    </fieldset>
                    <SaveBar dirty={part.dirty} saving={part.saving} onSave={part.save} onReset={part.reset} disabled={saveDisabled} />
                </>
            ) : doc.status === "error" ? (
                <Alert variant="danger" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span>مقدرناش نقرا محتوى صفحة الأسعار. اتأكد من النت وجرّب تاني.</span>
                    <Button variant="secondary" size="sm" onClick={() => void doc.reload()} className="shrink-0">
                        <RotateCcw />
                        جرّب تاني
                    </Button>
                </Alert>
            ) : (
                <EditorSkeleton />
            )}
        </AdminPage>
    );
}

function EditorSkeleton() {
    return (
        <div role="status" aria-label="جاري التحميل…" className="space-y-6">
            {[0, 1].map((card) => (
                <div key={card} className="space-y-4 rounded-card border border-border bg-surface p-5 sm:p-6">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            ))}
        </div>
    );
}
