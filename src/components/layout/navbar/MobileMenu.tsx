"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { User } from "firebase/auth";
import { ArrowUpRight } from "lucide-react";
import { NAV_LINKS, getAccountLinks, isActivePath, type NavLink } from "@/config/navigation";
import { ALLOWED_ADMINS } from "@/lib/constants";
import { Avatar, Button, Container, OVERLAY_TRANSITION } from "@/components/ui";
import { usePresence } from "@/hooks/usePresence";
import { useCopy } from "@/components/providers/CopyProvider";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
    open: boolean;
    onClose: () => void;
    pathname: string;
    user: User | null;
    onLogout: () => void;
    onLogin: () => void;
}

/** Full-width menu under the navbar on phones and tablets. Same links as the desktop bar. */
export function MobileMenu({ open, onClose, pathname, user, onLogout, onLogin }: MobileMenuProps) {
    const { mounted, state } = usePresence(open);
    const t = useCopy();

    useEffect(() => {
        if (!open) return undefined;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = previous;
            document.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    if (!mounted) return null;

    const isAdmin = !!user?.email && ALLOWED_ADMINS.includes(user.email);

    return (
        <div
            data-state={state}
            className={cn(
                "fixed inset-x-0 bottom-0 top-14 z-45 overflow-y-auto bg-background lg:hidden",
                OVERLAY_TRANSITION,
                "data-[state=closed]:-translate-y-2 data-[state=closed]:opacity-0"
            )}
        >
            <Container className="flex flex-col gap-8 py-4">
                <nav aria-label="Mobile" className="flex flex-col">
                    {NAV_LINKS.map((link) => (
                        <MobileLink key={link.href} link={link} active={isActivePath(pathname, link.href)} onNavigate={onClose} />
                    ))}
                </nav>

                {user ? (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 pb-3">
                            <Avatar src={user.photoURL} alt={user.displayName || "Account"} size={36} />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-foreground">{user.displayName || "Account"}</p>
                                <p className="truncate text-xs text-subtle">{user.email}</p>
                            </div>
                        </div>
                        {getAccountLinks(user.uid, isAdmin).map((link) => (
                            <MobileLink key={link.href} link={link} active={isActivePath(pathname, link.href)} onNavigate={onClose} />
                        ))}
                        <Button
                            variant="secondary"
                            className="mt-4 w-full"
                            onClick={() => {
                                onLogout();
                                onClose();
                            }}
                        >
                            {t("nav.logout")}
                        </Button>
                    </div>
                ) : (
                    <Button size="lg" className="w-full" onClick={onLogin}>
                        {t("nav.loginMobile")}
                    </Button>
                )}
            </Container>
        </div>
    );
}

function MobileLink({ link, active, onNavigate }: { link: NavLink; active: boolean; onNavigate: () => void }) {
    const t = useCopy();
    const classes = cn(
        "flex items-center justify-between border-b border-border py-3 text-base transition-colors",
        active ? "font-medium text-foreground" : "text-muted hover:text-foreground"
    );
    if (link.external) {
        return (
            <a href={link.href} target="_blank" rel="noopener noreferrer" onClick={onNavigate} className={classes}>
                {t(link.labelKey)}
                <ArrowUpRight className="size-4 text-subtle" />
            </a>
        );
    }
    return (
        <Link href={link.href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={classes}>
            {t(link.labelKey)}
        </Link>
    );
}
