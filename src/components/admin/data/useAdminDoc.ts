"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { toast } from "react-hot-toast";
import { loadFirestore } from "@/lib/firebase-app";
import { refreshSite } from "@/lib/refreshSite";
import type { CacheTag } from "@/lib/cache-tags";

// Dashboard documents are read once per visit and kept here, so moving between the pages that edit
// the same document (e.g. the sections of Settings) costs no extra database reads. Saving updates
// this copy too. "Reload" on a page reads the database again.

type Status = "idle" | "loading" | "ready" | "error";

interface Entry {
    status: Status;
    /** The raw document (null = doesn't exist yet) */
    data: Record<string, unknown> | null;
    error?: string;
}

const IDLE: Entry = { status: "idle", data: null };
const entries = new Map<string, Entry>();
const listeners = new Map<string, Set<() => void>>();
const inFlight = new Map<string, Promise<void>>();

function setEntry(path: string, entry: Entry) {
    entries.set(path, entry);
    listeners.get(path)?.forEach((listener) => listener());
}

function subscribe(path: string, listener: () => void) {
    const set = listeners.get(path) ?? new Set();
    set.add(listener);
    listeners.set(path, set);
    return () => set.delete(listener);
}

function splitPath(path: string) {
    const [collectionName, id] = path.split("/");
    return { collectionName, id };
}

function loadDocument(path: string) {
    const running = inFlight.get(path);
    if (running) return running;
    const previous = entries.get(path);
    setEntry(path, { status: "loading", data: previous?.data ?? null });
    const promise = (async () => {
        try {
            const { db, doc, getDoc } = await loadFirestore();
            const { collectionName, id } = splitPath(path);
            const snap = await getDoc(doc(db, collectionName, id));
            setEntry(path, { status: "ready", data: snap.exists() ? (snap.data() as Record<string, unknown>) : null });
        } catch (error) {
            console.error(`Couldn't read ${path}:`, error);
            setEntry(path, { status: "error", data: previous?.data ?? null, error: error instanceof Error ? error.message : String(error) });
        } finally {
            inFlight.delete(path);
        }
    })();
    inFlight.set(path, promise);
    return promise;
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;

/** Same as Firestore's merge: nested objects merge key by key, everything else (arrays too) is replaced. */
function mergeDeep(base: Record<string, unknown>, patch: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = { ...base };
    for (const [key, value] of Object.entries(patch)) {
        out[key] = isPlainObject(value) && isPlainObject(out[key]) ? mergeDeep(out[key] as Record<string, unknown>, value) : value;
    }
    return out;
}

export interface SaveOptions {
    /** false = replace the whole document instead of merging (default: merge) */
    merge?: boolean;
    /**
     * Which cached site content to refresh afterwards: "all" (default — the same as "Clear cache"),
     * specific tags, or false for documents visitors never see.
     */
    refresh?: "all" | CacheTag[] | false;
}

export interface AdminDoc<T> {
    /** The document through `normalize` (defaults filled in); null until it has loaded */
    data: T | null;
    /** The document as stored (null = doesn't exist yet) */
    raw: Record<string, unknown> | null;
    status: Status;
    loading: boolean;
    error?: string;
    /** Read the database again */
    reload: () => Promise<void>;
    /** Writes the given fields (merged by default) and refreshes the live site */
    save: (patch: Record<string, unknown>, options?: SaveOptions) => Promise<void>;
}

/**
 * One Firestore document for a dashboard editor, e.g. `useAdminDoc("site_content/pricing", normalizePricing)`.
 * Pass a `normalize` defined outside the component (a stable function).
 */
export function useAdminDoc<T>(path: `${string}/${string}`, normalize: (raw: Record<string, unknown> | null) => T): AdminDoc<T> {
    const entry = useSyncExternalStore(
        useCallback((listener: () => void) => subscribe(path, listener), [path]),
        () => entries.get(path) ?? IDLE,
        () => IDLE
    );

    useEffect(() => {
        if (entry.status === "idle") void loadDocument(path);
    }, [path, entry.status]);

    const data = useMemo(() => (entry.status === "ready" || (entry.status === "error" && entry.data) ? normalize(entry.data) : null), [entry, normalize]);

    const save = useCallback(
        async (patch: Record<string, unknown>, { merge = true, refresh = "all" }: SaveOptions = {}) => {
            const { db, doc, setDoc, serverTimestamp } = await loadFirestore();
            const { collectionName, id } = splitPath(path);
            await setDoc(doc(db, collectionName, id), { ...patch, updatedAt: serverTimestamp() }, { merge });
            const current = entries.get(path)?.data ?? {};
            setEntry(path, { status: "ready", data: merge ? mergeDeep(current, patch) : { ...patch } });
            if (refresh && !(await refreshSite(refresh === "all" ? {} : { tags: refresh }))) {
                // Saved, but the live site still shows the old version until the cache is cleared
                toast("اتحفظ، بس الموقع ما اتحدّثش لسه. دوس «تفريغ الكاش» من رئيسية لوحة التحكم.", { icon: "⚠️", duration: 6000 });
            }
        },
        [path]
    );

    const reload = useCallback(() => loadDocument(path), [path]);

    return {
        data,
        raw: entry.data,
        status: entry.status,
        loading: entry.status === "idle" || (entry.status === "loading" && !entry.data),
        error: entry.error,
        reload,
        save,
    };
}

/** Read documents again (e.g. after a change made elsewhere). Without a path, all of them. */
export function invalidateAdminDocs(path?: string) {
    for (const key of path ? [path] : [...entries.keys()]) setEntry(key, IDLE);
}

/** The cached copy of a document if some page already loaded it this visit, without reading the database. */
export function peekAdminDoc(path: string): Record<string, unknown> | null {
    const entry = entries.get(path);
    return entry && (entry.status === "ready" || entry.status === "loading") ? entry.data : null;
}

/**
 * Like useAdminDoc, but never reads the database: for hubs that show extra info (counts, status)
 * only when an editor already loaded the document this visit.
 */
export function useAdminDocPeek(path: string): Record<string, unknown> | null {
    return useSyncExternalStore(
        useCallback((listener: () => void) => subscribe(path, listener), [path]),
        () => peekAdminDoc(path),
        () => null
    );
}
