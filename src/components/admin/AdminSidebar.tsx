"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import {
    BookOpen,
    Bot,
    Code,
    ExternalLink,
    FileText,
    FlaskConical,
    FolderOpen,
    History,
    LayoutDashboard,
    LogOut,
    MessageSquarePlus,
    MessagesSquare,
    PanelTop,
    Settings,
    Star,
    Tag,
    Type,
    UserPlus,
    Users,
    X,
    type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBrandingContext } from "@/components/providers/BrandingProvider";
import { Avatar, Badge, Button, ButtonLink, OVERLAY_TRANSITION } from "@/components/ui";
import { usePresence } from "@/hooks/usePresence";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

const menuItems: { icon: LucideIcon; label: string; href: string }[] = [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/admin" },
    { icon: PanelTop, label: "محتوى الواجهة (Hero)", href: "/admin/content" },
    { icon: Type, label: "نصوص الموقع", href: "/admin/copy" },
    { icon: Code, label: "المهارات", href: "/admin/skills" },
    { icon: FolderOpen, label: "معرض الأعمال", href: "/admin/projects" },
    { icon: Tag, label: "الأسعار والباقات (Pricing)", href: "/admin/pricing" },
    { icon: FileText, label: "المقالات والمدونة", href: "/admin/articles" },
    { icon: MessagesSquare, label: "منشورات المستخدمين (Feed)", href: "/admin/posts" },
    { icon: Star, label: "آراء العملاء", href: "/admin/reviews" },
    { icon: Users, label: "المستخدمين", href: "/admin/users" },
    { icon: UserPlus, label: "العملاء المحتملين (Leads)", href: "/admin/leads" },
    { icon: MessageSquarePlus, label: "مودال جمع الأرقام", href: "/admin/leads/capture" },
    { icon: Bot, label: "إعدادات المساعد الذكي", href: "/admin/ai" },
    { icon: BookOpen, label: "قاعدة معرفة المساعد", href: "/admin/ai/knowledge" },
    { icon: FlaskConical, label: "تجربة المساعد", href: "/admin/ai/test" },
    { icon: History, label: "سجلات محادثات AI", href: "/admin/ai-chats" },
    { icon: Settings, label: "إعدادات الموقع", href: "/admin/settings" },
];

/** The most specific menu item wins, so /admin/ai/knowledge doesn't also light up /admin/ai. */
function isActive(pathname: string, href: string) {
    const matches = (h: string) => (h === "/admin" ? pathname === "/admin" : pathname === h || pathname.startsWith(`${h}/`));
    if (!matches(href)) return false;
    return !menuItems.some((item) => item.href.length > href.length && item.href.startsWith(href) && matches(item.href));
}

interface AdminSidebarProps {
    /** Whether the drawer is open (phones and tablets only) */
    open: boolean;
    onClose: () => void;
}

/**
 * Admin navigation. A fixed column on large screens and a drawer on smaller ones,
 * both rendered from the same panel so the links live in one place.
 */
export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const branding = useBrandingContext();
    const [pendingReviewsCount, setPendingReviewsCount] = useState(0);

    useEffect(() => {
        const q = query(collection(db, "reviews"), where("status", "==", "pending"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPendingReviewsCount(snapshot.size);
        });
        return () => unsubscribe();
    }, []);

    // Drawer: Escape closes it, the page behind doesn't scroll, and it closes when the screen grows to desktop size
    useEffect(() => {
        if (!open) return undefined;
        const desktop = window.matchMedia("(min-width: 64rem)");
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        const onResize = () => desktop.matches && onClose();
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKey);
        desktop.addEventListener("change", onResize);
        return () => {
            document.body.style.overflow = previous;
            document.removeEventListener("keydown", onKey);
            desktop.removeEventListener("change", onResize);
        };
    }, [open, onClose]);

    const drawer = usePresence(open);

    const panelProps = {
        siteName: branding?.siteName || "GTech",
        siteLogo: branding?.siteLogo,
        pathname,
        pendingReviewsCount,
        onLogout: logout,
    };

    return (
        <>
            <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-background lg:flex">
                <SidebarPanel {...panelProps} />
            </aside>

            {drawer.mounted && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        aria-hidden
                        data-state={drawer.state}
                        className={cn("absolute inset-0 bg-overlay", OVERLAY_TRANSITION, "data-[state=closed]:opacity-0")}
                        onClick={onClose}
                    />
                    <aside
                        role="dialog"
                        aria-modal="true"
                        aria-label="Admin menu"
                        data-state={drawer.state}
                        className={cn(
                            "relative flex h-full w-72 max-w-[85vw] flex-col border-r border-border bg-background",
                            OVERLAY_TRANSITION,
                            "data-[state=closed]:-translate-x-full"
                        )}
                    >
                        <SidebarPanel {...panelProps} onNavigate={onClose} onClose={onClose} />
                    </aside>
                </div>
            )}
        </>
    );
}

interface SidebarPanelProps {
    siteName: string;
    siteLogo?: string;
    pathname: string;
    pendingReviewsCount: number;
    onLogout: () => void;
    /** Called when a link is followed (closes the drawer) */
    onNavigate?: () => void;
    /** Shows a close button (drawer only) */
    onClose?: () => void;
}

function SidebarPanel({ siteName, siteLogo, pathname, pendingReviewsCount, onLogout, onNavigate, onClose }: SidebarPanelProps) {
    return (
        <>
            <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border pl-4 pr-2">
                <Link href="/admin" onClick={onNavigate} className="flex min-w-0 flex-1 items-center gap-2.5">
                    <Avatar src={siteLogo} alt={siteName} size={28} />
                    <span className="min-w-0 leading-tight">
                        <span className="block truncate text-sm font-semibold text-foreground">{siteName}</span>
                        <span className="block text-xs text-subtle">Admin</span>
                    </span>
                </Link>
                {onClose && (
                    // autoFocus moves keyboard focus into the drawer when it opens
                    <Button variant="ghost" size="icon" aria-label="Close menu" onClick={onClose} autoFocus>
                        <X className="size-5" />
                    </Button>
                )}
            </div>

            <nav aria-label="Admin" className="flex-1 overflow-y-auto px-2 py-3">
                <ul className="space-y-0.5">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(pathname, item.href);
                        const showCount = item.href === "/admin/reviews" && pendingReviewsCount > 0;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={onNavigate}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                        "flex items-center gap-2.5 rounded-control px-3 py-2 text-sm transition-colors",
                                        active
                                            ? "bg-surface-hover font-medium text-foreground"
                                            : "text-muted hover:bg-surface-hover hover:text-foreground"
                                    )}
                                >
                                    <Icon className="size-4 shrink-0" />
                                    <span className="min-w-0 flex-1">{item.label}</span>
                                    {showCount && (
                                        <Badge variant="warning" className="px-2">
                                            {pendingReviewsCount}
                                        </Badge>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="shrink-0 space-y-0.5 border-t border-border px-2 py-3">
                <ButtonLink href="/" variant="ghost" onClick={onNavigate} className="w-full justify-start gap-2.5 px-3">
                    <ExternalLink />
                    العودة للموقع
                </ButtonLink>
                <Button
                    variant="ghost"
                    onClick={onLogout}
                    className="w-full justify-start gap-2.5 px-3 text-danger hover:bg-danger/10 hover:text-danger"
                >
                    <LogOut />
                    تسجيل الخروج
                </Button>
            </div>
        </>
    );
}
