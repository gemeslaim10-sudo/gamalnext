"use client";

import { useEffect, useSyncExternalStore } from "react";
import { loadFirestore } from "@/lib/firebase-app";
import type { AdminBadge } from "@/config/admin-nav";

// The numbers next to menu items (new leads, items waiting for review). Counted once per visit
// with cheap count queries — no live connection kept open. Moderation pages call
// refreshAdminCounts() after approving/deleting so the numbers follow.

export type AdminCounts = Record<AdminBadge, number>;

const QUERIES: Record<AdminBadge, { collection: string; field: string; value: string }> = {
    newLeads: { collection: "leads", field: "status", value: "new" },
    pendingArticles: { collection: "articles", field: "status", value: "pending" },
    pendingPosts: { collection: "posts", field: "status", value: "pending" },
    pendingReviews: { collection: "reviews", field: "status", value: "pending" },
};

let counts: AdminCounts | null = null;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
    listeners.forEach((listener) => listener());
}

export function refreshAdminCounts() {
    if (loading) return loading;
    loading = (async () => {
        try {
            const fs = await loadFirestore();
            const entries = await Promise.all(
                (Object.keys(QUERIES) as AdminBadge[]).map(async (badge) => {
                    const { collection, field, value } = QUERIES[badge];
                    try {
                        const snap = await fs.getCountFromServer(fs.query(fs.collection(fs.db, collection), fs.where(field, "==", value)));
                        return [badge, snap.data().count] as const;
                    } catch {
                        return [badge, 0] as const;
                    }
                })
            );
            counts = Object.fromEntries(entries) as AdminCounts;
            emit();
        } finally {
            loading = null;
        }
    })();
    return loading;
}

/** Counts for the menu badges and the dashboard home; null until the first count arrives. */
export function useAdminCounts(): AdminCounts | null {
    const value = useSyncExternalStore(
        (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        () => counts,
        () => null
    );
    useEffect(() => {
        if (!counts) void refreshAdminCounts();
    }, []);
    return value;
}
