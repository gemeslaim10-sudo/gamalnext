"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ALLOWED_ADMINS } from "@/lib/constants";
import Script from "next/script";

const ADMIN_EMAIL = "gamal@example.com"; // User should update this or we use env

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();



    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Admin...</div>;
    }

    // If on login page, render without sidebar
    if (pathname === "/admin/login") {
        return <div className="min-h-screen bg-slate-950">{children}</div>;
    }

    // Protected Admin View
    if (!user) return null; // Logic in useEffect will redirect

    return (
        <div className="min-h-screen bg-slate-950 flex">
            <Script src="https://widget.cloudinary.com/v2.0/global/all.js" strategy="lazyOnload" />
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-4 right-4 z-50 p-2 bg-slate-800 text-white rounded-lg md:hidden border border-slate-700 shadow-lg"
            >
                {isSidebarOpen ? "✕" : "☰"}
            </button>

            {/* Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <AdminSidebar
                className={`fixed left-0 top-0 h-full z-40 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:static`}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen w-full">
                {children}
            </main>
        </div>
    );
}
