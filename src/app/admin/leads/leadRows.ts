import type { DocumentData } from "firebase/firestore";
import { normalizePhone, type LeadSource, type LeadStatus } from "@/lib/leads/schema";
import { getTimestampMs } from "@/lib/utils/timestamp";
import type { FirebaseTimestamp } from "@/types";

export const STATUSES: LeadStatus[] = ["new", "contacted", "closed"];

export const STATUS_LABEL: Record<LeadStatus, string> = {
    new: "New",
    contacted: "Contacted",
    closed: "Closed",
};

export const STATUS_BADGE: Record<LeadStatus, "warning" | "success" | "neutral"> = {
    new: "warning",
    contacted: "success",
    closed: "neutral",
};

export const SOURCES: LeadSource[] = ["popup", "contact", "pricing", "chat", "other"];

export const SOURCE_LABEL: Record<LeadSource, string> = {
    popup: "Popup",
    contact: "Contact page",
    pricing: "Pricing",
    chat: "Chat assistant",
    other: "Other",
};

/** A lead as the dashboard shows it, with old and new document shapes smoothed out. */
export interface LeadRow {
    id: string;
    name: string;
    /** As the visitor typed it (normalized) */
    phone: string;
    /** With a country code, for the call / WhatsApp / Telegram links */
    dialPhone: string;
    service: string;
    message: string;
    source: LeadSource;
    status: LeadStatus;
    page: string;
    userEmail: string;
    /** Older chat-assistant leads only */
    activity: string;
    preferredTime: string;
    firstContactMs: number;
    lastActivityMs: number;
}

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export function toLeadRow(id: string, data: DocumentData): LeadRow {
    // Older leads have only `capturedAt` or only `updatedAt`
    const captured = getTimestampMs(data.capturedAt as FirebaseTimestamp | undefined);
    const updated = getTimestampMs(data.updatedAt as FirebaseTimestamp | undefined);
    const phone = text(data.phone);

    return {
        id,
        name: text(data.name),
        phone,
        dialPhone: phone ? withCountryCode(phone) : "",
        service: text(data.service),
        message: text(data.message),
        // Leads saved before `source` existed came from the chat assistant (they carry its session id)
        source: SOURCES.find((source) => source === data.source) ?? (data.sessionId ? "chat" : "other"),
        status: STATUSES.find((status) => status === data.status) ?? "new",
        page: text(data.page),
        userEmail: text(data.userEmail),
        activity: text(data.activity),
        preferredTime: text(data.preferredTime),
        firstContactMs: captured || updated,
        lastActivityMs: Math.max(captured, updated),
    };
}

/**
 * Egyptian mobiles typed the local way (01XXXXXXXXX) get +20, so the call, WhatsApp and Telegram
 * links work. Numbers that already include a country code are left as they are.
 */
export function withCountryCode(phone: string) {
    const normalized = normalizePhone(phone);
    return /^01[0125]\d{8}$/.test(normalized) ? `+20${normalized.slice(1)}` : normalized;
}

/** Stops spreadsheet apps from running visitor-typed text as a formula. */
export function csvSafe(value: string) {
    return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}
