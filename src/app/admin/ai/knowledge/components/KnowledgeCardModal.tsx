"use client";

import { useState, type FormEvent } from "react";
import { Button, Field, Input, Modal, Textarea } from "@/components/ui";
import { KNOWLEDGE_LIMITS, newCardId, parseTags, type KnowledgeCard } from "@/lib/ai/assistant/shared";

interface KnowledgeCardModalProps {
    open: boolean;
    /** The card being edited, or null for a new one */
    card: KnowledgeCard | null;
    categories: string[];
    onClose: () => void;
    onSave: (card: KnowledgeCard) => Promise<boolean>;
}

/** Add / edit form. Mount it with a `key` per card so the fields start from that card. */
export function KnowledgeCardModal({ open, card, categories, onClose, onSave }: KnowledgeCardModalProps) {
    const [title, setTitle] = useState(card?.title ?? "");
    const [category, setCategory] = useState(card?.category ?? "");
    const [content, setContent] = useState(card?.content ?? "");
    const [tags, setTags] = useState(card?.tags.join("، ") ?? "");
    const [active, setActive] = useState(card?.active ?? true);
    const [pinned, setPinned] = useState(card?.pinned ?? false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const next = {
            title: title.trim(),
            content: content.trim(),
        };
        const found: typeof errors = {};
        if (!next.title) found.title = "اكتب عنوانًا للبطاقة.";
        if (!next.content) found.content = "اكتب المعلومة نفسها.";
        else if (next.content.length > KNOWLEDGE_LIMITS.contentMax) found.content = `المحتوى أطول من ${KNOWLEDGE_LIMITS.contentMax.toLocaleString("en-US")} حرف — قسّمه على أكتر من بطاقة.`;
        setErrors(found);
        if (Object.keys(found).length) return;

        setSaving(true);
        const ok = await onSave({
            id: card?.id ?? newCardId(),
            title: next.title.slice(0, KNOWLEDGE_LIMITS.titleMax),
            category: category.trim().slice(0, KNOWLEDGE_LIMITS.categoryMax),
            content: next.content,
            tags: parseTags(tags),
            active,
            pinned,
            createdAt: card?.createdAt,
            updatedAt: card?.updatedAt,
        });
        setSaving(false);
        if (ok) onClose();
    };

    return (
        <Modal open={open} onClose={onClose} title={card ? "تعديل البطاقة" : "بطاقة جديدة"} size="lg">
            <form onSubmit={handleSubmit} className="space-y-4 p-5">
                <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                    <Field label="العنوان" htmlFor="kc-title" error={errors.title}>
                        <Input
                            id="kc-title"
                            dir="auto"
                            value={title}
                            maxLength={KNOWLEDGE_LIMITS.titleMax}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="مثال: أنظمة ERP"
                        />
                    </Field>
                    <Field label="التصنيف" htmlFor="kc-category" hint="مثل: Services، Policies…">
                        <Input
                            id="kc-category"
                            dir="auto"
                            list="kc-categories"
                            value={category}
                            maxLength={KNOWLEDGE_LIMITS.categoryMax}
                            onChange={(e) => setCategory(e.target.value)}
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
                    hint={`${content.length.toLocaleString("en-US")} / ${KNOWLEDGE_LIMITS.contentMax.toLocaleString("en-US")} حرف. اكتب حقائق واضحة؛ المساعد مش هيضيف تفاصيل مش مكتوبة.`}
                >
                    <Textarea id="kc-content" dir="auto" rows={10} value={content} onChange={(e) => setContent(e.target.value)} />
                </Field>

                <Field label="كلمات مفتاحية" htmlFor="kc-tags" hint="مفصولة بفاصلة، بالعربي والإنجليزي — الكلمات اللي ممكن الزائر يستخدمها. بتساعد المساعد يلاقي البطاقة.">
                    <Input id="kc-tags" dir="auto" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ERP، مخازن، حسابات" />
                </Field>

                <div className="space-y-3 rounded-control border border-border p-3">
                    <Checkbox
                        id="kc-active"
                        checked={active}
                        onChange={setActive}
                        label="مفعّلة"
                        hint="البطاقة المتوقفة بتفضل محفوظة لكن المساعد مش بيشوفها."
                    />
                    <Checkbox
                        id="kc-pinned"
                        checked={pinned}
                        onChange={setPinned}
                        label="مثبّتة"
                        hint="بتتبعت للمساعد مع كل رسالة حتى لو قاعدة المعرفة كبرت."
                    />
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                    <Button variant="secondary" onClick={onClose} disabled={saving}>
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

function Checkbox({ id, checked, onChange, label, hint }: { id: string; checked: boolean; onChange: (v: boolean) => void; label: string; hint: string }) {
    return (
        <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 cursor-pointer accent-foreground"
            />
            <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">{label}</span>
                <span className="block text-xs text-subtle">{hint}</span>
            </span>
        </label>
    );
}
