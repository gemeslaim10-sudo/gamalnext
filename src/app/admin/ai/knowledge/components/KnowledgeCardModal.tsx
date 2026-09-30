"use client";

import { useState, type FormEvent } from "react";
import { Button, Field, Input, Label, Modal, Switch, Textarea } from "@/components/ui";
import { useUnsavedChangesGuard } from "@/components/admin/kit";
import { KNOWLEDGE_LIMITS, newCardId, parseTags, type KnowledgeCard } from "@/lib/ai/assistant/shared";

interface KnowledgeCardModalProps {
    open: boolean;
    /** The card being edited, or null for a new one */
    card: KnowledgeCard | null;
    categories: string[];
    onClose: () => void;
    onSave: (card: KnowledgeCard) => Promise<boolean>;
}

const CLOSE_MESSAGE = "فيه تعديلات لسه ما اتحفظتش. تقفل من غير ما تحفظ؟";

/** Add / edit form. Mount it with a `key` per card so the fields start from that card. */
export function KnowledgeCardModal({ open, card, categories, onClose, onSave }: KnowledgeCardModalProps) {
    const initial = {
        title: card?.title ?? "",
        category: card?.category ?? "",
        content: card?.content ?? "",
        tags: card?.tags.join("، ") ?? "",
        active: card?.active ?? true,
        pinned: card?.pinned ?? false,
    };
    const [form, setForm] = useState(initial);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<{ title?: string; content?: string }>({});
    const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((current) => ({ ...current, [key]: value }));

    const dirty = open && JSON.stringify(form) !== JSON.stringify(initial);
    useUnsavedChangesGuard(dirty);

    const requestClose = () => {
        if (saving || (dirty && !window.confirm(CLOSE_MESSAGE))) return;
        onClose();
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const title = form.title.trim();
        const content = form.content.trim();
        const found: typeof errors = {};
        if (!title) found.title = "اكتب عنوان للبطاقة.";
        if (!content) found.content = "اكتب المعلومة نفسها.";
        else if (content.length > KNOWLEDGE_LIMITS.contentMax)
            found.content = `المحتوى أطول من ${KNOWLEDGE_LIMITS.contentMax.toLocaleString("en-US")} حرف — قسّمه على أكتر من بطاقة.`;
        setErrors(found);
        if (Object.keys(found).length) return;

        setSaving(true);
        const ok = await onSave({
            id: card?.id ?? newCardId(),
            title: title.slice(0, KNOWLEDGE_LIMITS.titleMax),
            category: form.category.trim().slice(0, KNOWLEDGE_LIMITS.categoryMax),
            content,
            tags: parseTags(form.tags),
            active: form.active,
            pinned: form.pinned,
            createdAt: card?.createdAt,
            updatedAt: card?.updatedAt,
        });
        setSaving(false);
        if (ok) onClose();
    };

    return (
        <Modal open={open} onClose={requestClose} title={card ? "تعديل البطاقة" : "بطاقة جديدة"} size="lg">
            <form onSubmit={handleSubmit} className="space-y-4 p-5">
                <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                    <Field label="العنوان" htmlFor="kc-title" error={errors.title}>
                        <Input
                            id="kc-title"
                            dir="auto"
                            value={form.title}
                            maxLength={KNOWLEDGE_LIMITS.titleMax}
                            onChange={(e) => set("title", e.target.value)}
                            placeholder="مثال: أنظمة ERP"
                        />
                    </Field>
                    <Field label="التصنيف" htmlFor="kc-category" hint="زي: Services، Policies…">
                        <Input
                            id="kc-category"
                            dir="auto"
                            list="kc-categories"
                            value={form.category}
                            maxLength={KNOWLEDGE_LIMITS.categoryMax}
                            onChange={(e) => set("category", e.target.value)}
                        />
                        <datalist id="kc-categories">
                            {categories.map((c) => (
                                <option key={c} value={c} />
                            ))}
                        </datalist>
                    </Field>
                </div>

                <Field
                    label="المعلومة"
                    htmlFor="kc-content"
                    error={errors.content}
                    hint={
                        <>
                            <span dir="ltr">
                                {form.content.length.toLocaleString("en-US")} / {KNOWLEDGE_LIMITS.contentMax.toLocaleString("en-US")}
                            </span>{" "}
                            حرف. اكتب حقايق واضحة؛ المساعد مش هيزوّد تفاصيل مش مكتوبة.
                        </>
                    }
                >
                    <Textarea id="kc-content" dir="auto" rows={10} value={form.content} onChange={(e) => set("content", e.target.value)} />
                </Field>

                <Field
                    label="كلمات مفتاحية"
                    htmlFor="kc-tags"
                    hint="مفصولة بفاصلة، عربي وإنجليزي — الكلام اللي ممكن الزائر يستخدمه. بتساعد المساعد يلاقي البطاقة."
                >
                    <Input id="kc-tags" dir="auto" value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="ERP، مخازن، حسابات" />
                </Field>

                <div className="divide-y divide-border rounded-control border border-border">
                    <ToggleRow
                        id="kc-active"
                        label="مفعّلة"
                        hint="البطاقة المتوقفة بتفضل محفوظة، بس المساعد مش بيشوفها."
                        checked={form.active}
                        onChange={(value) => set("active", value)}
                    />
                    <ToggleRow
                        id="kc-pinned"
                        label="مثبّتة"
                        hint="بتتبعت للمساعد مع كل رسالة حتى لو قاعدة المعرفة كبرت."
                        checked={form.pinned}
                        onChange={(value) => set("pinned", value)}
                    />
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                    <Button variant="secondary" onClick={requestClose} disabled={saving}>
                        إلغاء
                    </Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? "جاري الحفظ…" : "حفظ البطاقة"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

function ToggleRow({ id, label, hint, checked, onChange }: { id: string; label: string; hint: string; checked: boolean; onChange: (value: boolean) => void }) {
    return (
        <div className="flex items-start justify-between gap-4 p-3">
            <div className="min-w-0">
                <Label htmlFor={id}>{label}</Label>
                <p className="mt-0.5 text-xs text-subtle">{hint}</p>
            </div>
            <Switch id={id} checked={checked} onCheckedChange={onChange} className="mt-0.5" />
        </div>
    );
}
