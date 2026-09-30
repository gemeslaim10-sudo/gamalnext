// Server only — sends the owner's email notifications through Resend (https://resend.com), using
// the settings and API key saved in the dashboard (/admin/notifications). Nothing here throws:
// a failed email must never break the action that triggered it.
import { getAdminDb } from "@/lib/firebase-admin";
import {
    NOTIFICATIONS_DOC,
    NOTIFICATIONS_SECRET_DOC,
    normalizeNotifications,
    type NotificationEvent,
    type NotificationSettings,
} from "./settings";
import { renderNotification, renderTestEmail, type EmailContent, type NotificationPayloads } from "./templates";

export type SendResult = { ok: true; id?: string } | { ok: false; error?: string; skipped?: "disabled" | "not-configured" };

async function loadConfig(): Promise<{ settings: NotificationSettings; apiKey: string }> {
    const db = getAdminDb();
    const [settingsSnap, secretSnap] = await Promise.all([
        db.collection(NOTIFICATIONS_DOC.collection).doc(NOTIFICATIONS_DOC.id).get(),
        db.collection(NOTIFICATIONS_SECRET_DOC.collection).doc(NOTIFICATIONS_SECRET_DOC.id).get(),
    ]);
    return {
        settings: normalizeNotifications(settingsSnap.data()),
        apiKey: String(secretSnap.get("resendApiKey") ?? "").trim(),
    };
}

/** "GTech <onboarding@resend.dev>" */
function sender(settings: NotificationSettings) {
    const name = settings.fromName.replace(/["<>\r\n]/g, "").trim();
    return name ? `${name} <${settings.fromEmail}>` : settings.fromEmail;
}

async function sendWithResend(apiKey: string, from: string, to: string[], content: EmailContent): Promise<SendResult> {
    try {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({ from, to, subject: content.subject, html: content.html, text: content.text }),
            signal: AbortSignal.timeout(10_000),
        });
        const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string; name?: string };
        if (!res.ok) return { ok: false, error: data.message || data.name || `Resend returned ${res.status}` };
        return { ok: true, id: data.id };
    } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : "The email couldn't be sent" };
    }
}

/** Emails the owner about an event, if notifications and that event are turned on in the dashboard. */
export async function notify<E extends NotificationEvent>(event: E, payload: NotificationPayloads[E]): Promise<SendResult> {
    try {
        const { settings, apiKey } = await loadConfig();
        if (!settings.enabled || !settings.events[event]?.enabled) return { ok: false, skipped: "disabled" };
        if (!apiKey || settings.recipients.length === 0) return { ok: false, skipped: "not-configured" };
        const result = await sendWithResend(apiKey, sender(settings), settings.recipients, renderNotification(event, payload));
        if (!result.ok) console.error(`[notifications] ${event} email failed:`, result.error);
        return result;
    } catch (error) {
        console.error(`[notifications] ${event}:`, error);
        return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
}

/** Dashboard → "Send a test email": uses the saved key and recipients even while notifications are off. */
export async function sendTestEmail(siteName: string): Promise<SendResult> {
    try {
        const { settings, apiKey } = await loadConfig();
        if (!apiKey) return { ok: false, error: "مفيش مفتاح API محفوظ. حطه في «مزوّد الإيميل والمستلمين» واحفظ الأول." };
        if (settings.recipients.length === 0) return { ok: false, error: "ضيف إيميل واحد على الأقل في المستلمين واحفظ الأول." };
        return await sendWithResend(apiKey, sender(settings), settings.recipients, renderTestEmail(siteName));
    } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
}
