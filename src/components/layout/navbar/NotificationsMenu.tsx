"use client";

import { Bell, CheckCircle2, FileText, Heart, MessageCircle, Sparkles } from "lucide-react";
import { useNotifications, type Notification } from "../hooks/useNotifications";
import { formatTimestamp } from "@/types";
import { Dropdown } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";
import type { CopyKey } from "@/config/copy";
import { cn } from "@/lib/utils";

const ICONS = {
    like: Heart,
    comment: MessageCircle,
    welcome: Sparkles,
    review_request: FileText,
    article_approved: CheckCircle2,
} as const;

const TEXT_KEYS: Record<string, CopyKey> = {
    like: "nav.notifyLike",
    comment: "nav.notifyComment",
    welcome: "nav.notifyWelcome",
    review_request: "nav.notifyReview",
    article_approved: "nav.notifyApproved",
};

export function NotificationsMenu() {
    const { notifications, unreadCount, handleRead } = useNotifications();
    const t = useCopy();
    const describe = (n: Notification) => t(TEXT_KEYS[n.type] ?? "nav.notifyDefault", { name: n.senderName });

    return (
        <Dropdown
            className="w-80 max-w-[calc(100vw-2rem)] p-0"
            trigger={({ open, toggle }) => (
                <button
                    type="button"
                    onClick={toggle}
                    aria-expanded={open}
                    aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : "Notifications"}
                    className="relative flex size-10 items-center justify-center rounded-control text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                >
                    <Bell className="size-5" />
                    {unreadCount > 0 && (
                        <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                            {unreadCount}
                        </span>
                    )}
                </button>
            )}
        >
            {(close) => (
                <div className="max-h-96 overflow-y-auto">
                    <p className="sticky top-0 border-b border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground">
                        {t("nav.notifications")}
                    </p>
                    {notifications.length === 0 ? (
                        <p className="px-4 py-10 text-center text-sm text-subtle">{t("nav.notificationsEmpty")}</p>
                    ) : (
                        <ul className="divide-y divide-border">
                            {notifications.map((n) => {
                                const Icon = ICONS[n.type] ?? Bell;
                                return (
                                    <li key={n.id}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                close();
                                                handleRead(n);
                                            }}
                                            className={cn(
                                                "flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover",
                                                n.read && "opacity-60"
                                            )}
                                        >
                                            <Icon className="mt-0.5 size-4 shrink-0 text-muted" />
                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm leading-snug text-foreground">{describe(n)}</span>
                                                <span className="mt-1 block text-xs text-subtle">
                                                    {formatTimestamp(n.createdAt, "en-US") || "Now"}
                                                </span>
                                            </span>
                                            {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-foreground" aria-label="Unread" />}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </Dropdown>
    );
}
