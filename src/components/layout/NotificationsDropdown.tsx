"use client";

import { Bell } from "lucide-react";
import { useNotifications, Notification } from "./hooks/useNotifications";
import { formatTimestamp } from "@/types";

export default function NotificationsDropdown() {
    const {
        user,
        notifications,
        unreadCount,
        isOpen,
        setIsOpen,
        handleRead
    } = useNotifications();

    const getIcon = (type: string) => {
        switch (type) {
            case 'like': return '❤️';
            case 'comment': return '💬';
            case 'welcome': return '🎉';
            case 'review_request': return '📝';
            case 'article_approved': return '✅';
            default: return '🔔';
        }
    };

    const getText = (n: Notification) => {
        switch (n.type) {
            case 'like': return `${n.senderName} liked your article`;
            case 'comment': return `${n.senderName} commented on your article`;
            case 'welcome': return `Welcome ${n.senderName} to our website!`;
            case 'review_request': return `${n.senderName} submitted an article for review`;
            case 'article_approved': return `Your article was approved and published!`;
            default: return 'New notification';
        }
    };

    if (!user) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-slate-900">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto">
                        <div className="p-3 border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0">
                            <h3 className="font-bold text-white text-sm">Notifications</h3>
                        </div>

                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm">No notifications currently</div>
                        ) : (
                            <div className="divide-y divide-slate-800">
                                {notifications.map(n => (
                                    <div
                                        key={n.id}
                                        onClick={() => handleRead(n)}
                                        className={`p-4 flex gap-3 cursor-pointer hover:bg-slate-800/50 transition-colors ${n.read ? 'opacity-60' : 'bg-blue-500/5'}`}
                                    >
                                        <span className="text-xl pt-1">{getIcon(n.type)}</span>
                                        <div>
                                            <p className="text-sm text-slate-200 leading-snug">{getText(n)}</p>
                                            <span className="text-xs text-slate-500 mt-1 block">
                                                {formatTimestamp(n.createdAt, 'en-US') || 'Now'}
                                            </span>
                                        </div>
                                        {!n.read && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-auto shrink-0" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
