"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { LogIn, Shield, Settings } from "lucide-react";
import { ADMIN_EMAILS } from "./sidebarConfig";

export default function SidebarUserSection() {
    const { user, loading } = useAuth();
    const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

    return (
        <div className="px-4 py-4 border-b border-slate-800/30">
            {loading ? (
                <div className="h-10 bg-slate-800/50 rounded-lg animate-pulse" />
            ) : user ? (
                <div className="space-y-2">
                    {/* Profile Link */}
                    <Link
                        href={`/users/${user.uid}`}
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-800/50 transition-colors group"
                    >
                        {user.photoURL ? (
                            <Image
                                src={user.photoURL}
                                alt="Avatar"
                                width={28}
                                height={28}
                                className="rounded-full ring-2 ring-slate-700 group-hover:ring-blue-500/50 transition-all"
                            />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                                {user.displayName?.[0] || 'U'}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user.displayName || 'User'}</p>
                            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        </div>
                    </Link>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-1.5">
                        <Link
                            href="/settings"
                            className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] text-slate-400 hover:text-white rounded-md hover:bg-slate-800/50 transition-colors"
                        >
                            <Settings className="w-3 h-3" /> Settings
                        </Link>
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] text-amber-400/80 hover:text-amber-300 rounded-md hover:bg-amber-500/5 transition-colors"
                            >
                                <Shield className="w-3 h-3" /> Admin
                            </Link>
                        )}
                    </div>
                </div>
            ) : (
                <Link
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        // Trigger auth modal from parent
                        document.dispatchEvent(new CustomEvent('open-auth-modal'));
                    }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 transition-all text-blue-400 hover:text-blue-300"
                >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign In</span>
                </Link>
            )}
        </div>
    );
}
