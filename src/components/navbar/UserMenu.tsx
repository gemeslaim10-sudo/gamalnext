'use client';

import { UserCircle, LogOut } from 'lucide-react';
import Image from 'next/image';

interface UserMenuProps {
    user: any;
    logout: () => void;
}

export default function UserMenu({ user, logout }: UserMenuProps) {
    return (
        <div className="relative group/user z-50">
            <button className="flex items-center gap-3 border border-slate-700 bg-slate-800/50 rounded-full pl-2 pr-4 py-1.5 hover:bg-slate-800 transition-all">
                {user.photoURL ? (
                    <Image src={user.photoURL} alt="User" width={32} height={32} className="w-8 h-8 rounded-full border border-slate-600" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                        <UserCircle className="w-5 h-5 text-slate-400" />
                    </div>
                )}
                <span className="text-sm font-medium text-slate-300 max-w-[100px] truncate">{user.displayName || "User"}</span>
            </button>

            {/* Dropdown */}
            <div className="absolute left-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all transform translate-y-2 group-hover/user:translate-y-0 text-right">
                <a href={`/users/${user.uid}`} className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border-b border-slate-800">
                    ملفي الشخصي
                </a>
                <a href="/settings" className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border-b border-slate-800">
                    الإعدادات
                </a>
                <a href="/write" className="block px-4 py-3 text-sm text-blue-400 font-bold hover:bg-slate-800 hover:text-blue-300 transition-colors border-b border-slate-800">
                    كتابة مقال
                </a>
                <button
                    onClick={logout}
                    className="w-full text-right px-4 py-3 text-sm text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors flex items-center gap-2"
                >
                    <LogOut className="w-4 h-4" /> تسجيل الخروج
                </button>
            </div>
        </div>
    );
}
