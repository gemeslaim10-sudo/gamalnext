// Server only (uses the Admin SDK) — never import this from a client component.
import admin from "firebase-admin";
import { getAdminDb } from "@/lib/firebase-admin";
import { LEAD_LIMITS, normalizePhone, validateLead, type LeadInput } from "./schema";

interface SaveLeadOptions {
    userId?: string | null;
    userEmail?: string | null;
    sessionId?: string | null;
}

/**
 * Writes a lead with the Admin SDK (visitors can't write to `leads` directly — see firestore.rules).
 * One document per phone number: the same person contacting twice updates their lead instead of
 * creating duplicates, and the latest service/message/source win.
 */
export async function saveLead(input: LeadInput, options: SaveLeadOptions = {}) {
    const errors = validateLead(input);
    if (Object.keys(errors).length > 0) {
        return { ok: false as const, errors };
    }

    const phone = normalizePhone(input.phone);
    const ref = getAdminDb().collection("leads").doc(phone.replace(/\D/g, ""));
    const existing = await ref.get();
    const now = admin.firestore.FieldValue.serverTimestamp();

    await ref.set(
        {
            name: input.name.trim().slice(0, LEAD_LIMITS.nameMax),
            phone,
            service: (input.service || "").trim().slice(0, LEAD_LIMITS.serviceMax) || null,
            message: (input.message || "").trim().slice(0, LEAD_LIMITS.messageMax) || null,
            source: input.source,
            page: input.page || null,
            // Only overwrite account details when we know them, so a later guest visit doesn't erase them
            ...(options.userId ? { userId: options.userId } : {}),
            ...(options.userEmail ? { userEmail: options.userEmail } : {}),
            ...(options.sessionId ? { sessionId: options.sessionId } : {}),
            // Reaching out again is a new request, even if the owner had closed the old one
            status: "new",
            updatedAt: now,
            // Only set on first contact so the owner sees when this person first reached out
            ...(existing.exists ? {} : { capturedAt: now }),
        },
        { merge: true }
    );

    return { ok: true as const, id: ref.id, isNew: !existing.exists };
}
