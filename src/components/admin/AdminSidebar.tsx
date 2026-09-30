"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBrandingContext } from "@/components/providers/BrandingProvider";
import { Avatar, Badge, Button, ButtonLink, OVERLAY_TRANSITION } from "@/components/ui";
import { usePresence } from "@/hooks/usePresence";
import { ADMIN_NAV, findAdminNavItem } from "@/config/admin-nav";
import { useAdminCounts, type AdminCounts } from "@/components/admin/data/useAdminCounts";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
    /** Whether the drawer is open (phones and tablets only) */
    open: boolean;
    onClose: () => void;
}

/**
 * Dashboard navigation, grouped by what the owner is doing (src/config/admin-nav.ts). A fixed
 * column on large screens and a drawer on smaller ones, rendered from the same panel.
 */
export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const branding = useBrandingContext();
    // Counted once per visit (no live connection); moderation pages refresh them
    const counts = useAdminCounts();

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
        activeHref: findAdminNavItem(pathname)?.href,
        counts,
        onLogout: logout,
    };

    return (
        <>
            <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-e border-border bg-background lg:flex">
                <SidebarPanel {...panelProps} />
            </aside>

            {drawer.mounted && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div
                        aria-hidden
                        data-state={drawer.state}
                        className={cn("absolute inset-0 bg-overlay", OVERLAY_TRANSITION, "data-[state=closed]:opacity-0")}
                        onClick={onClose}
                    />
                    <aside
                        role="dialog"
                        aria-modal="true"
                        aria-label="قائمة لوحة التحكم"
                        data-state={drawer.state}
                        className={cn(
                            "relative flex h-full w-72 max-w-[85vw] flex-col border-e border-border bg-background",
                            OVERLAY_TRANSITION,
                            // Slides in from the side it sits on (the right in the right-to-left dashboard)
                            "rtl:data-[state=closed]:translate-x-full ltr:data-[state=closed]:-translate-x-full"
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
    activeHref?: string;
    counts: AdminCounts | null;
    onLogout: () => void;
    /** Called when a link is followed (closes the drawer) */
    onNavigate?: () => void;
    /** Shows a close button (drawer only) */
    onClose?: () => void;
}

function SidebarPanel({ siteName, siteLogo, activeHref, counts, onLogout, onNavigate, onClose }: SidebarPanelProps) {
    return (
        <>
            <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border ps-4 pe-2">
                <Link href="/admin" onClick={onNavigate} className="flex min-w-0 flex-1 items-center gap-2.5">
                    <Avatar src={siteLogo} alt={siteName} size={32} />
                    <span className="min-w-0 leading-tight">
                        <span className="block truncate text-sm font-semibold text-foreground">{siteName}</span>
                        <span className="block text-xs text-subtle">لوحة التحكم</span>
                    </span>
                </Link>
                {onClose && (
                    // autoFocus moves keyboard focus into the drawer when it opens
                    <Button variant="ghost" size="icon" aria-label="إغلاق القائمة" onClick={onClose} autoFocus>
                        <X className="size-5" />
                    </Button>
                )}
            </div>

            <nav aria-label="لوحة التحكم" className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
                {ADMIN_NAV.map((section) => (
                    <div key={section.id}>
                        {section.id !== "overview" && (
                            <p className="mb-1.5 px-3 text-[11px] font-medium tracking-wide text-subtle">{section.label}</p>
                        )}
                        <ul className="space-y-0.5">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const active = item.href === activeHref;
                                const count = item.badge && counts ? counts[item.badge] : 0;
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
                                            <span className="min-w-0 flex-1 truncate">{item.label}</span>
                                            {count > 0 && (
                                                <Badge variant="warning" className="px-2 tabular-nums">
                                                    {count}
                                                </Badge>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="shrink-0 space-y-0.5 border-t border-border px-3 py-3">
                <ButtonLink href="/" variant="ghost" onClick={onNavigate} className="w-full justify-start gap-2.5 px-3">
                    <ExternalLink />
                    عرض الموقع
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
