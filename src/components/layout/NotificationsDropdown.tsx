"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, limit, Unsubscribe } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Bell, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Hardcoded Admin emails check to simplify 'ADMIN' recipient logic
const ADMIN_EMAILS = ["montasrrm@gmail.com", "gemeslaim10@gmail.com"];

type Notification = {
    id: string;
    senderName: string;
    type: 'welcome' | 'like' | 'comment' | 'review_request' | 'article_approved';
    link: string;
    read: boolean;
    createdAt: any;
}

export default function NotificationsDropdown() {
    const { user } = useAuth();
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!user) return;

        const isAdmin = user.email && ADMIN_EMAILS.includes(user.email);

        // ── Strategy ──
        // Instead of a single query with `where("recipientId", "in", [uid, "ADMIN"])` + `orderBy`
        // which requires a composite Firestore index that may not exist and can fail silently,
        // we use **two independent listeners** for admins and merge results client-side.
        // For regular users only one listener is created (no overhead).

        const unsubscribers: Unsubscribe[] = [];

        // Bucket for merging results from both listeners
        let userNotifs: Notification[] = [];
        let adminNotifs: Notification[] = [];

        const mergeAndUpdate = () => {
            // Combine, deduplicate by id, sort by createdAt descending, and limit to 20
            const merged = new Map<string, Notification>();
            for (const n of [...userNotifs, ...adminNotifs]) {
                merged.set(n.id, n);
            }
            const sorted = Array.from(merged.values()).sort((a, b) => {
                const getTime = (ts: any): number => {
                    if (!ts) return 0;
                    if (typeof ts.toMillis === 'function') return ts.toMillis();
                    if (typeof ts.seconds === 'number') return ts.seconds * 1000;
                    return 0;
                };
                return getTime(b.createdAt) - getTime(a.createdAt);
            }).slice(0, 20);

            setNotifications(sorted);
            setUnreadCount(sorted.filter(n => !n.read).length);
        };

        // Listener 1: User-specific notifications (always active)
        const userQuery = query(
            collection(db, "notifications"),
            where("recipientId", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(15)
        );
        unsubscribers.push(
            onSnapshot(userQuery, (snap) => {
                userNotifs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Notification));
                mergeAndUpdate();
            }, (error) => {
                console.error("User notifications listener error:", error);
            })
        );

        // Listener 2: Admin broadcast notifications (only for admins)
        if (isAdmin) {
            const adminQuery = query(
                collection(db, "notifications"),
                where("recipientId", "==", "ADMIN"),
                orderBy("createdAt", "desc"),
                limit(15)
            );
            unsubscribers.push(
                onSnapshot(adminQuery, (snap) => {
                    adminNotifs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Notification));
                    mergeAndUpdate();
                }, (error) => {
                    console.error("Admin notifications listener error:", error);
                })
            );
        }

        return () => {
            unsubscribers.forEach(unsub => unsub());
        };
    }, [user]);

    const handleRead = async (notif: Notification) => {
        if (!notif.read && user) {
            // Mark as read
            await updateDoc(doc(db, "notifications", notif.id), { read: true });
        }
        setIsOpen(false);
        if (notif.link) router.push(notif.link);
    };

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
                                                {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleDateString('en-US') : 'Now'}
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
