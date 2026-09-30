"use client";

import type { ReactNode } from "react";
import { ExternalLink, RotateCcw } from "lucide-react";
import { AdminPage, SaveBar, type Crumb } from "@/components/admin/kit";
import { Alert, Button, ButtonLink, EmptyState, Skeleton } from "@/components/ui";
import type { ServicesPart } from "./useServicesPart";

interface ServicesEditorFrameProps<P> {
    title: string;
    description?: ReactNode;
    breadcrumbs: Crumb[];
    part: ServicesPart<P>;
    /** "View page" link to the public page being edited */
    viewHref?: string;
    saveDisabled?: boolean;
    /** Shown when the document loaded but the part doesn't exist (e.g. a deleted service) */
    notFound?: ReactNode;
    children: (draft: P) => ReactNode;
}

/** Frame of a services editor: breadcrumbs, loading and read errors, the fields and the save bar. */
export function ServicesEditorFrame<P>({ title, description, breadcrumbs, part, viewHref, saveDisabled, notFound, children }: ServicesEditorFrameProps<P>) {
    const { doc, draft } = part;

    return (
        <AdminPage
            title={title}
            description={description}
            breadcrumbs={breadcrumbs}
            actions={
                viewHref && (
                    <ButtonLink href={viewHref} external variant="secondary" size="sm">
                        <ExternalLink />
                        عرض الصفحة
                    </ButtonLink>
                )
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
                    <fieldset disabled={part.saving} className="min-w-0 space-y-6">
                        {children(draft)}
                    </fieldset>
                    <SaveBar dirty={part.dirty} saving={part.saving} onSave={part.save} onReset={part.reset} disabled={saveDisabled} />
                </>
            ) : doc.status === "error" ? (
                <Alert variant="danger" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span>مقدرناش نقرا صفحات الخدمات. اتأكد من النت وجرّب تاني.</span>
                    <Button variant="secondary" size="sm" onClick={() => void doc.reload()} className="shrink-0">
                        <RotateCcw />
                        جرّب تاني
                    </Button>
                </Alert>
            ) : doc.data ? (
                (notFound ?? <EmptyState title="الخدمة دي مش موجودة" description="ممكن تكون اتمسحت أو اتغيّر رابطها." />)
            ) : (
                <div role="status" aria-label="جاري التحميل…" className="space-y-4 rounded-card border border-border bg-surface p-5 sm:p-6">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            )}
        </AdminPage>
    );
}
