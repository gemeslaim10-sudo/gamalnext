"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import { AdminPage, SaveBar, useDraft, useUnsavedChangesGuard, type AdminDoc } from "@/components/admin/kit";
import { Alert, Button, Skeleton } from "@/components/ui";
import type { NotificationSettings } from "@/lib/notifications/settings";
import { useNotificationsDoc } from "./notificationsDoc";

export const NOTIFICATIONS_CRUMBS = [{ label: "الإشعارات", href: "/admin/notifications" }];

export interface NotificationsPart<P> {
    doc: AdminDoc<NotificationSettings>;
    draft: P | null;
    set: (patch: Partial<P>) => void;
    dirty: boolean;
    reset: () => void;
    saving: boolean;
    save: () => Promise<void>;
}

/**
 * One part of the notification settings. `pick` takes it out of the settings (define it outside the
 * component); `write` saves the edited part — with `doc.save(…, { refresh: false })`, since visitors
 * never see these settings.
 */
export function useNotificationsPart<P extends object>(
    pick: (settings: NotificationSettings) => P,
    write: (draft: P, doc: AdminDoc<NotificationSettings>) => Promise<void>
): NotificationsPart<P> {
    const doc = useNotificationsDoc();
    const saved = useMemo(() => (doc.data ? pick(doc.data) : null), [doc.data, pick]);
    const { draft, setDraft, dirty, reset } = useDraft(saved);
    const [saving, setSaving] = useState(false);
    useUnsavedChangesGuard(dirty);

    const set = useCallback((patch: Partial<P>) => setDraft((current) => (current ? { ...current, ...patch } : current)), [setDraft]);

    const save = async () => {
        if (!draft) return;
        setSaving(true);
        try {
            await write(draft, doc);
            toast.success("اتحفظ.");
        } catch (error) {
            console.error("Saving the notification settings failed:", error);
            toast.error("ما اتحفظش. اتأكد إنك داخل بحساب الأدمن وجرّب تاني.");
        } finally {
            setSaving(false);
        }
    };

    return { doc, draft, set, dirty, reset, saving, save };
}

interface NotificationsEditorProps<P> {
    title: string;
    description?: ReactNode;
    part: NotificationsPart<P>;
    actions?: ReactNode;
    saveDisabled?: boolean;
    children: (draft: P) => ReactNode;
}

/** Frame of a notifications editor: breadcrumbs, loading and read errors, the fields, and the save bar. */
export function NotificationsEditor<P>({ title, description, part, actions, saveDisabled, children }: NotificationsEditorProps<P>) {
    const { doc, draft } = part;

    return (
        <AdminPage title={title} description={description} breadcrumbs={NOTIFICATIONS_CRUMBS} actions={actions}>
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
                    <span>مقدرناش نقرا إعدادات الإشعارات. اتأكد من النت وجرّب تاني.</span>
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
        </AdminPage>
    );
}
