export function parseDate(createdAt: unknown): string {
    if (!createdAt) return new Date().toISOString();
    if (typeof createdAt === "object" && createdAt !== null) {
        const ts = createdAt as { toDate?: () => Date; seconds?: number };
        if (typeof ts.toDate === "function") return ts.toDate().toISOString();
        if (ts.seconds) return new Date(ts.seconds * 1000).toISOString();
    }
    if (typeof createdAt === "string") return createdAt;
    return new Date().toISOString();
}
