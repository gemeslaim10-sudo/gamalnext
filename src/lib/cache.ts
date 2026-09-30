// Server only — cached Firestore reads.
//
// Site content (settings, texts, projects, articles, prices…) is read once and then served from
// the cache with no time limit. It is refreshed only when the owner saves in the dashboard or
// presses "Clear cache" (both go through src/app/api/revalidate), so visitors never wait on the
// database.
import { unstable_cache, unstable_noStore } from "next/cache";
import { collection, doc, getDoc, getDocs, query, type QueryConstraint } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CACHE_TAGS, type CacheTag } from "@/lib/cache-tags";

export { ALL_CACHE_TAGS, CACHE_TAGS, isCacheTag, type CacheTag } from "@/lib/cache-tags";

/**
 * Keeps a read's result until the cache is cleared — no expiry time.
 *
 * - Errors are never cached: callers catch them and show their fallback, and the next request
 *   tries the database again.
 * - Results are plain JSON (Firestore Timestamps become `{ seconds, nanoseconds }`) whether they
 *   come fresh or from the cache, so code never works on a miss and breaks on a hit.
 */
export function cached<Args extends unknown[], Result>(
    read: (...args: Args) => Promise<Result>,
    key: string,
    tags: readonly CacheTag[]
): (...args: Args) => Promise<Result> {
    // The read's own source is part of the key, so a deploy that changes it starts fresh
    return unstable_cache(async (...args: Args) => toPlain(await read(...args)), [key, read.toString()], {
        revalidate: false,
        tags: [CACHE_TAGS.all, ...tags],
    });
}

/**
 * Runs a cached read; on a database error logs it and returns `fallback`. The render that shows a
 * fallback is kept out of the cache (it would otherwise stay until the next "Clear cache"), so the
 * next visitor tries the database again.
 */
export async function readOrFallback<T>(label: string, read: () => Promise<T>, fallback: T): Promise<T> {
    try {
        return await read();
    } catch (error) {
        console.error(`Couldn't read ${label}:`, error);
        unstable_noStore();
        return fallback;
    }
}

function toPlain<T>(value: T): T {
    return value === undefined ? value : (JSON.parse(JSON.stringify(value)) as T);
}

/** One document, or null when it doesn't exist. Throws when the database can't be read. */
export async function readDoc<T>(collectionName: string, id: string): Promise<T | null> {
    const snap = await getDoc(doc(db, collectionName, id));
    return snap.exists() ? (snap.data() as T) : null;
}

/** A collection (optionally filtered/sorted), each item with its `id`. Throws when the database can't be read. */
export async function readCollection<T>(collectionName: string, ...constraints: QueryConstraint[]): Promise<(T & { id: string })[]> {
    const snap = await getDocs(query(collection(db, collectionName), ...constraints));
    return snap.docs.map((item) => ({ ...(item.data() as T), id: item.id }));
}
