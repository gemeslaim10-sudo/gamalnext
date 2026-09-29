"use client";

import { useCallback, useMemo, useState } from "react";
import { BookOpen, Plus, Search } from "lucide-react";
import { Alert, Button, Card, Chip, EmptyState, Input, Modal, PageHeader, Skeleton } from "@/components/ui";
import { cardChars, KNOWLEDGE_LIMITS, type KnowledgeCard } from "@/lib/ai/assistant/shared";
import { useKnowledge } from "./useKnowledge";
import { KnowledgeRow } from "./components/KnowledgeRow";
import { KnowledgeCardModal } from "./components/KnowledgeCardModal";

const ALL = "__all__";

export default function KnowledgePage() {
    const { cards, loading, error, busyId, saveCard, deleteCard, toggle } = useKnowledge();
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(ALL);
    // Modals stay mounted while they animate closed, so their content is kept until the next open.
    // `key` changes on every open so the form starts from the chosen card (null = new card).
    const [editor, setEditor] = useState<{ open: boolean; card: KnowledgeCard | null; key: number }>({ open: false, card: null, key: 0 });
    const [deleting, setDeleting] = useState<{ open: boolean; card: KnowledgeCard | null }>({ open: false, card: null });

    const openEditor = (card: KnowledgeCard | null) => setEditor((e) => ({ open: true, card, key: e.key + 1 }));
    const closeEditor = useCallback(() => setEditor((e) => ({ ...e, open: false })), []);
    const closeDelete = useCallback(() => setDeleting((d) => ({ ...d, open: false })), []);

    const categories = useMemo(() => {
        const counts = new Map<string, number>();
        for (const c of cards) if (c.category) counts.set(c.category, (counts.get(c.category) || 0) + 1);
        return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
    }, [cards]);

    const stats = useMemo(() => {
        const active = cards.filter((c) => c.active);
        const activeChars = active.reduce((sum, c) => sum + cardChars(c), 0);
        const totalChars = cards.reduce((sum, c) => sum + cardChars(c), 0);
        return { active: active.length, activeChars, totalChars, pinned: active.filter((c) => c.pinned).length };
    }, [cards]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return cards.filter((c) => {
            if (category !== ALL && c.category !== category) return false;
            if (!q) return true;
            return [c.title, c.category, c.content, c.tags.join(" ")].some((field) => field.toLowerCase().includes(q));
        });
    }, [cards, search, category]);

    const sendsAll = stats.activeChars <= KNOWLEDGE_LIMITS.allCardsMaxChars;
    const activeCategory = category !== ALL && !categories.includes(category) ? ALL : category;

    return (
        <>
            <PageHeader
                title="قاعدة معرفة المساعد"
                description="الحقائق اللي المساعد بيعتمد عليها في ردوده: خدماتك، طريقة الشغل، السياسات… كل بطاقة موضوع واحد."
                actions={
                    <Button onClick={() => openEditor(null)} disabled={loading || error} className="flex-1 sm:flex-none">
                        <Plus /> إضافة بطاقة
                    </Button>
                }
            />

            {error ? (
                <Alert variant="danger">تعذّر تحميل قاعدة المعرفة. تأكد من الاتصال وأعد تحميل الصفحة.</Alert>
            ) : loading ? (
                <Card padding="none" className="divide-y divide-border">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2 px-4 py-4">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-5/6" />
                            <Skeleton className="h-3 w-1/4" />
                        </div>
                    ))}
                </Card>
            ) : (
                <div className="space-y-4">
                    <Card padding="sm" className="space-y-1 text-sm">
                        <p className="text-foreground">
                            {cards.length} بطاقة · {stats.active} مفعّلة · {stats.pinned} مثبّتة ·{" "}
                            <span dir="ltr">{stats.activeChars.toLocaleString("en-US")}</span> حرف
                        </p>
                        <p className="text-muted">
                            {sendsAll
                                ? `كل البطاقات المفعّلة بتتبعت للمساعد مع كل رسالة (لحد ${KNOWLEDGE_LIMITS.allCardsMaxChars.toLocaleString("en-US")} حرف).`
                                : "القاعدة كبرت، فالمساعد بياخد مع كل رسالة البطاقات المثبّتة + الأكثر صلة بكلام الزائر. استخدم الكلمات المفتاحية وثبّت البطاقات الأساسية."}
                        </p>
                        <p className="text-xs text-subtle">
                            الأسعار والمشاريع والمقالات وبيانات التواصل المساعد بيقرأها مباشرة من صفحات الموقع — مش محتاج تكررها هنا. التعديلات بتوصل للمساعد خلال دقيقة.
                        </p>
                        {stats.totalChars > KNOWLEDGE_LIMITS.docWarnChars && (
                            <Alert variant="warning" className="mt-2">
                                قاعدة المعرفة قربت من الحد الأقصى للتخزين. احذف البطاقات القديمة أو اختصرها.
                            </Alert>
                        )}
                    </Card>

                    {cards.length > 0 && (
                        <div className="space-y-3">
                            <div className="relative">
                                <Search aria-hidden className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
                                <Input
                                    type="search"
                                    dir="auto"
                                    placeholder="ابحث في العناوين والمحتوى والكلمات المفتاحية…"
                                    aria-label="بحث في البطاقات"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="ps-9"
                                />
                            </div>
                            {categories.length > 1 && (
                                <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
                                    <Chip active={activeCategory === ALL} onClick={() => setCategory(ALL)}>
                                        الكل
                                    </Chip>
                                    {categories.map((c) => (
                                        <Chip key={c} active={activeCategory === c} onClick={() => setCategory(c)} dir="auto">
                                            {c}
                                        </Chip>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {cards.length === 0 ? (
                        <EmptyState
                            icon={<BookOpen />}
                            title="لا توجد بطاقات بعد"
                            description="أضف معلومات عن خدماتك وطريقة شغلك، والمساعد هيعتمد عليها في ردوده."
                            action={
                                <Button variant="secondary" onClick={() => openEditor(null)}>
                                    <Plus /> أضف أول بطاقة
                                </Button>
                            }
                        />
                    ) : filtered.length === 0 ? (
                        <p className="py-10 text-center text-sm text-subtle">
                            لا توجد بطاقات مطابقة.
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ms-2"
                                onClick={() => {
                                    setSearch("");
                                    setCategory(ALL);
                                }}
                            >
                                مسح البحث
                            </Button>
                        </p>
                    ) : (
                        <>
                            {(search || activeCategory !== ALL) && (
                                <p className="text-xs text-subtle">
                                    {filtered.length} من {cards.length} بطاقة
                                </p>
                            )}
                            <Card padding="none" className="overflow-hidden">
                                <ul className="divide-y divide-border">
                                    {filtered.map((card) => (
                                        <KnowledgeRow
                                            key={card.id}
                                            card={card}
                                            busy={busyId === card.id}
                                            onEdit={() => openEditor(card)}
                                            onDelete={() => setDeleting({ open: true, card })}
                                            onToggle={(field) => toggle(card.id, field)}
                                        />
                                    ))}
                                </ul>
                            </Card>
                        </>
                    )}
                </div>
            )}

            <KnowledgeCardModal
                key={editor.key}
                open={editor.open}
                card={editor.card}
                categories={categories}
                onClose={closeEditor}
                onSave={saveCard}
            />

            <Modal open={deleting.open} onClose={closeDelete} title="حذف البطاقة؟" size="sm">
                <div className="space-y-4 p-5">
                    <p className="text-sm text-muted">
                        هيتم حذف <span dir="auto" className="font-medium text-foreground">«{deleting.card?.title}»</span> نهائيًا، والمساعد مش هيعرف المعلومة
                        دي تاني. لو عايز توقفها مؤقتًا استخدم زر الإيقاف بدل الحذف.
                    </p>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button variant="secondary" onClick={closeDelete}>
                            إلغاء
                        </Button>
                        <Button
                            variant="danger"
                            disabled={!!deleting.card && busyId === deleting.card.id}
                            onClick={async () => {
                                if (!deleting.card) return;
                                if (await deleteCard(deleting.card.id)) closeDelete();
                            }}
                        >
                            حذف
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
