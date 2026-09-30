"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CircleAlert, RefreshCw, SearchX } from "lucide-react";
import toast from "react-hot-toast";
import { AdminPage, SaveBar, useAdminDoc, useDraft, useUnsavedChangesGuard } from "@/components/admin/kit";
import { Alert, Button, Card, Chip, EmptyState, LoadingBlock } from "@/components/ui";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { CopySection, CopyValues } from "@/lib/copy/types";
import { cn } from "@/lib/utils";
import { SearchBox } from "../components/SearchBox";
import { COPY_DOC, copyFieldMatches, copyGroups, copyInputId, copyKey, normalizeCopy, normalizeQuery, sectionInfo, textCount } from "../copyAdmin";
import { CopyFieldRow } from "./CopyFieldRow";

const LINK = "text-muted underline underline-offset-4 hover:text-foreground";

/** This section's texts only, as the site shows them now. */
const pickSection = (values: CopyValues, section: CopySection): CopyValues =>
    Object.fromEntries(
        section.fields.map((field) => {
            const key = copyKey(section, field);
            return [key, values[key] ?? field.default];
        })
    );

interface CopySectionEditorProps {
    section: CopySection;
    /** Field key (without the section) to open at, e.g. "home" */
    focusKey?: string;
}

/**
 * The texts of one section. Big sections are split into parts (chips) so the page stays short; the
 * search looks through the whole section. Saving writes only the texts that changed, merged into
 * `values` of site_content/copy.
 */
export function CopySectionEditor({ section, focusKey }: CopySectionEditorProps) {
    const info = sectionInfo(section);
    const copy = useAdminDoc(COPY_DOC, normalizeCopy);
    const saved = useMemo(() => (copy.data ? pickSection(copy.data, section) : null), [copy.data, section]);
    const { draft, setDraft, dirty, reset } = useDraft(saved);
    useUnsavedChangesGuard(dirty);

    const groups = useMemo(() => copyGroups(section), [section]);
    const [groupId, setGroupId] = useState(() => groups?.find((group) => group.fields.some((field) => field.key === focusKey))?.id);
    const [query, setQuery] = useState("");
    const [saving, setSaving] = useState(false);

    const setValue = useCallback(
        (key: string, value: string) => setDraft((current) => (current ? { ...current, [key]: value } : current)),
        [setDraft]
    );

    // Opened from the search: scroll to that text and put the cursor in it
    const ready = draft !== null;
    useEffect(() => {
        if (!ready || !focusKey) return;
        const box = document.getElementById(copyInputId(`${section.id}.${focusKey}`));
        box?.scrollIntoView({ block: "center" });
        box?.focus({ preventScroll: true });
    }, [ready, focusKey, section.id]);

    const changedKeys = useMemo(
        () => new Set(draft && saved ? Object.keys(draft).filter((key) => draft[key] !== saved[key]) : []),
        [draft, saved]
    );

    const q = normalizeQuery(query);
    const activeGroup = groups?.find((group) => group.id === groupId) ?? groups?.[0];
    // Searches the saved texts, so a text doesn't vanish from the results while it's being edited
    const visible = q
        ? section.fields.filter((field) => copyFieldMatches(section, field, q, saved?.[copyKey(section, field)]))
        : (activeGroup?.fields ?? section.fields);

    const save = async () => {
        if (!draft || !saved) return;
        const changed = Object.fromEntries(Object.entries(draft).filter(([key, value]) => value !== saved[key]));
        if (Object.keys(changed).length === 0) return;
        setSaving(true);
        try {
            await copy.save({ values: changed }, { refresh: [CACHE_TAGS.copy] });
            toast.success("اتحفظ، والموقع اتحدّث.");
        } catch (error) {
            console.error("Couldn't save the site texts:", error);
            toast.error("ماقدرناش نحفظ. اتأكد من النت وجرّب تاني.");
        } finally {
            setSaving(false);
        }
    };

    const reloading = copy.status === "loading";

    return (
        <AdminPage
            title={info.title}
            description={
                <>
                    {info.description}
                    {info.related && (
                        <span className="mt-1.5 block text-xs text-subtle">
                            باقي محتوى الصفحة:{" "}
                            {info.related.map((link, index) => (
                                <Fragment key={link.href}>
                                    {index > 0 && " · "}
                                    <Link href={link.href} className={LINK}>
                                        {link.label}
                                    </Link>
                                </Fragment>
                            ))}
                        </span>
                    )}
                </>
            }
            breadcrumbs={[{ label: "نصوص الموقع", href: "/admin/copy" }]}
            actions={
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void copy.reload()}
                    disabled={dirty || saving || reloading}
                    title={dirty ? "احفظ أو تراجع عن التعديلات الأول" : "هات آخر نسخة من قاعدة البيانات"}
                >
                    <RefreshCw className={cn(reloading && "animate-spin")} />
                    تحديث
                </Button>
            }
        >
            {copy.loading ? (
                <LoadingBlock label="جاري التحميل…" />
            ) : !draft ? (
                <EmptyState
                    icon={<CircleAlert />}
                    title="ماقدرناش نقرا النصوص"
                    description={
                        <>
                            اتأكد من النت وجرّب تاني. مش هنعرض النصوص الافتراضية كأنها المحفوظة عشان ما تتحفظش فوقها بالغلط.
                            {copy.error && (
                                <span dir="ltr" className="mt-2 block text-xs text-subtle">
                                    {copy.error}
                                </span>
                            )}
                        </>
                    }
                    action={
                        <Button variant="secondary" onClick={() => void copy.reload()}>
                            <RefreshCw />
                            جرّب تاني
                        </Button>
                    }
                />
            ) : (
                <>
                    {copy.status === "error" && (
                        <Alert variant="warning" className="mb-4">
                            ماقدرناش نجيب آخر نسخة، والمعروض هو اللي اتحمّل قبل كده.
                        </Alert>
                    )}

                    <div className="mb-4 space-y-3">
                        <SearchBox
                            value={query}
                            onChange={setQuery}
                            placeholder={`دوّر في ${textCount(section.fields.length)}…`}
                            label="دوّر في نصوص القسم ده"
                        />
                        {groups && !q && (
                            <div role="group" aria-label="أجزاء القسم" className="flex flex-wrap gap-2">
                                {groups.map((group) => {
                                    const unsaved = group.fields.some((field) => changedKeys.has(copyKey(section, field)));
                                    return (
                                        <Chip key={group.id} active={group.id === activeGroup?.id} onClick={() => setGroupId(group.id)}>
                                            {group.label}
                                            <span className="text-xs tabular-nums opacity-70">{group.fields.length}</span>
                                            {unsaved && (
                                                <>
                                                    <span aria-hidden className="size-1.5 rounded-full bg-warning" />
                                                    <span className="sr-only">(فيه تعديلات ما اتحفظتش)</span>
                                                </>
                                            )}
                                        </Chip>
                                    );
                                })}
                            </div>
                        )}
                        {q && visible.length > 0 && (
                            <p className="text-xs text-subtle" role="status">
                                {visible.length} نتيجة في القسم ده
                            </p>
                        )}
                    </div>

                    {visible.length === 0 ? (
                        <EmptyState
                            icon={<SearchX />}
                            title="مفيش نص مطابق في القسم ده"
                            description={
                                <>
                                    جرّب كلمة تانية، أو{" "}
                                    <Link href="/admin/copy" className={LINK}>
                                        دوّر في كل النصوص
                                    </Link>
                                    .
                                </>
                            }
                        />
                    ) : (
                        <Card padding="none" className="divide-y divide-border">
                            {visible.map((field) => {
                                const key = copyKey(section, field);
                                return (
                                    <CopyFieldRow
                                        key={key}
                                        storageKey={key}
                                        field={field}
                                        value={draft[key] ?? ""}
                                        changed={changedKeys.has(key)}
                                        onChange={setValue}
                                    />
                                );
                            })}
                        </Card>
                    )}

                    <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={reset} />
                </>
            )}
        </AdminPage>
    );
}
