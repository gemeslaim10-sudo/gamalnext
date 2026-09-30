import { auth } from "@/lib/firebase-app";
import type { LeadFieldErrors, LeadInput } from "@/lib/leads/schema";

export type SubmitLeadResult =
    | { ok: true; isNew: boolean }
    | { ok: false; status: number; errors?: LeadFieldErrors };

/**
 * Sends a lead to `POST /api/leads`. Signed-in visitors also send their ID token so the lead
 * is linked to their account; guests are never asked to sign in.
 */
export async function submitLead(lead: LeadInput & { company?: string }): Promise<SubmitLeadResult> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    try {
        const token = await auth.currentUser?.getIdToken();
        if (token) headers.Authorization = `Bearer ${token}`;
    } catch {
        // Token refresh failed: send the lead as a guest
    }

    try {
        const response = await fetch("/api/leads", { method: "POST", headers, body: JSON.stringify(lead) });
        const data: { ok?: boolean; isNew?: boolean; errors?: LeadFieldErrors } = await response.json().catch(() => ({}));
        if (response.ok && data.ok) return { ok: true, isNew: Boolean(data.isNew) };
        return { ok: false, status: response.status, errors: data.errors };
    } catch {
        return { ok: false, status: 0 }; // offline or network error
    }
}
