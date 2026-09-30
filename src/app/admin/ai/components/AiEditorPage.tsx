"use client";

import type { ReactNode } from "react";
import { AdminPage, SaveBar } from "@/components/admin/kit";
import { Card, Skeleton } from "@/components/ui";
import { AI_CRUMBS, type AiSettings } from "../settings";
import type { AiEditor } from "../useAiEditor";
import { ReadError } from "@/components/admin/kit/ReadError";

interface AiEditorPageProps<K extends keyof AiSettings> {
    title: string;
    description?: ReactNode;
    editor: AiEditor<K>;
    onSave: (draft: Pick<AiSettings, K>) => void;
    /** Runs after "Undo" put the fields back (e.g. to reset local UI state) */
    onReset?: () => void;
    /** Blocks saving, e.g. a required field is empty */
    invalid?: boolean;
    /** The form, rendered once the settings have loaded */
    children: (draft: Pick<AiSettings, K>) => ReactNode;
}

/** Frame of every assistant settings section: breadcrumbs, loading and error states, the form, and the save bar. */
export function AiEditorPage<K extends keyof AiSettings>({ title, description, editor, onSave, onReset, invalid, children }: AiEditorPageProps<K>) {
    const { doc, draft } = editor;

    return (
        <AdminPage title={title} description={description} breadcrumbs={AI_CRUMBS}>
            {draft ? (
                <>
                    {doc.error && (
                        <div className="mb-6">
                            <ReadError message="ماقدرناش نجيب آخر نسخة من الإعدادات، واللي قدامك هي النسخة اللي اتحملت قبل كده." onRetry={doc.reload} />
                        </div>
                    )}
                    <div className="space-y-6">{children(draft)}</div>
                    <SaveBar
                        dirty={editor.dirty}
                        saving={editor.saving}
                        disabled={invalid}
                        onSave={() => onSave(draft)}
                        onReset={() => {
                            editor.reset();
                            onReset?.();
                        }}
                    />
                </>
            ) : doc.error ? (
                <ReadError message="ماقدرناش نجيب إعدادات المساعد. اتأكد من الاتصال وجرّب تاني." onRetry={doc.reload} />
            ) : (
                <Card padding="lg" className="space-y-5" aria-busy="true" aria-label="جاري التحميل">
                    {[0, 1, 2].map((row) => (
                        <div key={row} className="space-y-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ))}
                </Card>
            )}
        </AdminPage>
    );
}

/** A titled group of fields inside a section. */
export function FieldGroup({ title, description, children }: { title?: string; description?: ReactNode; children: ReactNode }) {
    return (
        <Card padding="lg">
            {(title || description) && (
                <div className="mb-5">
                    {title && <h2 className="text-base font-semibold text-foreground">{title}</h2>}
                    {description && <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>}
                </div>
            )}
            <div className="space-y-4">{children}</div>
        </Card>
    );
}
