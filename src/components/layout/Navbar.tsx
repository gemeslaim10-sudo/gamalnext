'use client';

import { useState, useEffect } from 'react';
import { Terminal, Menu, X } from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import NotificationsDropdown from './NotificationsDropdown';
import { usePathname } from 'next/navigation';
import { useContent } from '@/hooks/useContent';
import Image from 'next/image';

// Extracted Sub-components
import MegaMenu from '../navbar/MegaMenu';
import UserMenu from '../navbar/UserMenu';
import MobileMenu from '../navbar/MobileMenu';
import { useBrandingContext } from '../providers/BrandingProvider';

export default function Navbar({ isStatic = false }: { isStatic?: boolean }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const initialBranding = useBrandingContext();
    const { data: branding } = useContent("site_content", "settings", initialBranding);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        // Listen for sidebar auth modal trigger
        const handleOpenAuth = () => setIsAuthModalOpen(true);
        document.addEventListener('open-auth-modal', handleOpenAuth);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('open-auth-modal', handleOpenAuth);
        };
    }, []);

    const isActive = (path: string) => pathname === path;

    return (
        <>
            {/* Spacer is only needed if the navbar is fixed */}
            {!isStatic && <div className="h-14 w-full shrink-0"></div>}

            <nav className={`${isStatic ? 'relative' : 'fixed top-0 left-0'} w-full z-[90] transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'glass border-b-0 shadow-2xl' : 'bg-[#030712] border-b border-white/5'}`}>
                {/* Active Gradient Border Bottom */}
                <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 cursor-pointer z-50 group no-scroll-spy">
                            {branding?.siteLogo ? (
                                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all">
                                    <Image src={branding.siteLogo} alt="Logo" fill className="object-cover" />
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
                        <div className="hidden lg:block">
                            <div className="ml-10 flex items-center gap-6">
                                <Link href="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-400' : 'text-white hover:text-blue-400'}`}>Home</Link>

                                {/* MEGA MENU COMPONENT */}
                                <MegaMenu />

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

                        {/* Mobile Button and Notifications */}
                        <div className="flex lg:hidden items-center gap-4 z-50">
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

                {/* MOBILE MENU COMPONENT */}
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

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
}
