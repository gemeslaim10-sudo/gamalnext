"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowDownUp, ChevronDown, ChevronUp, FolderOpen, Plus, Search, Trash2 } from "lucide-react";
import { AdminPage, SaveBar, useAdminDoc, useDraft, useUnsavedChangesGuard } from "@/components/admin/kit";
import { Badge, Button, ButtonLink, Card, Chip, EmptyState, FadeImg, Input, Modal, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";
import { categoryOf, normalizeProjects, PROJECT_CATEGORIES, PROJECTS_PATH, type StoredProject } from "./projects";
import { ReadError } from "@/components/admin/kit/ReadError";

const ALL = "all";
const EMPTY: StoredProject[] = [];

const text = (value: unknown) => (typeof value === "string" ? value : "");

export default function ProjectsPage() {
    const projects = useAdminDoc(PROJECTS_PATH, normalizeProjects);
    const saved = projects.data?.items ?? null;
    // The order on screen. In "arrange" mode moving projects changes only this copy until "Save"
    const { draft: order, setDraft: setOrder, dirty, reset } = useDraft<StoredProject[]>(saved);
    useUnsavedChangesGuard(dirty);

    const [arranging, setArranging] = useState(false);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(ALL);
    const [saving, setSaving] = useState(false);
    // The dialog keeps its project while it animates closed
    const [deleting, setDeleting] = useState<{ open: boolean; item: StoredProject | null }>({ open: false, item: null });
    const closeDelete = useCallback(() => setDeleting((current) => ({ ...current, open: false })), []);

    const list = order ?? EMPTY;
    const counts = useMemo(() => {
        const map = new Map<string, number>();
        for (const item of list) map.set(text(item.category), (map.get(text(item.category)) ?? 0) + 1);
        return map;
    }, [list]);
    const usedCategories = PROJECT_CATEGORIES.filter((c) => counts.has(c.id));

    const query = search.trim().toLowerCase();
    const activeCategory = category !== ALL && counts.has(category) ? category : ALL;
    const rows = list
        .map((item, position) => ({ item, position }))
        .filter(({ item }) => {
            if (arranging) return true;
            if (activeCategory !== ALL && item.category !== activeCategory) return false;
            return !query || [item.title, item.tags, item.description].some((value) => text(value).toLowerCase().includes(query));
        });

    const persist = async (items: StoredProject[], message: string) => {
        setSaving(true);
        try {
            await projects.save({ items }, { refresh: ["projects"] });
            toast.success(message);
            return true;
        } catch (error) {
            console.error("Saving projects failed:", error);
            toast.error("ماقدرناش نحفظ. اتأكد من الاتصال وجرّب تاني.");
            return false;
        } finally {
            setSaving(false);
        }
    };

    const move = (from: number, to: number) =>
        setOrder((current) => {
            if (!current || to < 0 || to >= current.length) return current;
            const next = current.slice();
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved);
            return next;
        });

    const startArranging = () => {
        setSearch("");
        setCategory(ALL);
        setArranging(true);
    };

    const stopArranging = () => {
        if (dirty && !window.confirm("الترتيب الجديد لسه ما اتحفظش. تلغيه؟")) return;
        reset();
        setArranging(false);
    };

    const saveOrder = async () => {
        if (order && (await persist(order, "اتحفظ الترتيب"))) setArranging(false);
    };

    const confirmDelete = async () => {
        const target = deleting.item;
        if (!saved || !target) return;
        if (await persist(saved.filter((item) => item !== target), "اتمسح المشروع")) closeDelete();
    };

    return (
        <AdminPage
            title="المشاريع"
            description={
                arranging
                    ? "حرّك المشاريع لفوق ولتحت بنفس الترتيب اللي عايزه يظهر في الموقع، وبعدين احفظ."
                    : "معرض الأعمال اللي بيظهر في صفحة المشاريع وفي الصفحة الرئيسية، بنفس الترتيب ده."
            }
            width="wide"
            actions={
                saved &&
                (arranging ? (
                    <Button variant="secondary" onClick={stopArranging} disabled={saving}>
                        خلصت
                    </Button>
                ) : (
                    <>
                        {saved.length > 1 && (
                            <Button variant="secondary" onClick={startArranging}>
                                <ArrowDownUp /> ترتيب
                            </Button>
                        )}
                        <ButtonLink href="/admin/projects/new">
                            <Plus /> إضافة مشروع
                        </ButtonLink>
                    </>
                ))
            }
        >
            {!saved ? (
                projects.error ? (
                    <ReadError message="ماقدرناش نجيب المشاريع. اتأكد من الاتصال وجرّب تاني." onRetry={() => void projects.reload()} />
                ) : (
                    <Card padding="none" className="divide-y divide-border" aria-busy="true" aria-label="جاري التحميل">
                        {[0, 1, 2, 3].map((row) => (
                            <div key={row} className="flex items-center gap-3 px-4 py-3">
                                <Skeleton className="size-12 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                            </div>
                        ))}
                    </Card>
                )
            ) : list.length === 0 ? (
                <EmptyState
                    icon={<FolderOpen />}
                    title="لسه مفيش مشاريع"
                    description="ضيف أول مشروع وهيظهر في صفحة المشاريع على طول."
                    action={
                        <ButtonLink href="/admin/projects/new" variant="secondary">
                            <Plus /> ضيف أول مشروع
                        </ButtonLink>
                    }
                />
            ) : (
                <div className="space-y-3">
                    {!arranging && (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative min-w-0 flex-1 sm:max-w-sm">
                                <Search aria-hidden className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
                                <Input
                                    type="search"
                                    dir="auto"
                                    placeholder="دوّر بالاسم أو التقنية…"
                                    aria-label="بحث في المشاريع"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="ps-9"
                                />
                            </div>
                            {usedCategories.length > 1 && (
                                <div className="flex flex-wrap gap-2">
                                    <Chip active={activeCategory === ALL} onClick={() => setCategory(ALL)}>
                                        الكل <span className="tabular-nums opacity-70">{list.length}</span>
                                    </Chip>
                                    {usedCategories.map((c) => (
                                        <Chip key={c.id} active={activeCategory === c.id} onClick={() => setCategory(c.id)}>
                                            <c.icon aria-hidden className="size-3.5" /> {c.label}{" "}
                                            <span className="tabular-nums opacity-70">{counts.get(c.id)}</span>
                                        </Chip>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {rows.length === 0 ? (
                        <div className="rounded-card border border-border px-6 py-10 text-center text-sm text-subtle">
                            مفيش مشاريع مطابقة.
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ms-2"
                                onClick={() => {
                                    setSearch("");
                                    setCategory(ALL);
                                }}
                            >
                                امسح البحث
                            </Button>
                        </div>
                    ) : (
                        <Card padding="none" className="overflow-hidden">
                            <ul className="divide-y divide-border">
                                {rows.map(({ item, position }) => (
                                    <ProjectRow
                                        key={saved.indexOf(item)}
                                        item={item}
                                        position={position}
                                        editHref={`/admin/projects/${saved.indexOf(item)}`}
                                        arranging={arranging}
                                        isFirst={position === 0}
                                        isLast={position === list.length - 1}
                                        onMove={(to) => move(position, to)}
                                        onDelete={() => setDeleting({ open: true, item })}
                                        disabled={saving}
                                    />
                                ))}
                            </ul>
                        </Card>
                    )}

                    {!arranging && (query || activeCategory !== ALL) && (
                        <p className="text-xs text-subtle">
                            {rows.length} من {list.length} مشروع
                        </p>
                    )}
                </div>
            )}

            {arranging && <SaveBar dirty={dirty} saving={saving} onSave={() => void saveOrder()} onReset={reset} />}

            <Modal open={deleting.open} onClose={() => !saving && closeDelete()} title="تمسح المشروع؟" size="sm">
                <div className="space-y-4 p-5">
                    <p className="text-sm leading-relaxed text-muted">
                        <span dir="auto" className="font-medium text-foreground">
                            «{text(deleting.item?.title) || "مشروع من غير اسم"}»
                        </span>{" "}
                        هيتشال من الموقع نهائي، بصوره وبياناته.
                    </p>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button variant="secondary" onClick={closeDelete} disabled={saving}>
                            إلغاء
                        </Button>
                        <Button variant="danger" onClick={() => void confirmDelete()} disabled={saving}>
                            {saving ? "جاري المسح…" : "امسح"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </AdminPage>
    );
}

interface ProjectRowProps {
    item: StoredProject;
    position: number;
    editHref: string;
    arranging: boolean;
    isFirst: boolean;
    isLast: boolean;
    onMove: (to: number) => void;
    onDelete: () => void;
    disabled: boolean;
}

function ProjectRow({ item, position, editHref, arranging, isFirst, isLast, onMove, onDelete, disabled }: ProjectRowProps) {
    const title = text(item.title).trim();
    const tags = text(item.tags).trim();
    const image = text(item.image) || (Array.isArray(item.gallery) ? text(item.gallery[0]) : "");
    const category = categoryOf(item.category);
    const Icon = category?.icon ?? FolderOpen;

    const summary = (
        <>
            <span className="w-6 shrink-0 text-center text-xs tabular-nums text-subtle">{position + 1}</span>
            <span
                className={cn(
                    "size-12 shrink-0 items-center justify-center overflow-hidden rounded-control border border-border bg-surface-hover text-subtle",
                    // Arranging on a phone: the move buttons need the room
                    arranging ? "hidden sm:flex" : "flex"
                )}
            >
                {image ? <FadeImg src={image} alt="" loading="lazy" className="size-full object-cover" /> : <Icon aria-hidden className="size-4" />}
            </span>
            <span className="min-w-0 flex-1">
                <span dir="auto" className={cn("block truncate text-sm font-medium", title ? "text-foreground" : "text-subtle")}>
                    {title || "من غير اسم"}
                </span>
                {tags && (
                    <span dir="auto" className="block truncate text-xs text-subtle">
                        {tags}
                    </span>
                )}
            </span>
            {category && !arranging && (
                <Badge className="hidden shrink-0 sm:inline-flex">
                    <Icon aria-hidden /> {category.label}
                </Badge>
            )}
        </>
    );

    if (arranging) {
        return (
            <li className="flex items-center gap-3 py-2 ps-3 pe-2 sm:ps-4">
                {summary}
                <div className="flex shrink-0 items-center">
                    <Button variant="ghost" size="icon" onClick={() => onMove(position - 1)} disabled={disabled || isFirst} aria-label={`طلّع «${title}» لفوق`}>
                        <ChevronUp />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onMove(position + 1)} disabled={disabled || isLast} aria-label={`نزّل «${title}» لتحت`}>
                        <ChevronDown />
                    </Button>
                </div>
            </li>
        );
    }

    return (
        <li className="flex items-center transition-colors hover:bg-surface-hover">
            <Link href={editHref} className="flex min-w-0 flex-1 items-center gap-3 py-2.5 ps-3 pe-2 sm:ps-4">
                {summary}
            </Link>
            <div className="shrink-0 pe-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDelete}
                    disabled={disabled}
                    aria-label={`مسح «${title || "المشروع"}»`}
                    title="مسح"
                    className="hover:bg-danger/10 hover:text-danger"
                >
                    <Trash2 />
                </Button>
            </div>
        </li>
    );
}
