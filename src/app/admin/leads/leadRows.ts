import type { DocumentData } from "firebase/firestore";
import { normalizePhone, type LeadSource, type LeadStatus } from "@/lib/leads/schema";
import { getTimestampMs } from "@/lib/utils/timestamp";
import type { FirebaseTimestamp } from "@/types";

export const STATUSES: LeadStatus[] = ["new", "contacted", "closed"];

export const STATUS_LABEL: Record<LeadStatus, string> = {
    new: "جديد",
    contacted: "اتواصلت معاه",
    closed: "مقفول",
};

export const STATUS_BADGE: Record<LeadStatus, "warning" | "success" | "neutral"> = {
    new: "warning",
    contacted: "success",
    closed: "neutral",
};

export const SOURCES: LeadSource[] = ["popup", "contact", "pricing", "chat", "other"];

export const SOURCE_LABEL: Record<LeadSource, string> = {
    popup: "النافذة",
    contact: "صفحة التواصل",
    pricing: "الأسعار",
    chat: "المساعد الذكي",
    other: "تاني",
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
function withCountryCode(phone: string) {
    const normalized = normalizePhone(phone);
    return /^01[0125]\d{8}$/.test(normalized) ? `+20${normalized.slice(1)}` : normalized;
}

// Arabic month names with Latin digits, like the phone numbers and counts around them
const dateFormat = new Intl.DateTimeFormat("ar-EG-u-nu-latn", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

/** "5 سبتمبر 2026، 1:00 م" */
export function formatLeadDate(ms: number) {
    return ms ? dateFormat.format(ms) : "";
}

// ── CSV export ────────────────────────────────────────────────────────────────

/** `trusted` columns are written by the site itself (normalized phone, dates), not typed by visitors. */
const CSV_COLUMNS: { label: string; value: (lead: LeadRow) => string; trusted?: boolean }[] = [
    { label: "الاسم", value: (lead) => lead.name },
    { label: "الرقم", value: (lead) => lead.dialPhone || lead.phone, trusted: true },
    { label: "الحالة", value: (lead) => STATUS_LABEL[lead.status] },
    { label: "المصدر", value: (lead) => SOURCE_LABEL[lead.source] },
    { label: "الخدمة", value: (lead) => lead.service },
    { label: "الرسالة", value: (lead) => lead.message },
    { label: "النشاط", value: (lead) => lead.activity },
    { label: "أنسب وقت للاتصال", value: (lead) => lead.preferredTime },
    { label: "إيميل الحساب", value: (lead) => lead.userEmail },
    { label: "الصفحة", value: (lead) => lead.page },
    { label: "أول تواصل", value: (lead) => (lead.firstContactMs ? new Date(lead.firstContactMs).toISOString() : ""), trusted: true },
    { label: "آخر نشاط", value: (lead) => (lead.lastActivityMs ? new Date(lead.lastActivityMs).toISOString() : ""), trusted: true },
];

/** Stops spreadsheet apps from running visitor-typed text as a formula. */
function csvSafe(value: string) {
    return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

/** Byte order mark: tells Excel the file is UTF-8, so Arabic shows correctly. */
const BOM = String.fromCharCode(0xfeff);

/** A spreadsheet file of the given leads. */
export function leadsToCsv(leads: LeadRow[]) {
    const header = CSV_COLUMNS.map((column) => csvCell(column.label));
    const rows = leads.map((lead) =>
        CSV_COLUMNS.map((column) => {
            const value = column.value(lead);
            return csvCell(column.trusted ? value : csvSafe(value));
        })
    );
    return BOM + [header, ...rows].map((cells) => cells.join(",")).join("\r\n");
}
