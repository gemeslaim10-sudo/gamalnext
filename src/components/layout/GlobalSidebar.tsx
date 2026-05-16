'use client';

import { PanelLeftOpen, PanelLeftClose, Bot, Sparkles } from 'lucide-react';

// ── Sidebar Sub-Components ────────────────────────────────────────────────────
import SidebarUserSection from './sidebar/SidebarUserSection';
import SidebarNavigation from './sidebar/SidebarNavigation';
import { SidebarArticles, SidebarProjects, SidebarTools, SidebarCTA } from './sidebar/SidebarSections';
import { useGlobalSidebar } from './useGlobalSidebar';

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GlobalSidebar() {
    const {
        isOpen, setIsOpen, mounted, shouldHide, isLargeScreen,
        randomArticles, randomProjects, randomTools, contextInfo
    } = useGlobalSidebar();

    if (shouldHide) return null;

    // Before mount, render the same placeholder the layout expects to prevent hydration mismatch
    if (!mounted) {
        return <div className="hidden lg:block shrink-0 w-0" aria-hidden="true" />;
    }

    const ContextIcon = contextInfo.icon;

    return (
        <>
            {/* ── Toggle Button (Fixed) ──────────────────────────────────── */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    fixed top-20 z-40 p-2 rounded-r-lg
                    bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 border-l-0
                    text-slate-400 hover:text-white hover:bg-slate-800
                    transition-all duration-300 shadow-lg
                    ${isOpen ? 'left-[256px]' : 'left-0'}
                `}
                aria-label="Toggle sidebar"
            >
                {isOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>

            {/* ── Overlay (Mobile) ───────────────────────────────────────── */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* ── Sidebar Panel ──────────────────────────────────────────── */}
            <aside
                dir="ltr"
                className={`
                    fixed top-0 left-0 h-full w-64 z-40
                    bg-slate-950/95 backdrop-blur-2xl
                    border-r border-slate-800/60
                    transition-transform duration-300 ease-out
                    flex flex-col
                    pt-16
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="px-4 py-4 border-b border-slate-800/50">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <ContextIcon className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <span className="text-sm font-bold text-white uppercase tracking-wider">
                            {contextInfo.title}
                        </span>
                    </div>
                </div>

                {/* ── Scrollable Content ──────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll">
                    <SidebarUserSection />
                    <SidebarNavigation />

                    {/* ── AI Chat CTA ─────────────────────────────────────── */}
                    <div className="px-4 py-3 border-b border-slate-800/30">
                        <button
                            onClick={() => {
                                if (!isLargeScreen()) setIsOpen(false);
                                document.dispatchEvent(new CustomEvent('open-chat-widget'));
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all text-purple-300 hover:text-purple-200 group"
                        >
                            <Bot className="w-4 h-4 group-hover:animate-pulse" />
                            <span className="text-xs font-medium">AI Assistant</span>
                            <Sparkles className="w-3 h-3 ml-auto opacity-50" />
                        </button>
                    </div>

                    <SidebarArticles articles={randomArticles} />
                    <SidebarProjects projects={randomProjects} />
                    <SidebarTools tools={randomTools} />
                    <SidebarCTA />
                </div>
            </aside>
            
            {/* ── Placeholder for Layout Push (Desktop) ──────────────────── */}
            <div className={`hidden lg:block shrink-0 transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'}`} />
        </>
    );
}
