"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { Menu } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useBrandingContext } from "@/components/providers/BrandingProvider";
import { ALLOWED_ADMINS } from "@/lib/constants";
import { Button, LoadingBlock } from "@/components/ui";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const branding = useBrandingContext();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [lastPathname, setLastPathname] = useState(pathname);
    const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

    // Close the mobile menu whenever the route changes (e.g. browser back)
    if (lastPathname !== pathname) {
        setLastPathname(pathname);
        setIsSidebarOpen(false);
    }

    useEffect(() => {
        if (!loading) {
            if (!user && pathname !== "/admin/login") {
                router.push("/admin/login");
            } else if (user && !ALLOWED_ADMINS.includes(user.email || "") && pathname !== "/admin/login") {
                // If logged in but not admin, maybe redirect to home or show denied
                alert("Access Denied. You are not an admin.");
                router.push("/");
            }
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return <LoadingBlock label="Loading Admin..." className="flex-1" />;
    }

    // If on login page, render without sidebar
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    // Protected Admin View
    if (!user) return null; // Logic in useEffect will redirect

    const siteName = branding?.siteName || "GTech";

    return (
        <div className="flex flex-1">
            <Script src="https://widget.cloudinary.com/v2.0/global/all.js" strategy="lazyOnload" />

            <AdminSidebar open={isSidebarOpen} onClose={closeSidebar} />

            <div className="flex min-w-0 flex-1 flex-col">
                {/* Top bar on phones and tablets */}
                <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-2 sm:px-4 lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Open menu"
                        aria-expanded={isSidebarOpen}
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="size-5" />
                    </Button>
                    <Link href="/admin" className="flex min-w-0 items-center gap-2 text-sm">
                        <span className="truncate font-semibold text-foreground">{siteName}</span>
                        <span className="shrink-0 text-subtle">Admin</span>
                    </Link>
                </header>

                <main className="min-w-0 flex-1">
                    <div className="mx-auto max-w-page px-4 py-6 sm:px-6 sm:py-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
