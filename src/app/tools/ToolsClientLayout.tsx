'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Search, Wrench, Menu, X,
    Video, Mic, Languages, Coins, Table,
    History, QrCode, Lock, ChevronLeft
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const pathname = usePathname();

    const categories = [
        { name: "All Tools", icon: Wrench, href: "/tools" },
        { name: "Media Tools", icon: Video, href: "/tools/media" },
        { name: "Audio & AI", icon: Mic, href: "/tools/audio" },
        { name: "Translation", icon: Languages, href: "/tools/translation" },
        { name: "Finance", icon: Coins, href: "/tools/finance" },
        { name: "Data & Tables", icon: Table, href: "/tools/data" },
        { name: "Utilities", icon: QrCode, href: "/tools/utils" },
        { name: "Security", icon: Lock, href: "/tools/security" },
    ];

    const userLinks = [
        { name: "My History", icon: History, href: "/tools/history" },
    ];

    const filteredCategories = searchQuery
        ? categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : categories;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
            <Navbar />

            <div className="flex flex-1 pt-20 relative">
                {/* Mobile Sidebar Toggle */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 p-3.5 rounded-full shadow-xl text-white transition-all active:scale-95"
                    aria-label="Toggle sidebar"
                >
                    {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    dir="ltr"
                    className={`
                        fixed lg:sticky top-20 h-[calc(100vh-5rem)] w-64 
                        bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 
                        transition-all duration-300 z-40 overflow-y-auto
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        left-0 flex flex-col
                    `}
                >
                    {/* Sidebar Header */}
                    <div className="p-5 border-b border-slate-800/80">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-600/15 flex items-center justify-center">
                                <Wrench className="w-4 h-4 text-blue-400" />
                            </div>
                            <h2 className="text-sm font-bold text-white tracking-wide uppercase">Toolbox</h2>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tools..."
                                className="w-full bg-slate-950/80 border border-slate-700/60 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex-1 p-4">
                        <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3 px-2">Categories</h3>
                        <nav className="space-y-0.5">
                            {filteredCategories.map((cat) => {
                                const Icon = cat.icon;
                                const isExactMatch = pathname === cat.href;
                                const isActive = isExactMatch || (cat.href !== '/tools' && pathname.startsWith(cat.href));
                                return (
                                    <Link
                                        key={cat.href}
                                        href={cat.href}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`
                                            group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                                            ${isActive
                                                ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 pl-[10px]'
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                            }
                                        `}
                                    >
                                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                                        <span className="truncate">{cat.name}</span>
                                        {isActive && <ChevronLeft className="w-3 h-3 ml-auto text-blue-500/60" />}
                                    </Link>
                                );
                            })}
                        </nav>

                        {filteredCategories.length === 0 && (
                            <p className="text-xs text-slate-500 text-center py-6">No tools found</p>
                        )}
                    </div>

                    {/* User Section */}
                    <div className="p-4 border-t border-slate-800/80">
                        <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3 px-2">Personal</h3>
                        <nav className="space-y-0.5">
                            {userLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`
                                            group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                                            ${isActive
                                                ? 'bg-purple-600/10 text-purple-400 border-l-2 border-purple-500 pl-[10px]'
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                            }
                                        `}
                                    >
                                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                                        <span className="truncate">{link.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
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
