"use client";

import { useId, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface RowBadge {
    label: string;
    variant?: "neutral" | "outline" | "warning";
}

interface ListEditorProps<T extends { id: string }> {
    items: T[];
    /** Receives an updater so quick successive edits never work on a stale list */
    onChange: (update: (items: T[]) => T[]) => void;
    createItem: () => T;
    addLabel: string;
    removeLabel: string;
    emptyText: string;
    /** Shown on the collapsed row */
    getTitle: (item: T) => string;
    untitledLabel: string;
    getMeta?: (item: T) => ReactNode;
    getBadges?: (item: T) => RowBadge[];
    renderFields: (item: T, change: (patch: Partial<T>) => void) => ReactNode;
}

/**
 * An editable, reorderable list: each item is a summary row that opens its fields (one item at a
 * time, so long lists stay short), with move up/down buttons. New items go at the bottom and open.
 */
export function ListEditor<T extends { id: string }>({
    items,
    onChange,
    createItem,
    addLabel,
    removeLabel,
    emptyText,
    getTitle,
    untitledLabel,
    getMeta,
    getBadges,
    renderFields,
}: ListEditorProps<T>) {
    const listId = useId();
    const [openId, setOpenId] = useState<string | null>(null);

    const move = (id: string, delta: -1 | 1) =>
        onChange((list) => {
            const from = list.findIndex((item) => item.id === id);
            const to = from + delta;
            if (from < 0 || to < 0 || to >= list.length) return list;
            const next = list.slice();
            [next[from], next[to]] = [next[to], next[from]];
            return next;
        });

    const change = (id: string, patch: Partial<T>) =>
        onChange((list) => list.map((item) => (item.id === id ? { ...item, ...patch } : item)));

    const remove = (id: string) => {
        onChange((list) => list.filter((item) => item.id !== id));
        setOpenId(null);
    };

    const add = () => {
        const item = createItem();
        onChange((list) => [...list, item]);
        setOpenId(item.id);
    };

    return (
        <div className="space-y-3">
            {items.length === 0 ? (
                <p className="rounded-card border border-border px-4 py-6 text-center text-sm text-subtle">{emptyText}</p>
            ) : (
                <ul className="divide-y divide-border rounded-card border border-border">
                    {items.map((item, index) => {
                        const open = openId === item.id;
                        const panelId = `${listId}-${item.id}`;
                        const title = getTitle(item).trim();
                        const name = title || untitledLabel;
                        const meta = getMeta?.(item);
                        const badges = getBadges?.(item) ?? [];

                        return (
                            <li key={item.id}>
                                <div className="flex items-center gap-1 p-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setOpenId(open ? null : item.id)}
                                        aria-expanded={open}
                                        aria-controls={panelId}
                                        className="flex min-h-10 min-w-0 flex-1 items-center gap-2.5 rounded-control px-2 py-1.5 text-start transition-colors hover:bg-surface-hover"
                                    >
                                        <ChevronDown
                                            aria-hidden
                                            className={cn(
                                                "size-4 shrink-0 text-subtle transition-transform duration-(--motion-fast) ease-out",
                                                open && "rotate-180"
                                            )}
                                        />
                                        <span className="min-w-0 flex-1">
                                            <span
                                                dir="auto"
                                                className={cn("block truncate text-sm font-medium", title ? "text-foreground" : "text-subtle")}
                                            >
                                                {name}
                                            </span>
                                            {(meta || badges.length > 0) && (
                                                <span className="mt-1 flex flex-wrap items-center gap-1.5">
                                                    {meta && <span className="text-xs text-subtle">{meta}</span>}
                                                    {badges.map((badge) => (
                                                        <Badge key={badge.label} variant={badge.variant ?? "outline"}>
                                                            {badge.label}
                                                        </Badge>
                                                    ))}
                                                </span>
                                            )}
                                        </span>
                                    </button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => move(item.id, -1)}
                                        disabled={index === 0}
                                        aria-label={`لفوق: ${name}`}
                                        title="لفوق"
                                    >
                                        <ArrowUp />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => move(item.id, 1)}
                                        disabled={index === items.length - 1}
                                        aria-label={`لتحت: ${name}`}
                                        title="لتحت"
                                    >
                                        <ArrowDown />
                                    </Button>
                                </div>

                                {open && (
                                    <div id={panelId} className="animate-fade-in space-y-4 border-t border-border px-3 py-4 sm:px-4">
                                        {renderFields(item, (patch) => change(item.id, patch))}
                                        <div className="flex justify-end border-t border-border pt-4">
                                            <Button variant="danger" onClick={() => remove(item.id)}>
                                                <Trash2 />
                                                {removeLabel}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}

            <Button variant="secondary" onClick={add} className="w-full sm:w-auto">
                <Plus />
                {addLabel}
            </Button>
        </div>
    );
}
