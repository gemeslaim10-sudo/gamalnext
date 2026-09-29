import type { LeadSource } from "@/lib/leads/schema";

/**
 * Any component can open the lead popup:
 *   openLeadModal({ service: "Business package", source: "pricing" })
 * or, without importing anything:
 *   document.dispatchEvent(new CustomEvent("open-lead-modal", { detail: { service, source } }))
 */
export const LEAD_MODAL_EVENT = "open-lead-modal";

export interface OpenLeadModalDetail {
    /** Prefills "What do you need?" */
    service?: string;
    /** Where the request came from; the automatic popup uses "popup" */
    source?: LeadSource;
}

export function openLeadModal(detail: OpenLeadModalDetail = {}) {
    document.dispatchEvent(new CustomEvent<OpenLeadModalDetail>(LEAD_MODAL_EVENT, { detail }));
}

// ── Visitor flags ────────────────────────────────────────────────────────────
// sessionStorage: the popup already showed during this visit (browser session).
// localStorage: the visitor left their number, so the popup never opens by itself again.

const SHOWN_KEY = "gtech:lead-popup-shown";
const SUBMITTED_KEY = "gtech:lead-submitted";

function read(storage: () => Storage, key: string) {
    try {
        return storage().getItem(key) === "1";
    } catch {
        return false; // storage blocked (private mode, strict privacy settings)
    }
}

function write(storage: () => Storage, key: string) {
    try {
        storage().setItem(key, "1");
    } catch {
        // storage blocked: the popup may show again next time, which is harmless
    }
}

export const wasPopupShownThisVisit = () => read(() => window.sessionStorage, SHOWN_KEY);
export const markPopupShown = () => write(() => window.sessionStorage, SHOWN_KEY);
export const hasSubmittedLead = () => read(() => window.localStorage, SUBMITTED_KEY);
/** Call after any successful lead (popup, contact form, chat) so the popup stops opening by itself. */
export const markLeadSubmitted = () => write(() => window.localStorage, SUBMITTED_KEY);
