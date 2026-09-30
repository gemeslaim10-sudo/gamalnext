"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Eye, RotateCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import { AdminPage, SaveBar, useAdminDoc, useDraft, useUnsavedChangesGuard, type AdminDoc } from "@/components/admin/kit";
import { Alert, Button, Skeleton } from "@/components/ui";
import LeadCaptureModal from "@/components/leads/LeadCaptureModal";
import { openLeadModal } from "@/components/leads/events";
import { normalizeLeadCapture, type LeadCaptureSettings } from "@/components/leads/settings";

// Every editor here edits some fields of site_content/lead_capture (read once per visit and shared)
// and saves only those fields.

type Key = keyof LeadCaptureSettings;

function pickKeys<K extends Key>(settings: LeadCaptureSettings, keys: readonly K[]): Pick<LeadCaptureSettings, K> {
    return Object.fromEntries(keys.map((key) => [key, settings[key]])) as Pick<LeadCaptureSettings, K>;
}

export interface CapturePart<K extends Key> {
    doc: AdminDoc<LeadCaptureSettings>;
    draft: Pick<LeadCaptureSettings, K> | null;
    set: (patch: Partial<Pick<LeadCaptureSettings, K>>) => void;
    dirty: boolean;
    reset: () => void;
    saving: boolean;
    save: () => Promise<void>;
    /** The whole settings with the unsaved edits, for the popup preview */
    preview: LeadCaptureSettings | null;
}

/** The fields `keys` of the lead popup settings (define the list outside the component). */
export function useCapturePart<K extends Key>(keys: readonly K[]): CapturePart<K> {
    const doc = useAdminDoc("site_content/lead_capture", normalizeLeadCapture);
    const saved = useMemo(() => (doc.data ? pickKeys(doc.data, keys) : null), [doc.data, keys]);
    const { draft, setDraft, dirty, reset } = useDraft(saved);
    const [saving, setSaving] = useState(false);
    useUnsavedChangesGuard(dirty);

    // Trimmed, empty texts back to their default, delay in range: exactly what the site will show
    const preview = useMemo(() => (doc.data && draft ? normalizeLeadCapture({ ...doc.data, ...draft }) : null), [doc.data, draft]);

    const set = useCallback(
        (patch: Partial<Pick<LeadCaptureSettings, K>>) => setDraft((current) => (current ? { ...current, ...patch } : current)),
        [setDraft]
    );

    const save = async () => {
        if (!preview) return;
        setSaving(true);
        try {
            await doc.save(pickKeys(preview, keys));
            toast.success("اتحفظ، والموقع اتحدّث.");
        } catch (error) {
            console.error("Saving the lead popup settings failed:", error);
            toast.error("ما اتحفظش. اتأكد إنك داخل بحساب الأدمن وجرّب تاني.");
        } finally {
            setSaving(false);
        }
    };

    return { doc, draft, set, dirty, reset, saving, save, preview };
}

interface CaptureEditorProps<K extends Key> {
    title: string;
    description?: ReactNode;
    part: CapturePart<K>;
    /** Adds the "Preview" button, which opens the real popup with the unsaved edits */
    withPreview?: boolean;
    actions?: ReactNode;
    children: (draft: Pick<LeadCaptureSettings, K>) => ReactNode;
}

/** Frame of a lead popup editor: breadcrumbs, loading and read errors, preview, fields and the save bar. */
export function CaptureEditor<K extends Key>({ title, description, part, withPreview, actions, children }: CaptureEditorProps<K>) {
    const { doc, draft } = part;
    const canPreview = Boolean(withPreview && part.preview);

    return (
        <AdminPage
            title={title}
            description={description}
            breadcrumbs={[{ label: "نافذة جمع الأرقام", href: "/admin/leads/capture" }]}
            actions={
                actions || canPreview ? (
                    <>
                        {actions}
                        {canPreview && (
                            <Button variant="secondary" size="sm" onClick={() => openLeadModal({ source: "other" })}>
                                <Eye />
                                معاينة
                            </Button>
                        )}
                    </>
                ) : undefined
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
                    <SaveBar dirty={part.dirty} saving={part.saving} onSave={part.save} onReset={part.reset} />
                </>
            ) : doc.status === "error" ? (
                <Alert variant="danger" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span>مقدرناش نقرا إعدادات النافذة. اتأكد من النت وجرّب تاني.</span>
                    <Button variant="secondary" size="sm" onClick={() => void doc.reload()} className="shrink-0">
                        <RotateCcw />
                        جرّب تاني
                    </Button>
                </Alert>
            ) : (
                <div role="status" aria-label="جاري التحميل…" className="space-y-4 rounded-card border border-border bg-surface p-5 sm:p-6">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            )}

            {/* The real popup, fed with the unsaved edits; "Preview" opens it. Sending from it saves nothing. */}
            {canPreview && part.preview && <LeadCaptureModal preview={part.preview} />}
        </AdminPage>
    );
}
