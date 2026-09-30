"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button, Card, EmptyState } from "@/components/ui";
import { RowMenu } from "../components/RowMenu";
import { rowKey } from "../rowKeys";
import { serviceError, serviceIcon, type SkillItem } from "../skillsDoc";
import { SkillsListEditor } from "../SkillsListEditor";
import { ServiceDialog } from "./ServiceDialog";

const BLANK: SkillItem = { title: "", description: "", tags: "", icon: "Code" };

interface DialogState {
    open: boolean;
    session: number;
    /** Position of the service being edited; null while adding a new one */
    index: number | null;
    service: SkillItem;
}

const splitTags = (tags: string) =>
    tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

/** The service cards: a short list, and each card's fields open in a dialog. */
export default function ServicesEditorPage() {
    const [dialog, setDialog] = useState<DialogState>({ open: false, session: 0, index: null, service: BLANK });
    const openDialog = (index: number | null, service: SkillItem) =>
        setDialog((current) => ({ open: true, session: current.session + 1, index, service }));
    const closeDialog = () => setDialog((current) => ({ ...current, open: false }));

    return (
        <SkillsListEditor
            list="mainSkills"
            title="الخدمات"
            description="كروت الخدمات في صفحة المهارات وفي قسم الخدمات في صفحة البروفايل. اضغط على أي خدمة عشان تعدّلها."
            validate={serviceError}
        >
            {({ items, add, replace, remove, move, error }) => {
                const addButton = (
                    <Button variant="secondary" onClick={() => openDialog(null, BLANK)}>
                        <Plus /> إضافة خدمة
                    </Button>
                );

                return (
                    <>
                        {items.length === 0 ? (
                            <EmptyState
                                title="لسه مفيش خدمات"
                                description="كروت الخدمات مش هتظهر في الموقع لحد ما تضيف خدمة."
                                action={addButton}
                            />
                        ) : (
                            <Card padding="none">
                                <ul className="divide-y divide-border">
                                    {items.map((service, index) => {
                                        const Icon = serviceIcon(service.icon);
                                        const tags = splitTags(service.tags);
                                        const problem = error(index);
                                        return (
                                            <li key={rowKey(service)} className="flex items-center gap-1 p-2 sm:px-3">
                                                <button
                                                    type="button"
                                                    onClick={() => openDialog(index, service)}
                                                    className="flex min-w-0 flex-1 items-center gap-3 rounded-control p-2 text-start transition-colors hover:bg-surface-hover"
                                                >
                                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-control border border-border bg-surface-hover text-muted">
                                                        <Icon aria-hidden className="size-5" />
                                                    </span>
                                                    <span className="min-w-0 flex-1">
                                                        <span dir="auto" className="block truncate text-sm font-medium text-foreground">
                                                            {service.title || "من غير عنوان"}
                                                        </span>
                                                        <span dir="auto" className="mt-0.5 block truncate text-xs text-muted">
                                                            {service.description || "من غير وصف"}
                                                        </span>
                                                        {tags.length > 0 && (
                                                            <span dir="auto" className="mt-0.5 block truncate text-xs text-subtle">
                                                                {tags.join(" · ")}
                                                            </span>
                                                        )}
                                                        {problem && <span className="mt-0.5 block text-xs text-danger">{problem}</span>}
                                                    </span>
                                                </button>
                                                <RowMenu
                                                    label={service.title || `الخدمة رقم ${index + 1}`}
                                                    index={index}
                                                    count={items.length}
                                                    onEdit={() => openDialog(index, service)}
                                                    onMove={(offset) => move(index, offset)}
                                                    onRemove={() => remove(index)}
                                                />
                                            </li>
                                        );
                                    })}
                                </ul>
                                <div className="border-t border-border p-3 sm:px-4">{addButton}</div>
                            </Card>
                        )}

                        <ServiceDialog
                            open={dialog.open}
                            session={dialog.session}
                            service={dialog.service}
                            isNew={dialog.index === null}
                            onClose={closeDialog}
                            onDone={(service) => {
                                if (dialog.index === null) add(service);
                                else replace(dialog.index, service);
                                closeDialog();
                            }}
                        />
                    </>
                );
            }}
        </SkillsListEditor>
    );
}
