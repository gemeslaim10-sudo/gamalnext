"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Code, MessageSquare, Users, LogOut, Bot, History, ExternalLink, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const menuItems = [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/admin" },
    { icon: FileText, label: "محتوى الواجهة (Hero)", href: "/admin/content" },
    { icon: Code, label: "المهارات", href: "/admin/skills" },
    { icon: FileText, label: "معرض الأعمال", href: "/admin/projects" },
    { icon: FileText, label: "المقالات والمدونة", href: "/admin/articles" },
    { icon: MessageSquare, label: "منشورات المستخدمين (Feed)", href: "/admin/posts" },
    { icon: MessageSquare, label: "الإعلانات (Explore Ads)", href: "/admin/ads" },
    { icon: MessageSquare, label: "آراء العملاء", href: "/admin/reviews" },
    { icon: Users, label: "المستخدمين", href: "/admin/users" },
    { icon: Users, label: "العملاء المحتملين (Leads)", href: "/admin/leads" },
    { icon: Bot, label: "إعدادات شات AI", href: "/admin/ai" },
    { icon: History, label: "سجلات محادثات AI", href: "/admin/ai-chats" },
    { icon: Settings, label: "إعدادات الموقع", href: "/admin/settings" },
];

interface AdminSidebarProps {
    className?: string;
    onClose?: () => void;
}

export function AdminSidebar({ className, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [pendingReviewsCount, setPendingReviewsCount] = useState(0);

    useEffect(() => {
        const q = query(collection(db, "reviews"), where("status", "==", "pending"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPendingReviewsCount(snapshot.size);
        });
        return () => unsubscribe();
    }, []);

    return (
        <aside className={cn("w-56 bg-slate-900 border-r border-slate-800 h-screen flex flex-col flex-shrink-0", className)}>
            <div className="px-5 py-4 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white">Admin Panel</h2>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        const isReviews = item.href === "/admin/reviews";
                        
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center gap-2.5 px-5 py-2.5 text-[13px] font-medium transition-colors relative",
                                        isActive
                                            ? "bg-blue-600/10 text-blue-400 border-r-2 border-blue-500"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                    
                                    {isReviews && pendingReviewsCount > 0 && (
                                        <span className="absolute left-5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                            {pendingReviewsCount}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="px-3 py-3 border-t border-slate-800 space-y-1.5">
                <Link
                    href="/"
                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-blue-400 hover:text-blue-300 transition-colors w-full bg-blue-500/5 rounded-lg border border-blue-500/20"
                >
                    <ExternalLink className="w-4 h-4" />
                    العودة للموقع
                </Link>
                <button
                    onClick={logout}
                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-red-400 hover:text-red-300 transition-colors w-full rounded-lg hover:bg-red-500/5"
                >
                    <LogOut className="w-4 h-4" />
                    تسجيل الخروج
                </button>
            </div>
        </aside>
    );
}
