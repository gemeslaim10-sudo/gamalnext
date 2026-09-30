"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import {
    AdminPage,
    SaveBar,
    useAdminDoc,
    useDraft,
    useUnsavedChangesGuard,
    type AdminDoc,
    type Crumb,
} from "@/components/admin/kit";
import { Alert, Button, Skeleton } from "@/components/ui";
import { DEFAULT_SEO, normalizeSeo, type SeoSettings } from "@/lib/seo/settings";
import { isEqual, tidySeo, toInherited, type InheritedSettings, type SeoPartSpec } from "../seoEditor";

// Every SEO editor edits one part of site_content/seo (read once per visit and shared) and saves
// only that part. Editors that show values from Settings also read site_content/settings.

export const SEO_CRUMBS: Crumb[] = [{ label: "الـ SEO والظهور", href: "/admin/seo" }];
export const BUSINESS_CRUMBS: Crumb[] = [...SEO_CRUMBS, { label: "بيانات النشاط التجاري", href: "/admin/seo/business" }];
export const PAGES_CRUMBS: Crumb[] = [...SEO_CRUMBS, { label: "الصفحات", href: "/admin/seo/pages" }];

export interface SeoPart<P> {
    doc: AdminDoc<SeoSettings>;
    draft: P | null;
    /** The saved settings with the draft in place, for previews */
    merged: SeoSettings | null;
    change: (fn: (draft: P) => P) => void;
    set: (patch: Partial<P>) => void;
    dirty: boolean;
    reset: () => void;
    /** Puts the default values in the fields (saved only with "Save") */
    applyDefaults: () => void;
    isDefault: boolean;
    saving: boolean;
    save: () => Promise<void>;
}

/** One part of the SEO settings. Pass a spec from SEO_PARTS / SEO_PAGE_PARTS (stable objects). */
export function useSeoPart<P extends object>(spec: SeoPartSpec<P>): SeoPart<P> {
    const doc = useAdminDoc("site_content/seo", normalizeSeo);
    const saved = useMemo(() => (doc.data ? spec.pick(doc.data) : null), [doc.data, spec]);
    const { draft, setDraft, dirty, reset } = useDraft(saved);
    const [saving, setSaving] = useState(false);
    useUnsavedChangesGuard(dirty);

    const merged = useMemo(() => (doc.data && draft ? spec.apply(doc.data, draft) : null), [doc.data, draft, spec]);
    const defaults = useMemo(() => spec.pick(DEFAULT_SEO), [spec]);

    const change = useCallback((fn: (current: P) => P) => setDraft((current) => (current ? fn(current) : current)), [setDraft]);
    const set = useCallback((patch: Partial<P>) => change((current) => ({ ...current, ...patch })), [change]);

    const save = async () => {
        if (!merged) return;
        setSaving(true);
        try {
            // Trimmed texts and no empty list rows: the document holds exactly what the site uses
            await doc.save(spec.patch(tidySeo(merged)));
            toast.success("اتحفظ، والموقع كله اتحدّث.");
        } catch (error) {
            console.error("Saving SEO settings failed:", error);
            toast.error("ما اتحفظش. اتأكد إنك داخل بحساب الأدمن وجرّب تاني.");
        } finally {
            setSaving(false);
        }
    };

    return {
        doc,
        draft,
        merged,
        change,
        set,
        dirty,
        reset,
        applyDefaults: () => setDraft(structuredClone(defaults)),
        isDefault: draft !== null && isEqual(draft, defaults),
        saving,
        save,
    };
}

export interface InheritedState {
    /** null while loading or when Settings couldn't be read */
    data: InheritedSettings | null;
    loading: boolean;
    failed: boolean;
}

/** Site name, owner, phone… from Settings, which empty SEO fields fall back to. */
export function useInheritedSettings(): InheritedState {
    const doc = useAdminDoc("site_content/settings", toInherited);
    return { data: doc.data, loading: doc.loading, failed: doc.status === "error" && !doc.data };
}

interface SeoEditorProps<P extends object> {
    title: string;
    description?: ReactNode;
    breadcrumbs?: Crumb[];
    part: SeoPart<P>;
    /** Pass it when the editor shows values from Settings: the fields wait for them */
    inherited?: InheritedState;
    /** Extra buttons next to the title */
    actions?: ReactNode;
    saveDisabled?: boolean;
    children: (draft: P, merged: SeoSettings) => ReactNode;
}

/** Frame of an SEO editor: breadcrumbs, loading and read errors, "defaults", the fields and the save bar. */
export function SeoEditor<P extends object>({
    title,
    description,
    breadcrumbs = SEO_CRUMBS,
    part,
    inherited,
    actions,
    saveDisabled,
    children,
}: SeoEditorProps<P>) {
    const { doc, draft, merged } = part;
    const ready = draft !== null && merged !== null && !inherited?.loading;

    return (
        <AdminPage
            title={title}
            description={description}
            breadcrumbs={breadcrumbs}
            actions={
                actions || ready ? (
                    <>
                        {actions}
                        {ready && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={part.applyDefaults}
                                disabled={part.isDefault || part.saving}
                                title="بيحط القيم الافتراضية في الخانات، ومش بيتحفظ غير لما تضغط «حفظ»"
                            >
                                <RotateCcw />
                                القيم الافتراضية
                            </Button>
                        )}
                    </>
                ) : undefined
            }
        >
            {ready ? (
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
                    {inherited?.failed && (
                        <Alert variant="warning" className="mb-6">
                            مقدرناش نقرا «إعدادات الموقع»، فالقيم اللي بتتاخد منها (اسم الموقع، التليفون، الإيميل…) مش ظاهرة في الخانات
                            والمعاينة. الحفظ شغال عادي.
                        </Alert>
                    )}
                    {/* Locked while saving, so nothing typed meanwhile is lost when the saved values come back */}
                    <fieldset disabled={part.saving} className="min-w-0 space-y-6">
                        {children(draft, merged)}
                    </fieldset>
                    <SaveBar dirty={part.dirty} saving={part.saving} onSave={part.save} onReset={part.reset} disabled={saveDisabled} />
                </>
            ) : doc.status === "error" && !doc.data ? (
                <Alert variant="danger" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span>مقدرناش نقرا إعدادات الـ SEO. اتأكد من النت وجرّب تاني.</span>
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
