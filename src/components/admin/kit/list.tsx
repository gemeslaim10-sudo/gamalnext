"use client";

// Pieces shared by the dashboard lists of articles, posts, reviews and members.
// (Candidates for src/components/admin/kit — kept here while that folder is owned by the lead.)

import { useCallback, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, MoreHorizontal, RotateCcw, RotateCw } from "lucide-react";
import type { AdminList } from "../data/useAdminList";
import { ReadError } from "./ReadError";
import { Button, Card, Chip, Dropdown, FadeImg, Skeleton, Spinner } from "@/components/ui";
import { cloudinaryLoader, isCloudinaryImage } from "@/lib/cloudinary-loader";
import { cn } from "@/lib/utils";

type ListLike = Pick<AdminList<unknown>, "items" | "status" | "loading" | "loadingMore" | "hasMore" | "loadMore" | "reload" | "indexUrl">;

// ── Tabs ──────────────────────────────────────────────────────────────────────

/**
 * The open tab, kept in the address (`?tab=published`) so reloading, sharing the link or coming
 * back from an item returns to the same tab. The first tab has no parameter.
 */
export function useTabParam<T extends string>(tabs: readonly T[], fallback: T): [T, (tab: T) => void] {
    const params = useSearchParams();
    const pathname = usePathname();
    const requested = params.get("tab");
    const tab = tabs.find((value) => value === requested) ?? fallback;

    const setTab = useCallback(
        (next: T) => {
            const search = new URLSearchParams(params.toString());
            if (next === fallback) search.delete("tab");
            else search.set("tab", next);
            const query = search.toString();
            // The browser's own history call: Next.js follows it without asking the server again
            window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
        },
        [params, pathname, fallback]
    );

    return [tab, setTab];
}

export interface TabOption<T extends string> {
    value: T;
    label: string;
    /** Total in this tab (null/undefined while counting or when the count failed) */
    count?: number | null;
}

export function ListTabs<T extends string>({
    tabs,
    value,
    onChange,
    label,
    end,
}: {
    tabs: TabOption<T>[];
    value: T;
    onChange: (value: T) => void;
    /** What the tabs filter, for screen readers (e.g. "حالة المقالات") */
    label: string;
    /** Shown at the end of the row (e.g. the refresh button) */
    end?: ReactNode;
}) {
    return (
        <div className="mb-4 flex items-start gap-2">
            <div role="group" aria-label={label} className="flex min-w-0 flex-1 flex-wrap gap-2">
                {tabs.map((tab) => (
                    <Chip key={tab.value} active={tab.value === value} onClick={() => onChange(tab.value)}>
                        {tab.label}
                        {typeof tab.count === "number" && <span className="text-xs tabular-nums opacity-70">{tab.count}</span>}
                    </Chip>
                ))}
            </div>
            {end && <div className="shrink-0">{end}</div>}
        </div>
    );
}

/** Reads the list again (new items arrive while the dashboard is open; loaded pages are kept for the visit). */
export function RefreshButton({ onRefresh, refreshing }: { onRefresh: () => void; refreshing: boolean }) {
    return (
        <Button variant="ghost" size="icon" onClick={onRefresh} disabled={refreshing} aria-label="تحديث القايمة" title="تحديث القايمة" className="-my-1">
            <RotateCw className={cn(refreshing && "animate-spin")} />
        </Button>
    );
}

// ── Loading, errors, empty ────────────────────────────────────────────────────

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
    return (
        <Card padding="none" role="status">
            <span className="sr-only">جاري التحميل…</span>
            <ul aria-hidden className="divide-y divide-border">
                {Array.from({ length: rows }, (_, index) => (
                    <li key={index} className="flex items-center gap-3 p-4">
                        <Skeleton className="size-10 shrink-0 rounded-full" />
                        <div className="min-w-0 flex-1 space-y-2">
                            <Skeleton className="h-3.5 w-2/5" />
                            <Skeleton className="h-3 w-4/5" />
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
}

/** A read that failed, with a retry button (same block as the editors use). */
export function LoadError({ message, onRetry, indexUrl, className }: { message: string; onRetry: () => void; indexUrl?: string; className?: string }) {
    return <ReadError message={`${message} اتأكد من الاتصال وجرّب تاني.`} onRetry={onRetry} indexUrl={indexUrl} className={className} />;
}

/**
 * The body of a list: skeleton on the first load, an error with retry, the empty state, or the rows.
 * `shown` = rows visible after any filtering.
 */
export function ListBody({ list, shown, empty, children }: { list: ListLike; shown: number; empty: ReactNode; children: ReactNode }) {
    if (list.loading) return <ListSkeleton />;
    if (list.status === "error" && list.items.length === 0) {
        return <LoadError message="ما قدرناش نجيب القايمة." onRetry={() => void list.reload()} indexUrl={list.indexUrl} />;
    }
    if (shown === 0) return <>{empty}</>;
    return <>{children}</>;
}

/** Under a list: how many are shown (of how many), and "Load more" while there are more pages. */
export function ListFooter({ list, shown, total }: { list: ListLike; shown: number; total?: number | null }) {
    if (list.loading || (list.status === "error" && list.items.length === 0)) return null;
    const failed = list.status === "error";

    return (
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-xs text-subtle" aria-live="polite">
                {typeof total === "number" ? `معروض ${shown} من ${Math.max(total, shown)}` : `معروض ${shown}`}
            </p>
            {failed ? (
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-danger">
                    <span>ما قدرناش نحمّل الباقي.</span>
                    <Button variant="secondary" size="sm" className="h-10 sm:h-8" onClick={() => void list.loadMore()}>
                        <RotateCcw /> جرّب تاني
                    </Button>
                </div>
            ) : list.hasMore ? (
                <Button variant="secondary" onClick={() => void list.loadMore()} disabled={list.loadingMore} className="w-full sm:w-auto">
                    {list.loadingMore ? <Spinner className="size-4" /> : <ChevronDown />}
                    تحميل المزيد
                </Button>
            ) : (
                shown > 0 && <p className="text-xs text-subtle">ده كل اللي موجود</p>
            )}
        </div>
    );
}

// ── Rows ──────────────────────────────────────────────────────────────────────

/** The "⋯" menu at the end of a row. `children` gets `close` to call when an item is picked. */
export function RowMenu({ label, children }: { label: string; children: (close: () => void) => ReactNode }) {
    return (
        <Dropdown
            trigger={({ open, toggle }) => (
                <Button variant="ghost" size="icon" onClick={toggle} aria-label={label} aria-expanded={open} title={label}>
                    <MoreHorizontal />
                </Button>
            )}
        >
            {children}
        </Dropdown>
    );
}

/** Cloudinary files are fetched at the size they're shown, not full size (other hosts as they are). */
export function sizedImage(src: string, width: number) {
    return isCloudinaryImage(src) ? cloudinaryLoader({ src, width }) : src;
}

/** Small image for a row. */
export function Thumb({ src, className, children }: { src?: string | null; className?: string; children?: ReactNode }) {
    const url = src ? sizedImage(src, 240) : undefined;
    return (
        <span
            className={cn(
                "relative flex shrink-0 items-center justify-center overflow-hidden rounded-control border border-border bg-surface-hover text-subtle",
                className
            )}
        >
            {url ? (
                <FadeImg src={url} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" className="size-full object-cover" />
            ) : (
                children
            )}
        </span>
    );
}
