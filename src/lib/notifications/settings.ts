// Email notifications model — safe to import on the client and the server.
// Settings: Firestore settings/notifications (admin-only). The provider API key lives in its own
// admin-only document, settings/notifications_secret, which the dashboard writes but never shows.

export const NOTIFICATIONS_DOC = { collection: "settings", id: "notifications" } as const;
export const NOTIFICATIONS_SECRET_DOC = { collection: "settings", id: "notifications_secret" } as const;

/** Events that can send an email. Order = order in the dashboard. */
export const NOTIFICATION_EVENTS = ["lead.new", "user.signup", "article.pending", "post.pending", "review.pending"] as const;
export type NotificationEvent = (typeof NOTIFICATION_EVENTS)[number];

export const NOTIFICATION_EVENT_INFO: Record<NotificationEvent, { label: string; description: string }> = {
    "lead.new": {
        label: "عميل محتمل جديد",
        description: "حد ساب اسمه ورقمه من نافذة الأرقام أو صفحة التواصل أو الأسعار أو الشات (ولو نفس الرقم رجع تاني).",
    },
    "user.signup": { label: "عضو جديد", description: "حد عمل حساب جديد على الموقع (بجوجل أو بالإيميل)." },
    "article.pending": { label: "مقال مستني المراجعة", description: "عضو كتب مقال ومستني موافقتك عشان يتنشر." },
    "post.pending": { label: "منشور مستني المراجعة", description: "عضو نشر بوست ومستني موافقتك عشان يظهر في الرئيسية." },
    "review.pending": { label: "تقييم جديد", description: "عميل كتب تقييم ومستني موافقتك عشان يظهر في البروفايل." },
};

export interface NotificationSettings {
    /** Master switch: nothing is sent while off */
    enabled: boolean;
    provider: "resend";
    /** Who receives the emails */
    recipients: string[];
    /** Sender name shown in the inbox */
    fromName: string;
    /**
     * Sender address. "onboarding@resend.dev" works without any setup, but only to the email you
     * signed up to Resend with; use an address on your own verified domain to send to anyone.
     */
    fromEmail: string;
    /** Last characters of the saved API key, so the dashboard can show one is saved ("" = none) */
    apiKeyHint: string;
    events: Record<NotificationEvent, { enabled: boolean }>;
}

export const DEFAULT_NOTIFICATIONS: NotificationSettings = {
    enabled: false,
    provider: "resend",
    recipients: [],
    fromName: "GTech",
    fromEmail: "onboarding@resend.dev",
    apiKeyHint: "",
    events: Object.fromEntries(NOTIFICATION_EVENTS.map((event) => [event, { enabled: true }])) as NotificationSettings["events"],
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = (value: string) => EMAIL.test(value.trim());

export function normalizeNotifications(raw: unknown): NotificationSettings {
    const data = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    const events = data.events && typeof data.events === "object" ? (data.events as Record<string, unknown>) : {};
    const d = DEFAULT_NOTIFICATIONS;
    return {
        enabled: typeof data.enabled === "boolean" ? data.enabled : d.enabled,
        provider: "resend",
        recipients: Array.isArray(data.recipients)
            ? data.recipients.filter((item): item is string => typeof item === "string" && isEmail(item)).map((item) => item.trim())
            : d.recipients,
        fromName: typeof data.fromName === "string" ? data.fromName : d.fromName,
        fromEmail: typeof data.fromEmail === "string" && data.fromEmail.trim() ? data.fromEmail.trim() : d.fromEmail,
        apiKeyHint: typeof data.apiKeyHint === "string" ? data.apiKeyHint : d.apiKeyHint,
        events: Object.fromEntries(
            NOTIFICATION_EVENTS.map((event) => {
                const value = events[event] as { enabled?: unknown } | undefined;
                return [event, { enabled: typeof value?.enabled === "boolean" ? value.enabled : d.events[event].enabled }];
            })
        ) as NotificationSettings["events"],
    };
}

/** "…1a2b" from a key, for display. */
export function keyHint(key: string) {
    const clean = key.trim();
    return clean ? `…${clean.slice(-4)}` : "";
}
