"use client";

// Data helpers shared by the dashboard lists of articles, posts, reviews and members.
// (Candidates for src/components/admin/kit — kept here while that folder is owned by the lead.)

import { useCallback, useEffect, useLayoutEffect, useSyncExternalStore } from "react";
import { loadFirestore } from "@/lib/firebase-app";
import { getTimestampMs } from "@/lib/utils/timestamp";
import type { FirebaseTimestamp } from "@/types";

// ── Dates ─────────────────────────────────────────────────────────────────────

// Arabic month names with Western digits, the same digits as the counters in the menu
const DAY = new Intl.DateTimeFormat("ar-EG-u-nu-latn", { day: "numeric", month: "short", year: "numeric" });
const DAY_TIME = new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
});

/** "30 سبتمبر 2026" (with the time when asked), or "" when the value isn't a date. */
export function formatDate(value: unknown, withTime = false): string {
    const ms = getTimestampMs(value as FirebaseTimestamp | undefined);
    return ms ? (withTime ? DAY_TIME : DAY).format(ms) : "";
}

// ── Counts per tab ────────────────────────────────────────────────────────────
// Cheap count queries (no documents are read), once per visit; refreshed after a change.

/** Equality filters of one count, e.g. { status: "pending" }; null counts the whole collection. */
export type CountFilter = Record<string, string> | null;
export type Counts = Record<string, number | null>;

const counts = new Map<string, Counts>();
const running = new Map<string, Promise<void>>();
const again = new Set<string>();
const listeners = new Map<string, Set<() => void>>();
const sources = new Map<string, { collectionName: string; filters: Record<string, CountFilter> }>();

function loadCounts(key: string, collectionName: string, filters: Record<string, CountFilter>): Promise<void> {
    const current = running.get(key);
    if (current) {
        // Something changed while counting: count once more when this round ends
        again.add(key);
        return current;
    }
    const promise = (async () => {
        let result: Counts;
        try {
            const fs = await loadFirestore();
            const entries = await Promise.all(
                Object.entries(filters).map(async ([name, filter]) => {
                    try {
                        const base = fs.collection(fs.db, collectionName);
                        const target = filter
                            ? fs.query(base, ...Object.entries(filter).map(([field, value]) => fs.where(field, "==", value)))
                            : base;
                        return [name, (await fs.getCountFromServer(target)).data().count] as const;
                    } catch (error) {
                        console.error(`Couldn't count ${collectionName} (${name}):`, error);
                        return [name, null] as const;
                    }
                })
            );
            result = Object.fromEntries(entries);
        } catch (error) {
            console.error(`Couldn't count ${collectionName}:`, error);
            result = Object.fromEntries(Object.keys(filters).map((name) => [name, null]));
        }
        counts.set(key, result);
        running.delete(key);
        listeners.get(key)?.forEach((listener) => listener());
        if (again.delete(key)) void loadCounts(key, collectionName, filters);
    })();
    running.set(key, promise);
    return promise;
}

/**
 * Totals for the tabs of a list, e.g. `useCollectionCounts("posts", { pending: { status: "pending" } })`.
 * `counts` is null until the first answer; a count that failed is null. Keep `filters` stable.
 */
export function useCollectionCounts(collectionName: string, filters: Record<string, CountFilter>) {
    const key = `${collectionName}|${JSON.stringify(filters)}`;
    const value = useSyncExternalStore(
        useCallback(
            (listener: () => void) => {
                const set = listeners.get(key) ?? new Set();
                set.add(listener);
                listeners.set(key, set);
                return () => set.delete(listener);
            },
            [key]
        ),
        () => counts.get(key) ?? null,
        () => null
    );

    useEffect(() => {
        sources.set(key, { collectionName, filters });
        if (!counts.has(key)) void loadCounts(key, collectionName, filters);
    }, [key, collectionName, filters]);

    const refresh = useCallback(() => loadCounts(key, collectionName, filters), [key, collectionName, filters]);
    return { counts: value, refresh };
}

/**
 * After adding, deleting or moving items of a collection: totals on screen are counted again now,
 * the others the next time they're shown.
 */
export function invalidateCounts(collectionName: string) {
    for (const [key, source] of sources) {
        if (source.collectionName !== collectionName) continue;
        // On screen, or a count started before the change is still running: count (again) now
        if (listeners.get(key)?.size || running.has(key)) void loadCounts(key, source.collectionName, source.filters);
        else counts.delete(key);
    }
}

// ── Tabs that show old data ───────────────────────────────────────────────────
// Each tab keeps its loaded pages for the visit. When an item moves to another tab (approved,
// hidden…), that tab reloads the next time it's opened instead of showing the old pages.

const staleTabs = new Map<string, Set<string>>();

export function markTabsStale(listId: string, tabs: readonly string[]) {
    const set = staleTabs.get(listId) ?? new Set<string>();
    tabs.forEach((tab) => set.add(tab));
    staleTabs.set(listId, set);
}

/** Put in the component that shows one tab's list: reloads it from the first page if it went stale. */
export function useReloadIfStale(listId: string, tab: string, status: string, reload: () => Promise<void>) {
    // Before paint, so the old rows never flash
    useLayoutEffect(() => {
        if (!staleTabs.get(listId)?.delete(tab)) return;
        // A list that was never shown (or was reset) loads fresh by itself
        if (status !== "idle") void reload();
    }, [listId, tab, status, reload]);
}
