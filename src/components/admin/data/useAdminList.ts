"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { DocumentSnapshot, QueryConstraint } from "firebase/firestore";
import { loadFirestore } from "@/lib/firebase-app";

// Collections in the dashboard (leads, articles, users…) load one page at a time, newest first,
// with "Load more" for the rest — never the whole collection at once. Pages already loaded are
// kept for the visit, so coming back to a list costs no reads.

type Status = "idle" | "loading" | "ready" | "error";

export interface AdminListOptions {
    /** Field to sort by (default "createdAt") */
    orderBy?: string;
    direction?: "asc" | "desc";
    /**
     * Equality filters, e.g. { status: "pending" }. Filtering on one field while sorting by another
     * needs a Firestore composite index (listed in firestore.indexes.json); while one is missing,
     * the list shows a link that creates it.
     */
    where?: Record<string, string | number | boolean>;
    /** Items per page (default 20) */
    pageSize?: number;
}

type Item<T> = T & { id: string };

interface ListEntry {
    status: Status;
    items: Item<Record<string, unknown>>[];
    cursor: DocumentSnapshot | null;
    hasMore: boolean;
    error?: string;
    indexUrl?: string;
}

/** A query that needs a composite index fails with a Firebase console link that creates it. */
function missingIndexUrl(message: string) {
    return /requires an index/i.test(message) ? message.match(/https:\/\/console\.firebase\.google\.com\/\S+/)?.[0] : undefined;
}

const IDLE: ListEntry = { status: "idle", items: [], cursor: null, hasMore: true };
const lists = new Map<string, ListEntry>();
const listeners = new Map<string, Set<() => void>>();
const inFlight = new Map<string, Promise<void>>();

function setList(key: string, entry: ListEntry) {
    lists.set(key, entry);
    listeners.get(key)?.forEach((listener) => listener());
}

function subscribe(key: string, listener: () => void) {
    const set = listeners.get(key) ?? new Set();
    set.add(listener);
    listeners.set(key, set);
    return () => set.delete(listener);
}

function listKey(collectionName: string, options: AdminListOptions) {
    return `${collectionName}|${options.orderBy ?? "createdAt"}|${options.direction ?? "desc"}|${JSON.stringify(options.where ?? {})}|${options.pageSize ?? 20}`;
}

function loadPage(key: string, collectionName: string, options: AdminListOptions, reset: boolean) {
    const running = inFlight.get(key);
    if (running) return running;
    const current = reset ? IDLE : lists.get(key) ?? IDLE;
    setList(key, { ...current, status: "loading" });

    const promise = (async () => {
        try {
            const fs = await loadFirestore();
            const pageSize = options.pageSize ?? 20;
            const constraints: QueryConstraint[] = [
                ...Object.entries(options.where ?? {}).map(([field, value]) => fs.where(field, "==", value)),
                fs.orderBy(options.orderBy ?? "createdAt", options.direction ?? "desc"),
                ...(current.cursor ? [fs.startAfter(current.cursor)] : []),
                fs.limit(pageSize),
            ];
            const snap = await fs.getDocs(fs.query(fs.collection(fs.db, collectionName), ...constraints));
            const items = snap.docs.map((item) => ({ ...(item.data() as Record<string, unknown>), id: item.id }));
            setList(key, {
                status: "ready",
                items: [...current.items, ...items],
                cursor: snap.docs.at(-1) ?? current.cursor,
                hasMore: snap.docs.length === pageSize,
            });
        } catch (error) {
            console.error(`Couldn't read ${collectionName}:`, error);
            const message = error instanceof Error ? error.message : String(error);
            setList(key, { ...current, status: "error", error: message, indexUrl: missingIndexUrl(message) });
        } finally {
            inFlight.delete(key);
        }
    })();
    inFlight.set(key, promise);
    return promise;
}

export interface AdminList<T> {
    items: Item<T>[];
    status: Status;
    /** First page still loading */
    loading: boolean;
    /** A "Load more" page is loading */
    loadingMore: boolean;
    hasMore: boolean;
    error?: string;
    /** Set when the query needs a Firestore index that doesn't exist yet: the link creates it */
    indexUrl?: string;
    loadMore: () => Promise<void>;
    /** Start again from the first page (reads the database again) */
    reload: () => Promise<void>;
    /** Reflect a change you just saved, without reading the list again */
    updateItem: (id: string, patch: Partial<T>) => void;
    removeItem: (id: string) => void;
    /** Show a new item at the top, without reading the list again */
    prependItem: (item: Item<T>) => void;
}

/**
 * A dashboard list, e.g. `useAdminList<Lead>("leads", { orderBy: "capturedAt" })`.
 * Keep `options` stable (define it outside the component or memoize it).
 */
export function useAdminList<T>(collectionName: string, options: AdminListOptions = {}): AdminList<T> {
    const key = listKey(collectionName, options);
    const entry = useSyncExternalStore(
        useCallback((listener: () => void) => subscribe(key, listener), [key]),
        () => lists.get(key) ?? IDLE,
        () => IDLE
    );

    useEffect(() => {
        if (entry.status === "idle") void loadPage(key, collectionName, options, true);
        // options are part of `key`
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, entry.status]);

    const loadMore = useCallback(() => loadPage(key, collectionName, options, false), [key]); // eslint-disable-line react-hooks/exhaustive-deps
    const reload = useCallback(() => loadPage(key, collectionName, options, true), [key]); // eslint-disable-line react-hooks/exhaustive-deps

    const edit = useCallback(
        (change: (items: ListEntry["items"]) => ListEntry["items"]) => {
            const current = lists.get(key) ?? IDLE;
            setList(key, { ...current, items: change(current.items) });
        },
        [key]
    );

    return {
        items: entry.items as Item<T>[],
        status: entry.status,
        loading: entry.status === "idle" || (entry.status === "loading" && entry.items.length === 0),
        loadingMore: entry.status === "loading" && entry.items.length > 0,
        hasMore: entry.hasMore,
        error: entry.error,
        indexUrl: entry.indexUrl,
        loadMore,
        reload,
        updateItem: (id, patch) => edit((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item))),
        removeItem: (id) => edit((items) => items.filter((item) => item.id !== id)),
        prependItem: (item) => edit((items) => [item as Item<Record<string, unknown>>, ...items]),
    };
}

/**
 * Forget loaded pages of a collection (all its lists, or all but the one on screen — `except`), so
 * they load again next time they're shown.
 */
export function invalidateAdminLists(collectionName: string, except?: AdminListOptions) {
    const keep = except ? listKey(collectionName, except) : null;
    for (const key of lists.keys()) {
        if (key.startsWith(`${collectionName}|`) && key !== keep) setList(key, IDLE);
    }
}
