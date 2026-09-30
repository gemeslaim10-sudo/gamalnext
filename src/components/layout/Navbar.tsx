"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBrandingContext } from "@/components/providers/BrandingProvider";
import { AuthModal } from "@/components/auth/AuthModal";
import { useCopy } from "@/components/providers/CopyProvider";
import { NAV_LINKS, isActivePath, type NavLink } from "@/config/navigation";
import { Avatar, Button, Container } from "@/components/ui";
import { cn } from "@/lib/utils";
import { UserMenu } from "./navbar/UserMenu";
import { MobileMenu } from "./navbar/MobileMenu";

// Signed-in members only: loads (with the database library it needs) after sign-in, not for every visitor
const NotificationsMenu = dynamic(() => import("./navbar/NotificationsMenu").then((mod) => mod.NotificationsMenu), {
    ssr: false,
});

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const branding = useBrandingContext();
    const [menuOpen, setMenuOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const t = useCopy();

    // Other components (e.g. "log in to comment") open the auth modal through this event
    useEffect(() => {
        const open = () => setAuthOpen(true);
        document.addEventListener("open-auth-modal", open);
        return () => document.removeEventListener("open-auth-modal", open);
    }, []);

    const siteName = branding?.siteName || "GTech";

    return (
        <>
            <header className="sticky top-0 z-40 border-b border-border bg-background">
                <Container className="flex h-14 items-center gap-6">
                    <Link href="/" onClick={() => setMenuOpen(false)} className="flex min-w-0 items-center gap-2.5">
                        <Avatar src={branding?.siteLogo} alt={siteName} size={28} priority />
                        <span className="truncate text-sm font-semibold text-foreground">{siteName}</span>
                    </Link>

                    <nav aria-label="Main" className="ml-auto hidden items-center gap-1 lg:flex">
                        {NAV_LINKS.map((link) => (
                            <NavItem key={link.href} link={link} active={isActivePath(pathname, link.href)} />
                        ))}
                    </nav>

                    <div className="ml-auto flex shrink-0 items-center gap-1 lg:ml-0">
                        {user && <NotificationsMenu />}
                        <div className="hidden lg:block">
                            {user ? (
                                <UserMenu user={user} onLogout={logout} />
                            ) : (
                                <Button size="sm" onClick={() => setAuthOpen(true)}>
                                    {t("nav.login")}
                                </Button>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((v) => !v)}
                        >
                            {menuOpen ? (
                                <X key="close" className="size-5 animate-fade-in" />
                            ) : (
                                <Menu key="open" className="size-5 animate-fade-in" />
                            )}
                        </Button>
                    </div>
                </Container>
            </header>

            <MobileMenu
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                pathname={pathname}
                user={user}
                onLogout={logout}
                onLogin={() => {
                    setMenuOpen(false);
                    setAuthOpen(true);
                }}
            />
            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        </>
    );
}

function NavItem({ link, active }: { link: NavLink; active: boolean }) {
    const t = useCopy();
    const classes = cn(
        "rounded-control px-3 py-1.5 text-sm transition-colors",
        active ? "bg-surface-hover text-foreground" : "text-muted hover:text-foreground"
    );
    if (link.external) {
        return (
            <a href={link.href} target="_blank" rel="noopener noreferrer" className={classes}>
                {t(link.labelKey)}
            </a>
        );
    }
    return (
        <Link href={link.href} aria-current={active ? "page" : undefined} className={classes}>
            {t(link.labelKey)}
        </Link>
    );
}
