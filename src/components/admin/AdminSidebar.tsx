"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Briefcase, Code, MessageSquare, Users, LogOut, Bot, History } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: FileText, label: "Content (Hero)", href: "/admin/content" },
    { icon: Code, label: "Skills", href: "/admin/skills" },
    { icon: Briefcase, label: "Experience", href: "/admin/experience" },
    { icon: FileText, label: "Projects", href: "/admin/projects" },
    { icon: FileText, label: "Articles (Blog)", href: "/admin/articles" },
    { icon: MessageSquare, label: "Reviews", href: "/admin/reviews" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: Bot, label: "AI Chat Settings", href: "/admin/ai" },
    { icon: History, label: "AI Chat Logs", href: "/admin/ai-chats" },
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

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors w-full"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
