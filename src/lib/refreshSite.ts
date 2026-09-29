import { auth } from "@/lib/firebase";

/**
 * Asks the server to rebuild every page with the latest content. Call it from the dashboard
 * after saving anything visitors see. Failing here is harmless: pages also refresh on their own
 * within a minute (see `revalidate` in src/app/layout.tsx).
 */
export async function refreshSite() {
    try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return false;
        const res = await fetch("/api/revalidate", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
        return res.ok;
    } catch (error) {
        console.error("Site refresh failed:", error);
        return false;
    }
}
