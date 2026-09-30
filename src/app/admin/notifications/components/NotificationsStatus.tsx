"use client";

import { Alert } from "@/components/ui";
import { NOTIFICATION_EVENTS } from "@/lib/notifications/settings";
import { useKnownNotificationSettings } from "./notificationsDoc";

/**
 * One line on the hub saying how notifications stand — only when an editor already read the
 * settings during this visit (the hub itself never reads the database).
 */
export function NotificationsStatus() {
    const settings = useKnownNotificationSettings();
    if (!settings) return null;

    const hasKey = settings.apiKeyHint !== "";
    const recipients = settings.recipients.length;
    const eventsOn = NOTIFICATION_EVENTS.filter((event) => settings.events[event].enabled).length;

    if (!settings.enabled) {
        return <Alert className="mb-6">الإشعارات مقفولة دلوقتي، ومفيش إيميلات بتتبعت.</Alert>;
    }
    if (!hasKey || recipients === 0) {
        const missing = [!hasKey && "مفتاح API", recipients === 0 && "مستلم"].filter(Boolean).join(" و");
        return (
            <Alert variant="warning" className="mb-6">
                الإشعارات متشغّلة بس ناقصها {missing}، فمش هتتبعت لحد ما تكمّلها.
            </Alert>
        );
    }
    return (
        <Alert variant="success" className="mb-6">
            الإشعارات شغالة: {eventsOn} من {NOTIFICATION_EVENTS.length} أحداث، بتوصل لـ {recipients} إيميل.
        </Alert>
    );
}
