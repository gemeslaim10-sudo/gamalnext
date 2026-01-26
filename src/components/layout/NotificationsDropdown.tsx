"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, limit } from "firebase/firestore";
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

        // Is this user an admin?
        const isAdmin = user.email && ADMIN_EMAILS.includes(user.email);

        // Build query: My notifications OR Admin notifications if I am admin
        // Firestore OR queries are restricted. We will listen to my quota.
        // For admin, we can have a separate hook or just simplistic logic:
        // If normal user -> recipientId == uid
        // If admin -> recipientId == uid OR recipientId == 'ADMIN'. 
        // For simplicity, we just listen to recipientId == uid first. 
        // To support ADMIN notifications, we need complex query or multiple listeners.

        let q = query(
            collection(db, "notifications"),
            where("recipientId", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(10)
        );

        if (isAdmin) {
            // NOTE: Firestore doesn't support logical OR in `where` easily with different fields or strict inequality mixed.
            // But here we want recipientId IN [uid, 'ADMIN'].
            q = query(
                collection(db, "notifications"),
                where("recipientId", "in", [user.uid, 'ADMIN']),
                orderBy("createdAt", "desc"),
                limit(10)
            );
        }

        const unsubscribe = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Notification));
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        });

        return () => unsubscribe();
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
            case 'like': return `${n.senderName} أعجب بمقالك`;
            case 'comment': return `${n.senderName} علق على مقالك`;
            case 'welcome': return `مرحباً بك ${n.senderName} في موقعنا!`;
            case 'review_request': return `${n.senderName} أرسل مقالاً للمراجعة`;
            case 'article_approved': return `تمت الموافقة على مقالك ونشره!`;
            default: return 'إشعار جديد';
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
                    <div className="absolute left-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto">
                        <div className="p-3 border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0">
                            <h3 className="font-bold text-white text-sm">الإشعارات</h3>
                        </div>

                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm">لا توجد إشعارات حالياً</div>
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
                                                {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleDateString('ar-EG') : 'الآن'}
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
