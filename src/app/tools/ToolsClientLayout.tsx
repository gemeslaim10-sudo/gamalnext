'use client';

import { useState } from 'react';
import {
    Wrench, Menu, X,
    Video, Mic, Languages, Coins, Table,
    History, QrCode, Lock
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ToolsSidebar } from './components/ToolsSidebar';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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

                <ToolsSidebar 
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filteredCategories={filteredCategories}
                    userLinks={userLinks}
                    WrenchIcon={Wrench}
                />

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
