'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    PanelLeftOpen, PanelLeftClose, User, LogIn, Shield, Settings, Bot,
    FileText, Briefcase, Wrench, Star, ArrowRight, Sparkles, Home,
    BookOpen, FolderOpen, Phone, Newspaper
} from 'lucide-react';

// ─── Admin Emails ─────────────────────────────────────────────────────────────
const ADMIN_EMAILS = ["montasrrm@gmail.com", "gemeslaim10@gmail.com"];

// ─── Types ────────────────────────────────────────────────────────────────────
type SidebarArticle = { id: string; title: string };
type SidebarProject = { id: string; title: string; imageUrl?: string };
type SidebarTool = { name: string; href: string; icon: string };

// ─── Static Tools Data ────────────────────────────────────────────────────────
const ALL_TOOLS: SidebarTool[] = [
    { name: "QR Code Generator", href: "/tools/utils/qr-generator", icon: "📱" },
    { name: "Unit Converter", href: "/tools/utils/unit-converter", icon: "📐" },
    { name: "Age Calculator", href: "/tools/utils/age-calculator", icon: "📅" },
    { name: "Stopwatch", href: "/tools/utils/stopwatch", icon: "⏱️" },
    { name: "Password Generator", href: "/tools/security/password-generator", icon: "🔐" },
];

// ─── Shuffle Helper ───────────────────────────────────────────────────────────
function shuffleAndPick<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// ─── Excluded Paths (pages that have their own sidebar) ───────────────────────
const EXCLUDED_PREFIXES = ['/admin', '/tools'];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GlobalSidebar() {
    const pathname = usePathname();
    const { user, loading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [articles, setArticles] = useState<SidebarArticle[]>([]);
    const [projects, setProjects] = useState<SidebarProject[]>([]);
    const [mounted, setMounted] = useState(false);

    // Check if we're on a large screen
    const isLargeScreen = () => typeof window !== 'undefined' && window.innerWidth >= 1024;

    const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

    // Don't render on admin/tools pages (they have their own sidebars)
    const shouldHide = EXCLUDED_PREFIXES.some(p => pathname.startsWith(p));

    // ── Init: Open on large screens + listen for resize ─────────────────────
    useEffect(() => {
        setMounted(true);
        if (isLargeScreen()) setIsOpen(true);

        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Fetch Data on Mount (via API to avoid permission issues) ──────────────
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/sidebar-data');
                if (!res.ok) return;
                const data = await res.json();
                setArticles(data.articles || []);
                setProjects(data.projects || []);
            } catch (err) {
                // Silent fail - sidebar still works without suggestions
            }
        };
        fetchData();
    }, []);

    // ── Random Picks (re-shuffle on page change) ─────────────────────────────
    const randomArticles = useMemo(
        () => shuffleAndPick(articles, 3),
        [articles, pathname]
    );
    const randomProjects = useMemo(
        () => shuffleAndPick(projects, 3),
        [projects, pathname]
    );
    const randomTools = useMemo(
        () => shuffleAndPick(ALL_TOOLS, 3),
        [pathname]
    );

    // ── Context-Aware Title ──────────────────────────────────────────────────
    const contextInfo = useMemo(() => {
        if (pathname === '/') return { title: 'Home', icon: Home };
        if (pathname.startsWith('/articles')) return { title: 'Blog', icon: Newspaper };
        if (pathname.startsWith('/projects')) return { title: 'Portfolio', icon: FolderOpen };
        if (pathname.startsWith('/skills')) return { title: 'Skills', icon: Sparkles };
        if (pathname.startsWith('/contact')) return { title: 'Contact', icon: Phone };
        if (pathname.startsWith('/experience')) return { title: 'Experience', icon: Briefcase };
        if (pathname.startsWith('/settings')) return { title: 'Settings', icon: Settings };
        if (pathname.startsWith('/write')) return { title: 'Write', icon: FileText };
        return { title: 'Explore', icon: BookOpen };
    }, [pathname]);

    // Close sidebar on navigation (mobile only)
    useEffect(() => {
        if (!isLargeScreen()) {
            setIsOpen(false);
        }
    }, [pathname]);

    if (shouldHide || !mounted) return null;

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
                    {/* ── User Section ────────────────────────────────────── */}
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

                    {/* ── Navigation ──────────────────────────────────────── */}
                    <div className="px-4 py-3 border-b border-slate-800/30">
                        <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em] mb-2 px-1">Navigate</h4>
                        <nav className="space-y-0.5">
                            {[
                                { name: 'Home', href: '/', icon: Home },
                                { name: 'Portfolio', href: '/projects', icon: FolderOpen },
                                { name: 'Blog', href: '/articles', icon: Newspaper },
                                { name: 'Tools', href: '/tools', icon: Wrench },
                                { name: 'Contact', href: '/contact', icon: Phone },
                            ].map(item => {
                                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                                            flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all
                                            ${isActive
                                                ? 'bg-blue-500/10 text-blue-400'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                                            }
                                        `}
                                    >
                                        <item.icon className="w-3.5 h-3.5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

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

                    {/* ── Suggested Articles ──────────────────────────────── */}
                    {randomArticles.length > 0 && (
                        <div className="px-4 py-3 border-b border-slate-800/30">
                            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em] mb-2.5 px-1 flex items-center gap-1.5">
                                <FileText className="w-3 h-3" /> Articles
                            </h4>
                            <div className="space-y-1">
                                {randomArticles.map(a => (
                                    <Link
                                        key={a.id}
                                        href={`/articles/${a.id}`}
                                        className="block px-2.5 py-2 rounded-md hover:bg-slate-800/40 transition-colors group"
                                    >
                                        <p className="text-xs text-slate-300 group-hover:text-white line-clamp-2 leading-relaxed transition-colors">
                                            {a.title}
                                        </p>
                                    </Link>
                                ))}
                                <Link
                                    href="/articles"
                                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-blue-400/70 hover:text-blue-400 transition-colors"
                                >
                                    View all <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* ── Suggested Projects ──────────────────────────────── */}
                    {randomProjects.length > 0 && (
                        <div className="px-4 py-3 border-b border-slate-800/30">
                            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em] mb-2.5 px-1 flex items-center gap-1.5">
                                <Briefcase className="w-3 h-3" /> Projects
                            </h4>
                            <div className="space-y-1">
                                {randomProjects.map(p => (
                                    <Link
                                        key={p.id}
                                        href={`/projects/${(p as any).slug || p.id}`}
                                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-slate-800/40 transition-colors group"
                                    >
                                        {p.imageUrl ? (
                                            <Image
                                                src={p.imageUrl}
                                                alt={p.title}
                                                width={28}
                                                height={28}
                                                className="rounded-md object-cover w-7 h-7 shrink-0 ring-1 ring-slate-700"
                                            />
                                        ) : (
                                            <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center shrink-0">
                                                <FolderOpen className="w-3 h-3 text-slate-500" />
                                            </div>
                                        )}
                                        <p className="text-xs text-slate-300 group-hover:text-white line-clamp-1 transition-colors">
                                            {p.title}
                                        </p>
                                    </Link>
                                ))}
                                <Link
                                    href="/projects"
                                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-blue-400/70 hover:text-blue-400 transition-colors"
                                >
                                    View all <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* ── Suggested Tools ──────────────────────────────────── */}
                    <div className="px-4 py-3 border-b border-slate-800/30">
                        <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em] mb-2.5 px-1 flex items-center gap-1.5">
                            <Wrench className="w-3 h-3" /> Quick Tools
                        </h4>
                        <div className="space-y-1">
                            {randomTools.map(t => (
                                <Link
                                    key={t.href}
                                    href={t.href}
                                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-slate-800/40 transition-colors group"
                                >
                                    <span className="text-sm">{t.icon}</span>
                                    <p className="text-xs text-slate-300 group-hover:text-white transition-colors">
                                        {t.name}
                                    </p>
                                </Link>
                            ))}
                            <Link
                                href="/tools"
                                className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-blue-400/70 hover:text-blue-400 transition-colors"
                            >
                                All tools <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>

                    {/* ── Reviews CTA ──────────────────────────────────────── */}
                    <div className="px-4 py-3">
                        <Link
                            href="/contact"
                            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/30 transition-all group"
                        >
                            <Star className="w-4 h-4 text-amber-400/70 group-hover:text-amber-400" />
                            <div>
                                <p className="text-xs text-slate-300 font-medium">Need a project?</p>
                                <p className="text-[10px] text-slate-500">Get in touch today</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </aside>
            
            {/* ── Placeholder for Layout Push (Desktop) ──────────────────── */}
            <div className={`hidden lg:block shrink-0 transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'}`} />
        </>
    );
}
