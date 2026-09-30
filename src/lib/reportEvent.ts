import { auth } from "@/lib/firebase-app";

type ReportedEvent = { event: "user.signup" } | { event: "article.pending" | "post.pending" | "review.pending"; id: string };

/**
 * Tells the server something happened in the browser (a new account, content sent for review), so
 * the owner can get an email (/admin/notifications). Fire and forget: never throws, never waits.
 */
export function reportEvent(payload: ReportedEvent) {
    void (async () => {
        try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) return;
            await fetch("/api/events", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                keepalive: true,
            });
        } catch (error) {
            console.error("Event report failed:", error);
        }
    })();
}
