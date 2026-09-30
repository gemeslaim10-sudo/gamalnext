"use client";

import { useId } from "react";
import type { AdminDoc } from "@/components/admin/kit";
import { Alert, ButtonLink, Card, Label, Switch } from "@/components/ui";
import {
    NOTIFICATION_EVENTS,
    NOTIFICATION_EVENT_INFO,
    type NotificationEvent,
    type NotificationSettings,
} from "@/lib/notifications/settings";
import { NotificationsEditor, useNotificationsPart } from "../components/NotificationsEditor";

type EventsDraft = NotificationSettings["events"];

const pick = (settings: NotificationSettings): EventsDraft => settings.events;
const write = (events: EventsDraft, doc: AdminDoc<NotificationSettings>) => doc.save({ events }, { refresh: false });

/** Which events send an email. */
export default function NotificationsEventsEditor() {
    const part = useNotificationsPart(pick, write);
    const masterOff = part.doc.data?.enabled === false;

    return (
        <NotificationsEditor title="الأحداث" description="اختار إيه اللي يبعتلك إيميل لما يحصل." part={part}>
            {(events) => (
                <>
                    {masterOff && (
                        <Alert className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <span>الإشعارات مقفولة كلها دلوقتي، فمفيش حاجة هتتبعت لحد ما تشغّلها.</span>
                            <ButtonLink href="/admin/notifications/provider" variant="secondary" size="sm" className="shrink-0">
                                تشغيل الإشعارات
                            </ButtonLink>
                        </Alert>
                    )}
                    <Card padding="none">
                        <ul className="divide-y divide-border">
                            {NOTIFICATION_EVENTS.map((event) => (
                                <EventRow
                                    key={event}
                                    event={event}
                                    checked={events[event].enabled}
                                    onChange={(enabled) => part.set({ [event]: { enabled } })}
                                />
                            ))}
                        </ul>
                    </Card>
                </>
            )}
        </NotificationsEditor>
    );
}

function EventRow({ event, checked, onChange }: { event: NotificationEvent; checked: boolean; onChange: (enabled: boolean) => void }) {
    const id = useId();
    const info = NOTIFICATION_EVENT_INFO[event];
    return (
        <li className="flex items-start justify-between gap-4 px-4 py-4 sm:px-5">
            <div className="min-w-0">
                <Label htmlFor={id} className="cursor-pointer">
                    {info.label}
                </Label>
                <p className="mt-1 text-xs leading-relaxed text-subtle">{info.description}</p>
            </div>
            <Switch id={id} checked={checked} onCheckedChange={onChange} className="mt-0.5" />
        </li>
    );
}
