"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Code, MessageSquare, Users, LogOut, Bot, History, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/admin" },
    { icon: FileText, label: "محتوى الواجهة (Hero)", href: "/admin/content" },
    { icon: Code, label: "المهارات", href: "/admin/skills" },
    { icon: FileText, label: "معرض الأعمال", href: "/admin/projects" },
    { icon: FileText, label: "المقالات والمدونة", href: "/admin/articles" },
    { icon: MessageSquare, label: "آراء العملاء", href: "/admin/reviews" },
    { icon: Users, label: "المستخدمين", href: "/admin/users" },
    { icon: Bot, label: "إعدادات شات AI", href: "/admin/ai" },
    { icon: History, label: "سجلات محادثات AI", href: "/admin/ai-chats" },
];

interface AdminSidebarProps {
    className?: string;
    onClose?: () => void;
}

export function AdminSidebar({ className, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className={cn("w-64 bg-slate-900 border-r border-slate-800 h-screen flex flex-col flex-shrink-0", className)}>
            <div className="p-6 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-blue-600/10 text-blue-400 border-r-2 border-blue-500"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors w-full bg-blue-500/5 rounded-lg border border-blue-500/20"
                >
                    <ExternalLink className="w-5 h-5" />
                    العودة للموقع
                </Link>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors w-full rounded-lg hover:bg-red-500/5"
                >
                    <LogOut className="w-5 h-5" />
                    تسجيل الخروج
                </button>
            </div>
        </aside>
    );
}
