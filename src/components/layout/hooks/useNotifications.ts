import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, limit, Unsubscribe } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const ADMIN_EMAILS = ["montasrrm@gmail.com", "gemeslaim10@gmail.com"];

export type Notification = {
    id: string;
    senderName: string;
    type: 'welcome' | 'like' | 'comment' | 'review_request' | 'article_approved';
    link: string;
    read: boolean;
    createdAt: any;
}

export function useNotifications() {
    const { user } = useAuth();
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!user) return;

        const isAdmin = user.email && ADMIN_EMAILS.includes(user.email);
        const unsubscribers: Unsubscribe[] = [];

        let userNotifs: Notification[] = [];
        let adminNotifs: Notification[] = [];

        const mergeAndUpdate = () => {
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
            await updateDoc(doc(db, "notifications", notif.id), { read: true });
        }
        setIsOpen(false);
        if (notif.link) router.push(notif.link);
    };

    return {
        user,
        notifications,
        unreadCount,
        isOpen,
        setIsOpen,
        handleRead
    };
}
