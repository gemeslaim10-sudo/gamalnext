'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Search, Wrench, Menu, X,
    Video, Mic, Languages, Coins, Table,
    LayoutDashboard, History, QrCode, Lock
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    const categories = [
        { name: "جميع الأدوات", icon: Wrench, href: "/tools" },
        { name: "أدوات ميديا", icon: Video, href: "/tools/media" },
        { name: "صوتيات & AI", icon: Mic, href: "/tools/audio" },
        { name: "ترجمة & لغات", icon: Languages, href: "/tools/translation" },
        { name: "مالية & عملات", icon: Coins, href: "/tools/finance" },
        { name: "بيانات & جداول", icon: Table, href: "/tools/data" },
        { name: "أدوات عامة", icon: QrCode, href: "/tools/utils" },
        { name: "حماية وأمان", icon: Lock, href: "/tools/security" },
    ];

    const userLinks = [
        { name: "سجل ملفاتي", icon: History, href: "/tools/history" },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
            <Navbar />

            <div className="flex flex-1 pt-20 relative">
                {/* Mobile Sidebar Toggle */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden fixed bottom-4 right-4 z-50 bg-blue-600 p-3 rounded-full shadow-lg text-white"
                >
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>

                {/* Sidebar */}
                <aside className={`
                    fixed lg:sticky top-20 h-[calc(100vh-5rem)] w-64 bg-slate-900 border-l border-slate-800 
                    transition-transform duration-300 z-40 overflow-y-auto
                    ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                    right-0 lg:right-auto lg:order-last
                `}>
                    <div className="p-6 space-y-8">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="بحث عن أداة..."
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pr-10 pl-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 px-2">التصنيفات</h3>
                            <div className="space-y-1">
                                {categories.map((cat) => {
                                    const Icon = cat.icon;
                                    const isActive = pathname === cat.href || (cat.href !== '/tools' && pathname.startsWith(cat.href));
                                    return (
                                        <Link
                                            key={cat.href}
                                            href={cat.href}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                                            {cat.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* User Tools */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 px-2">مساحتي</h3>
                            <div className="space-y-1">
                                {userLinks.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-purple-600/10 text-purple-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
                                            {link.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 w-full p-4 md:p-8 overflow-x-hidden">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            <div className="z-50 relative">
                <Footer />
            </div>
        </div>
    );
}
