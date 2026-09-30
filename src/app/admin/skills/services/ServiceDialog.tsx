"use client";

import { useState, type FormEvent } from "react";
import { Button, Chip, Field, Input, Modal, Textarea } from "@/components/ui";
import { SERVICE_ICONS, serviceError, type SkillItem } from "../skillsDoc";

interface ServiceDialogProps {
    open: boolean;
    /** Changes every time the dialog opens, so the fields start from `service` again */
    session: number;
    /** The service being edited, or a blank one for "add" */
    service: SkillItem;
    isNew: boolean;
    onClose: () => void;
    onDone: (service: SkillItem) => void;
}

/**
 * One service card's fields in a dialog. "Done" only updates the list on the page; the page's
 * Save button writes it to the database.
 */
export function ServiceDialog({ open, session, service, isNew, onClose, onDone }: ServiceDialogProps) {
    return (
        <Modal open={open} onClose={onClose} title={isNew ? "خدمة جديدة" : "تعديل الخدمة"}>
            <ServiceForm key={session} service={service} isNew={isNew} onClose={onClose} onDone={onDone} />
        </Modal>
    );
}

function ServiceForm({ service, isNew, onClose, onDone }: Omit<ServiceDialogProps, "open" | "session">) {
    const [item, setItem] = useState(service);
    const [tried, setTried] = useState(false);
    const problem = tried ? serviceError(item) : undefined;
    const set = (patch: Partial<SkillItem>) => setItem((current) => ({ ...current, ...patch }));

    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (serviceError(item)) {
            setTried(true);
            return;
        }
        onDone(item);
    };

    return (
        <form onSubmit={submit} noValidate>
            <div className="space-y-5 p-5">
                <Field label="العنوان" htmlFor="service-title" error={problem}>
                    <Input
                        id="service-title"
                        value={item.title}
                        onChange={(event) => set({ title: event.target.value })}
                        aria-invalid={problem ? true : undefined}
                        dir="auto"
                        autoFocus
                    />
                </Field>

                <div className="flex flex-col gap-1.5">
                    <span id="service-icon-label" className="text-sm font-medium text-foreground">
                        الأيقونة
                    </span>
                    <div role="group" aria-labelledby="service-icon-label" className="flex flex-wrap gap-2">
                        {SERVICE_ICONS.map(({ value, label, icon: Icon }) => (
                            <Chip key={value} active={item.icon === value} onClick={() => set({ icon: value })}>
                                <Icon aria-hidden className="size-4" />
                                {label}
                            </Chip>
                        ))}
                    </div>
                </div>

                <Field label="الوصف" htmlFor="service-description" hint="جملة أو اتنين تحت العنوان.">
                    <Textarea
                        id="service-description"
                        value={item.description}
                        onChange={(event) => set({ description: event.target.value })}
                        dir="auto"
                        rows={3}
                    />
                </Field>

                <Field label="التاجز" htmlFor="service-tags" hint="كلمات قصيرة تحت الوصف، افصل بينها بفاصلة إنجليزي (,).">
                    <Input
                        id="service-tags"
                        value={item.tags}
                        onChange={(event) => set({ tags: event.target.value })}
                        dir="auto"
                        placeholder="Next.js, React, WordPress"
                    />
                </Field>

                <Field
                    label="رابط «Learn more»"
                    htmlFor="service-href"
                    hint="صفحة الخدمة اللي الكارت يودّي لها، زي /services/custom-erp-development. فاضي = من غير رابط."
                >
                    <Input
                        id="service-href"
                        value={item.href ?? ""}
                        onChange={(event) => set({ href: event.target.value })}
                        dir="ltr"
                        placeholder="/services/..."
                    />
                </Field>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-border px-5 py-4">
                <Button variant="ghost" onClick={onClose}>
                    إلغاء
                </Button>
                <Button type="submit">{isNew ? "إضافة" : "تم"}</Button>
            </div>
        </form>
    );
}
