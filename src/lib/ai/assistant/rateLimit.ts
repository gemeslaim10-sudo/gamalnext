// A small per-instance limiter so one visitor (or a script) can't run up model costs.
// Best effort: each server instance counts on its own.

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 15;
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimitKey(req: Request): string {
    const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    return forwarded || req.headers.get("x-real-ip") || "unknown";
}

/** Returns true when this key is still under the limit (and counts the request). */
export function allowRequest(key: string, now = Date.now()): boolean {
    if (hits.size > 5_000) {
        for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
    }
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
        hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
        return true;
    }
    entry.count++;
    return entry.count <= MAX_REQUESTS;
}
