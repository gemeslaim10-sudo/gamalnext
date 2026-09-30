"use client";

import { useMemo } from "react";
import { useAdminDoc, useAdminDocPeek } from "@/components/admin/kit";
import { NOTIFICATIONS_DOC, normalizeNotifications } from "@/lib/notifications/settings";

// settings/notifications is admin-only and visitors never see it, so saves don't refresh the site.
// The API key itself is in settings/notifications_secret, which the dashboard writes but never reads.

const NOTIFICATIONS_PATH = `${NOTIFICATIONS_DOC.collection}/${NOTIFICATIONS_DOC.id}` as const;

/** The notification settings, only if an editor already read them during this visit (never reads). */
export function useKnownNotificationSettings() {
    const loaded = useAdminDocPeek(NOTIFICATIONS_PATH);
    return useMemo(() => (loaded ? normalizeNotifications(loaded) : null), [loaded]);
}

/** settings/notifications for an editor (read once per visit, shared). */
export function useNotificationsDoc() {
    return useAdminDoc(NOTIFICATIONS_PATH, normalizeNotifications);
}
