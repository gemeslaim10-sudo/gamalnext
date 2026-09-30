"use client";

import { useState, type ReactNode } from "react";
import { CircleAlert, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { AdminPage, SaveBar, useAdminDoc, useDraft, useUnsavedChangesGuard } from "@/components/admin/kit";
import { Alert, Button, EmptyState, LoadingBlock } from "@/components/ui";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { cn } from "@/lib/utils";
import { inheritRowKey } from "./rowKeys";
import { SKILLS_DOC, normalizeSkills, type SkillsListKey, type SkillsLists } from "./skillsDoc";

export interface ListEditor<T> {
    items: T[];
    change: (index: number, patch: Partial<T>) => void;
    replace: (index: number, item: T) => void;
    add: (item: T) => void;
    remove: (index: number) => void;
    move: (index: number, offset: -1 | 1) => void;
    /** The problem with item `index`, shown after the owner tries to save */
    error: (index: number) => string | undefined;
}

interface SkillsListEditorProps<K extends SkillsListKey> {
    list: K;
    title: string;
    description: ReactNode;
    /** Why an item can't be saved (e.g. it has no name), or undefined */
    validate: (item: SkillsLists[K][number]) => string | undefined;
    children: (editor: ListEditor<SkillsLists[K][number]>) => ReactNode;
}

const trimTexts = <T extends object>(item: T): T =>
    Object.fromEntries(Object.entries(item).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])) as T;

/**
 * One list of site_content/skills. All four lists share the cached copy of the document (read once per
 * visit), and saving writes only this list (`{ [list]: items }`, merged), never the whole document.
 */
export function SkillsListEditor<K extends SkillsListKey>({ list, title, description, validate, children }: SkillsListEditorProps<K>) {
    type Item = SkillsLists[K][number];

    const skills = useAdminDoc(SKILLS_DOC, normalizeSkills);
    const saved = (skills.data?.[list] ?? null) as Item[] | null;
    const { draft, setDraft, dirty, reset } = useDraft<Item[]>(saved);
    useUnsavedChangesGuard(dirty);

    const [saving, setSaving] = useState(false);
    const [showErrors, setShowErrors] = useState(false);

    const edit = (change: (items: Item[]) => Item[]) => setDraft((current) => (current ? change(current) : current));

    const editor: ListEditor<Item> | null = draft && {
        items: draft,
        change: (index, patch) => edit((items) => items.map((item, i) => (i === index ? inheritRowKey(item, { ...item, ...patch }) : item))),
        replace: (index, next) => edit((items) => items.map((item, i) => (i === index ? inheritRowKey(item, next) : item))),
        add: (item) => edit((items) => [...items, item]),
        remove: (index) => edit((items) => items.filter((_, i) => i !== index)),
        move: (index, offset) =>
            edit((items) => {
                const target = index + offset;
                if (target < 0 || target >= items.length) return items;
                const next = [...items];
                [next[index], next[target]] = [next[target], next[index]];
                return next;
            }),
        error: (index) => (showErrors && draft[index] ? validate(draft[index]) : undefined),
    };

    const save = async () => {
        if (!draft) return;
        if (draft.some((item) => validate(item))) {
            setShowErrors(true);
            toast.error("فيه عناصر محتاجة تتظبط الأول.");
            return;
        }
        setSaving(true);
        try {
            await skills.save({ [list]: draft.map(trimTexts) }, { refresh: [CACHE_TAGS.skills] });
            setShowErrors(false);
            toast.success("اتحفظ، والموقع اتحدّث.");
        } catch (error) {
            console.error(`Couldn't save ${list}:`, error);
            toast.error("ماقدرناش نحفظ. اتأكد من النت وجرّب تاني.");
        } finally {
            setSaving(false);
        }
    };

    const reloading = skills.status === "loading";

    return (
        <AdminPage
            title={title}
            description={description}
            breadcrumbs={[{ label: "الخدمات والمهارات", href: "/admin/skills" }]}
            actions={
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void skills.reload()}
                    disabled={dirty || saving || reloading}
                    title={dirty ? "احفظ أو تراجع عن التعديلات الأول" : "هات آخر نسخة من قاعدة البيانات"}
                >
                    <RefreshCw className={cn(reloading && "animate-spin")} />
                    تحديث
                </Button>
            }
        >
            {skills.loading ? (
                <LoadingBlock label="جاري التحميل…" />
            ) : !editor ? (
                <EmptyState
                    icon={<CircleAlert />}
                    title="ماقدرناش نقرا القائمة"
                    description={
                        <>
                            اتأكد من النت وجرّب تاني. مش هنعرض القائمة فاضية عشان ما تتحفظش فوق بياناتك بالغلط.
                            {skills.error && (
                                <span dir="ltr" className="mt-2 block text-xs text-subtle">
                                    {skills.error}
                                </span>
                            )}
                        </>
                    }
                    action={
                        <Button variant="secondary" onClick={() => void skills.reload()}>
                            <RefreshCw />
                            جرّب تاني
                        </Button>
                    }
                />
            ) : (
                <>
                    {skills.status === "error" && (
                        <Alert variant="warning" className="mb-4">
                            ماقدرناش نجيب آخر نسخة، والمعروض هو اللي اتحمّل قبل كده.
                        </Alert>
                    )}
                    {children(editor)}
                    <SaveBar
                        dirty={dirty}
                        saving={saving}
                        onSave={save}
                        onReset={() => {
                            reset();
                            setShowErrors(false);
                        }}
                    />
                </>
            )}
        </AdminPage>
    );
}
