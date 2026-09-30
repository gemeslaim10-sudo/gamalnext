"use client";

import { useCallback, useMemo, useState } from "react";
import { BookOpen, Plus, Search } from "lucide-react";
import { AdminPage } from "@/components/admin/kit";
import { Alert, Button, Card, Chip, EmptyState, Input, Modal, Select, Skeleton } from "@/components/ui";
import { cardChars, KNOWLEDGE_LIMITS, type KnowledgeCard } from "@/lib/ai/assistant/shared";
import { AI_CRUMBS } from "../settings";
import { ReadError } from "@/components/admin/kit/ReadError";
import { useKnowledge } from "./useKnowledge";
import { KnowledgeRow } from "./components/KnowledgeRow";
import { KnowledgeCardModal } from "./components/KnowledgeCardModal";

const ALL = "__all__";
const PAGE_SIZE = 25;

type StatusFilter = "all" | "active" | "inactive" | "pinned";

const STATUS_OPTIONS: { id: StatusFilter; label: string }[] = [
    { id: "all", label: "كل الحالات" },
    { id: "active", label: "المفعّلة" },
    { id: "inactive", label: "المتوقفة" },
    { id: "pinned", label: "المثبّتة" },
];

const EMPTY: KnowledgeCard[] = [];

export default function KnowledgePage() {
    const { doc, cards: loaded, busy, busyId, saveCard, deleteCard, toggle } = useKnowledge();
    const cards = loaded ?? EMPTY;
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(ALL);
    const [status, setStatus] = useState<StatusFilter>("all");
    const [limit, setLimit] = useState(PAGE_SIZE);
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
        return [...counts.entries()].sort((a, b) => b[1] - a[1]);
    }, [cards]);
    const categoryNames = useMemo(() => categories.map(([name]) => name), [categories]);

    const stats = useMemo(() => {
        const active = cards.filter((c) => c.active);
        return {
            active: active.length,
            pinned: active.filter((c) => c.pinned).length,
            activeChars: active.reduce((sum, c) => sum + cardChars(c), 0),
            totalChars: cards.reduce((sum, c) => sum + cardChars(c), 0),
        };
    }, [cards]);

    // A category that no longer exists (its last card was deleted) falls back to "all"
    const activeCategory = category !== ALL && !categoryNames.includes(category) ? ALL : category;

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return cards.filter((c) => {
            if (activeCategory !== ALL && c.category !== activeCategory) return false;
            if (status === "active" && !c.active) return false;
            if (status === "inactive" && c.active) return false;
            if (status === "pinned" && !c.pinned) return false;
            if (!q) return true;
            return [c.title, c.category, c.content, c.tags.join(" ")].some((field) => field.toLowerCase().includes(q));
        });
    }, [cards, search, activeCategory, status]);

    const filtering = search.trim() !== "" || activeCategory !== ALL || status !== "all";
    const sendsAll = stats.activeChars <= KNOWLEDGE_LIMITS.allCardsMaxChars;
    const clearFilters = () => {
        setSearch("");
        setCategory(ALL);
        setStatus("all");
        setLimit(PAGE_SIZE);
    };

    return (
        <AdminPage
            title="قاعدة المعرفة"
            description="الحقايق اللي المساعد بيعتمد عليها في ردوده: خدماتك، طريقة الشغل، السياسات… كل بطاقة عن موضوع واحد."
            breadcrumbs={AI_CRUMBS}
            width="wide"
            actions={
                loaded && (
                    <Button onClick={() => openEditor(null)} disabled={busy}>
                        <Plus /> إضافة بطاقة
                    </Button>
                )
            }
        >
            {!loaded ? (
                doc.error ? (
                    <ReadError message="ماقدرناش نجيب قاعدة المعرفة. اتأكد من الاتصال وجرّب تاني." onRetry={doc.reload} />
                ) : (
                    <Card padding="none" className="divide-y divide-border" aria-busy="true" aria-label="جاري التحميل">
                        {[0, 1, 2].map((row) => (
                            <div key={row} className="space-y-2 px-4 py-4">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-3 w-5/6" />
                                <Skeleton className="h-3 w-1/4" />
                            </div>
                        ))}
                    </Card>
                )
            ) : (
                <div className="space-y-6">
                    {/* How much the assistant receives */}
                    <Card padding="sm" className="space-y-3">
                        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <Stat label="بطاقة" value={cards.length} />
                            <Stat label="مفعّلة" value={stats.active} />
                            <Stat label="مثبّتة" value={stats.pinned} />
                            <Stat label="حرف مفعّل" value={stats.activeChars} />
                        </dl>
                        <p className="text-sm leading-relaxed text-muted">
                            {sendsAll
                                ? `كل البطاقات المفعّلة بتتبعت للمساعد مع كل رسالة (لحد ${KNOWLEDGE_LIMITS.allCardsMaxChars.toLocaleString("en-US")} حرف).`
                                : "القاعدة كبرت، فالمساعد بياخد مع كل رسالة البطاقات المثبّتة + الأقرب لكلام الزائر. استخدم الكلمات المفتاحية وثبّت البطاقات الأساسية."}{" "}
                            الأسعار والمشاريع والمقالات وبيانات التواصل المساعد بيقراها من صفحات الموقع على طول — مش محتاج تكررها هنا.
                        </p>
                        {stats.totalChars > KNOWLEDGE_LIMITS.docWarnChars && (
                            <Alert variant="warning">قاعدة المعرفة قرّبت من أقصى مساحة تخزين. امسح البطاقات القديمة أو اختصرها.</Alert>
                        )}
                    </Card>

                    {cards.length === 0 ? (
                        <EmptyState
                            icon={<BookOpen />}
                            title="لسه مفيش بطاقات"
                            description="ضيف معلومات عن خدماتك وطريقة شغلك، والمساعد هيعتمد عليها في ردوده."
                            action={
                                <Button variant="secondary" onClick={() => openEditor(null)}>
                                    <Plus /> ضيف أول بطاقة
                                </Button>
                            }
                        />
                    ) : (
                        <div className="space-y-3">
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative min-w-0 flex-1">
                                    <Search aria-hidden className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
                                    <Input
                                        type="search"
                                        dir="auto"
                                        placeholder="دوّر في العناوين والمحتوى والكلمات المفتاحية…"
                                        aria-label="بحث في البطاقات"
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setLimit(PAGE_SIZE);
                                        }}
                                        className="ps-9"
                                    />
                                </div>
                                <Select
                                    aria-label="الحالة"
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value as StatusFilter);
                                        setLimit(PAGE_SIZE);
                                    }}
                                    className="sm:w-44"
                                >
                                    {STATUS_OPTIONS.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            {categories.length > 1 && (
                                <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
                                    <Chip
                                        active={activeCategory === ALL}
                                        onClick={() => {
                                            setCategory(ALL);
                                            setLimit(PAGE_SIZE);
                                        }}
                                    >
                                        الكل <span className="tabular-nums opacity-70">{cards.length}</span>
                                    </Chip>
                                    {categories.map(([name, count]) => (
                                        <Chip
                                            key={name}
                                            active={activeCategory === name}
                                            onClick={() => {
                                                setCategory(name);
                                                setLimit(PAGE_SIZE);
                                            }}
                                        >
                                            <span dir="auto">{name}</span> <span className="tabular-nums opacity-70">{count}</span>
                                        </Chip>
                                    ))}
                                </div>
                            )}

                            {filtered.length === 0 ? (
                                <div className="rounded-card border border-border px-6 py-10 text-center text-sm text-subtle">
                                    مفيش بطاقات مطابقة.
                                    <Button variant="ghost" size="sm" className="ms-2" onClick={clearFilters}>
                                        امسح البحث
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    {filtering && (
                                        <p className="text-xs text-subtle">
                                            {filtered.length} من {cards.length} بطاقة
                                        </p>
                                    )}
                                    <Card padding="none" className="overflow-hidden">
                                        <ul className="divide-y divide-border">
                                            {filtered.slice(0, limit).map((card) => (
                                                <KnowledgeRow
                                                    key={card.id}
                                                    card={card}
                                                    disabled={busy}
                                                    saving={busyId === card.id}
                                                    onEdit={() => openEditor(card)}
                                                    onDelete={() => setDeleting({ open: true, card })}
                                                    onToggle={(field) => toggle(card.id, field)}
                                                />
                                            ))}
                                        </ul>
                                    </Card>
                                    {filtered.length > limit && (
                                        <div className="flex justify-center">
                                            <Button variant="secondary" onClick={() => setLimit((current) => current + PAGE_SIZE)}>
                                                عرض المزيد ({filtered.length - limit})
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            <KnowledgeCardModal
                key={editor.key}
                open={editor.open}
                card={editor.card}
                categories={categoryNames}
                onClose={closeEditor}
                onSave={saveCard}
            />

            <Modal open={deleting.open} onClose={closeDelete} title="تمسح البطاقة؟" size="sm">
                <div className="space-y-4 p-5">
                    <p className="text-sm leading-relaxed text-muted">
                        <span dir="auto" className="font-medium text-foreground">
                            «{deleting.card?.title}»
                        </span>{" "}
                        هتتمسح نهائي، والمساعد مش هيعرف المعلومة دي تاني. لو عايز توقفها مؤقتًا استخدم زرار الإيقاف بدل المسح.
                    </p>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button variant="secondary" onClick={closeDelete}>
                            إلغاء
                        </Button>
                        <Button
                            variant="danger"
                            disabled={busy}
                            onClick={async () => {
                                if (!deleting.card) return;
                                if (await deleteCard(deleting.card.id)) closeDelete();
                            }}
                        >
                            {busy ? "جاري المسح…" : "امسح"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </AdminPage>
    );
}

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <div className="min-w-0">
            <dt className="text-xs text-subtle">{label}</dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">{value.toLocaleString("en-US")}</dd>
        </div>
    );
}
