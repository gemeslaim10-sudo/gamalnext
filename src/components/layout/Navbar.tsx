'use client';

import { Terminal, Menu, X } from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import Link from 'next/link';
import NotificationsDropdown from './NotificationsDropdown';
import Image from 'next/image';

// Extracted Sub-components
import MegaMenu from '../navbar/MegaMenu';
import UserMenu from '../navbar/UserMenu';
import MobileMenu from '../navbar/MobileMenu';

// Hook
import { useNavbar } from './hooks/useNavbar';

export default function Navbar({ isStatic = false }: { isStatic?: boolean }) {
    const {
        isScrolled,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        user,
        logout,
        isActive,
        branding
    } = useNavbar();

    return (
        <>
            {/* Spacer is only needed if the navbar is fixed */}
            {!isStatic && <div className="h-14 w-full shrink-0"></div>}

            {/* ── NORMAL NAVBAR (visible at top) ──────────────────── */}
            <nav className={`${isStatic ? 'relative' : 'fixed top-0 left-0'} w-full z-[90] transition-all duration-500 ${isScrolled ? 'opacity-0 pointer-events-none -translate-y-full' : 'bg-[#030712] border-b border-white/5'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 cursor-pointer z-50 group no-scroll-spy">
                            {branding?.siteLogo ? (
                                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all">
                                    <Image src={branding.siteLogo} alt="Logo" fill sizes="(max-width: 640px) 32px, 40px" className="object-cover" />
                                </div>
                            ) : (
                                <div className="bg-gradient-to-tr from-blue-500 to-cyan-400 p-1 rounded-lg group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all">
                                    <Terminal className="text-white w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                            )}
                            <span className="font-bold text-sm sm:text-lg tracking-wider text-white">
                                {branding?.siteName ? (
                                    branding.siteName
                                ) : (
                                    <>GAMAL<span className="text-blue-400">TECH</span></>
                                )}
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden xl:block">
                            <div className="ml-10 flex items-center gap-6">
                                <Link href="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-400' : 'text-white hover:text-blue-400'}`}>Home</Link>

                                {/* MEGA MENU COMPONENT */}
                                <MegaMenu />

                                <Link href="/profile" className={`text-sm font-medium transition-colors ${isActive('/profile') ? 'text-blue-400' : 'text-white hover:text-blue-400'}`}>Profile</Link>
                                <Link href="/articles" className={`text-sm font-medium transition-colors ${isActive('/articles') ? 'text-blue-400' : 'text-white hover:text-blue-400'}`}>Blog</Link>

                                <Link href="/tools" className={`text-sm font-medium transition-colors relative group ${isActive('/tools') ? 'text-blue-400' : 'text-white hover:text-blue-400'}`}>
                                    Tools
                                    <span className="absolute -top-3 -right-3 flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                                    </span>
                                </Link>
                                <Link href="https://packages.gamaltech.info" target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-colors text-white hover:text-blue-400">Pricing</Link>
                                <Link href="/contact" className="px-4 py-2 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-600/20 hover:bg-blue-600 hover:text-white transition-all text-sm font-bold">Contact</Link>

                                <div className="h-6 w-px bg-slate-800 mx-2"></div>

                                {/* Notifications */}
                                <NotificationsDropdown />

                                {/* USER MENU COMPONENT */}
                                {user ? (
                                    <UserMenu user={user} logout={logout} />
                                ) : (
                                    <button
                                        onClick={() => setIsAuthModalOpen(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        Login
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mobile Button */}
                        <div className="flex xl:hidden items-center gap-4 z-50">
                            <NotificationsDropdown />
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-slate-200 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors focus:outline-none"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* FULL MOBILE MENU — small screens only */}
                <MobileMenu
                    isOpen={isMobileMenuOpen}
                    setIsOpen={setIsMobileMenuOpen}
                    user={user}
                    logout={logout}
                    isActive={isActive}
                    setIsAuthModalOpen={setIsAuthModalOpen}
                    branding={branding}
                />
            </nav>

            {/* ── FLOATING NAV BAR (visible when scrolled) ──────── */}
            {isScrolled && (
                <div className="fixed top-4 right-4 z-[91] flex items-center gap-1">
                    {/* Horizontal links — slide out to the left */}
                    {isMobileMenuOpen && (
                        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl px-2 py-1.5 shadow-2xl animate-in slide-in-from-right-4 duration-300">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${isActive('/') ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>Home</Link>
                            <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${isActive('/profile') ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>Profile</Link>
                            <Link href="/portfolio" onClick={() => setIsMobileMenuOpen(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${isActive('/portfolio') ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>Portfolio</Link>
                            <Link href="/articles" onClick={() => setIsMobileMenuOpen(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${isActive('/articles') ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>Blog</Link>
                            <Link href="/tools" onClick={() => setIsMobileMenuOpen(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${isActive('/tools') ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>Tools</Link>
                            <Link href="https://packages.gamaltech.info" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap text-slate-300 hover:text-white hover:bg-white/5 transition-all">Pricing</Link>
                            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap text-blue-400 bg-blue-600/10 border border-blue-600/20 hover:bg-blue-600 hover:text-white transition-all">Contact</Link>
                        </div>
                    )}

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-lg shrink-0"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            )}

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
}
