"use client";

import { useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { CircleAlert, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { AdminPage, SaveBar, useAdminDoc, useDraft, useUnsavedChangesGuard } from "@/components/admin/kit";
import { Alert, Button, Card, EmptyState, LoadingBlock } from "@/components/ui";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { cn } from "@/lib/utils";
import { SETTINGS_DOC, normalizeSettings, settingsError, type SettingsField, type SettingsValues } from "./settingsDoc";

export interface SettingsForm<K extends SettingsField> {
    values: Pick<SettingsValues, K>;
    set: (key: K, value: string) => void;
    /** Props for the text box of `key`: id, value, change and blur handlers */
    input: (key: K) => {
        id: string;
        value: string;
        onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
        onBlur: () => void;
        "aria-invalid": true | undefined;
    };
    /** Props for the `Field` around it: `htmlFor` and the problem with the value, shown once the owner leaves the field or tries to save */
    field: (key: K) => { htmlFor: string; error: string | undefined };
}

const inputId = (key: SettingsField) => `settings-${key}`;

interface SettingsEditorProps<K extends SettingsField> {
    title: string;
    description: ReactNode;
    /** The fields this page edits; only these are saved. Define it outside the component. */
    fields: readonly K[];
    children: (form: SettingsForm<K>) => ReactNode;
}

function pick<K extends SettingsField>(values: SettingsValues, fields: readonly K[]) {
    return Object.fromEntries(fields.map((key) => [key, values[key]])) as Pick<SettingsValues, K>;
}

/**
 * One part of the site settings. Every part shares the same cached copy of site_content/settings
 * (read once per visit) and saves only its own fields, merged into the document.
 */
export function SettingsEditor<K extends SettingsField>({ title, description, fields, children }: SettingsEditorProps<K>) {
    const settings = useAdminDoc(SETTINGS_DOC, normalizeSettings);
    const saved = useMemo(() => (settings.data ? pick(settings.data, fields) : null), [settings.data, fields]);
    const { draft, setDraft, dirty, reset } = useDraft(saved);
    useUnsavedChangesGuard(dirty);

    const [saving, setSaving] = useState(false);
    const [touched, setTouched] = useState<ReadonlySet<K>>(() => new Set());
    const [showAllErrors, setShowAllErrors] = useState(false);

    const clearErrors = () => {
        setTouched(new Set());
        setShowAllErrors(false);
    };

    const save = async () => {
        if (!draft || !saved) return;
        if (fields.some((key) => settingsError(key, draft[key]))) {
            setShowAllErrors(true);
            toast.error("فيه خانات محتاجة تتظبط الأول.");
            return;
        }
        const patch = Object.fromEntries(fields.filter((key) => draft[key] !== saved[key]).map((key) => [key, draft[key].trim()]));
        setSaving(true);
        try {
            await settings.save(patch, { refresh: [CACHE_TAGS.settings] });
            clearErrors();
            toast.success("اتحفظ، والموقع اتحدّث.");
        } catch (error) {
            console.error("Couldn't save the settings:", error);
            toast.error("ماقدرناش نحفظ. اتأكد من النت وجرّب تاني.");
        } finally {
            setSaving(false);
        }
    };

    const set = (key: K, value: string) => setDraft((current) => (current ? { ...current, [key]: value } : current));
    const error = (key: K) => (draft && (showAllErrors || touched.has(key)) ? settingsError(key, draft[key]) : undefined);

    const form: SettingsForm<K> | null = draft && {
        values: draft,
        set,
        input: (key) => ({
            id: inputId(key),
            value: draft[key],
            onChange: (event) => set(key, event.target.value),
            onBlur: () => setTouched((current) => (current.has(key) ? current : new Set(current).add(key))),
            "aria-invalid": error(key) ? true : undefined,
        }),
        field: (key) => ({ htmlFor: inputId(key), error: error(key) }),
    };

    const reloading = settings.status === "loading";

    return (
        <AdminPage
            title={title}
            description={description}
            breadcrumbs={[{ label: "إعدادات الموقع", href: "/admin/settings" }]}
            actions={
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void settings.reload()}
                    disabled={dirty || saving || reloading}
                    title={dirty ? "احفظ أو تراجع عن التعديلات الأول" : "هات آخر نسخة من قاعدة البيانات"}
                >
                    <RefreshCw className={cn(reloading && "animate-spin")} />
                    تحديث
                </Button>
            }
        >
            {settings.loading ? (
                <LoadingBlock label="جاري التحميل…" />
            ) : !form ? (
                <EmptyState
                    icon={<CircleAlert />}
                    title="ماقدرناش نقرا الإعدادات"
                    description={
                        <>
                            اتأكد من النت وجرّب تاني. مش هنعرض الخانات فاضية عشان ما تتحفظش فوق بياناتك بالغلط.
                            {settings.error && (
                                <span dir="ltr" className="mt-2 block text-xs text-subtle">
                                    {settings.error}
                                </span>
                            )}
                        </>
                    }
                    action={
                        <Button variant="secondary" onClick={() => void settings.reload()}>
                            <RefreshCw />
                            جرّب تاني
                        </Button>
                    }
                />
            ) : (
                <>
                    {settings.status === "error" && (
                        <Alert variant="warning" className="mb-4">
                            ماقدرناش نجيب آخر نسخة، والمعروض هو اللي اتحمّل قبل كده.
                        </Alert>
                    )}
                    <Card padding="lg">{children(form)}</Card>
                    <SaveBar
                        dirty={dirty}
                        saving={saving}
                        onSave={save}
                        onReset={() => {
                            reset();
                            clearErrors();
                        }}
                    />
                </>
            )}
        </AdminPage>
    );
}
