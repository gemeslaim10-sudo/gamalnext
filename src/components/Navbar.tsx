'use client';

import { useState, useEffect } from 'react';
import { Terminal, Menu, UserCircle, LogOut, ChevronDown, Zap, Briefcase, FolderGit2, X, FileText, MessageSquare } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import NotificationsDropdown from './NotificationsDropdown';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { user, logout } = useAuth();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => pathname === path;

    return (
        <>
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'glass border-b-0 shadow-2xl' : 'bg-transparent border-b border-transparent'}`}>
                {/* Active Gradient Border Bottom */}
                <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 cursor-pointer z-50 group no-scroll-spy">
                            <div className="bg-gradient-to-tr from-blue-500 to-cyan-400 p-2 rounded-lg group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all">
                                <Terminal className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <span className="font-bold text-lg sm:text-2xl tracking-wider text-white">
                                GAMAL<span className="text-blue-400">.DEV</span>
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden lg:block">
                            <div className="ml-10 flex items-center gap-6">
                                <Link href="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-400' : 'text-white hover:text-blue-400'}`}>الرئيسية</Link>
                                {/* Who We Are Dropdown */}
                                <div className="relative group/menu">
                                    <button className="flex items-center gap-1 text-sm font-medium text-white hover:text-blue-400 transition-colors py-4">
                                        التعريف بنا <ChevronDown className="w-4 h-4 group-hover/menu:rotate-180 transition-transform" />
                                    </button>

                                    {/* Mega Menu Dropdown */}
                                    <div className="absolute top-14 right-0 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all transform translate-y-2 group-hover/menu:translate-y-0 z-50 overflow-hidden">
                                        <div className="p-4 grid gap-2">
                                            <Link href="/skills" className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800 transition-colors group/item">
                                                <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400 group-hover/item:text-blue-300 group-hover/item:bg-blue-500/20 transition-colors">
                                                    <Zap className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-sm">مجالات التخصص</h4>
                                                    <p className="text-slate-500 text-xs mt-0.5">التطوير الرقمي و SEO</p>
                                                </div>
                                            </Link>

                                            <Link href="/experience" className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800 transition-colors group/item">
                                                <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400 group-hover/item:text-purple-300 group-hover/item:bg-purple-500/20 transition-colors">
                                                    <Briefcase className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-sm">السجل المهني</h4>
                                                    <p className="text-slate-500 text-xs mt-0.5">مسيرتي المهنية والشركات</p>
                                                </div>
                                            </Link>

                                            <Link href="/projects" className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800 transition-colors group/item">
                                                <div className="bg-green-500/10 p-2 rounded-lg text-green-400 group-hover/item:text-green-300 group-hover/item:bg-green-500/20 transition-colors">
                                                    <FolderGit2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-sm">سجل المشاريع</h4>
                                                    <p className="text-slate-500 text-xs mt-0.5">نخبة المشاريع المنجزة</p>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="bg-slate-950/50 p-3 text-center border-t border-slate-800">
                                            <Link href="/contact" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                                لبدء تعاون مثمر، يرجى التواصل &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <Link href="/articles" className={`text-sm font-medium transition-colors ${isActive('/articles') ? 'text-blue-400' : 'text-white hover:text-blue-400'}`}>المدونة التقنية</Link>
                                <Link href="/contact" className={`px-4 py-2 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-600/20 hover:bg-blue-600 hover:text-white transition-all text-sm font-bold`}>اتصل بنا</Link>

                                <div className="h-6 w-px bg-slate-800 mx-2"></div>

                                {/* Notifications */}
                                <NotificationsDropdown />

                                {/* Auth Button */}
                                {user ? (
                                    <div className="relative group/user z-50">
                                        <button className="flex items-center gap-3 border border-slate-700 bg-slate-800/50 rounded-full pl-2 pr-4 py-1.5 hover:bg-slate-800 transition-all">
                                            {user.photoURL ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-slate-600" />
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
                                ) : (
                                    <button
                                        onClick={() => setIsAuthModalOpen(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        الدخول للنظام
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mobile Button and Notifications */}
                        <div className="flex lg:hidden items-center gap-4 z-50">
                            {/* Show notifications on mobile too */}
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

                {/* Mobile Menu */}
                <div
                    className={`lg:hidden bg-slate-900 border-b border-slate-800 absolute w-full top-20 left-0 transition-all duration-300 shadow-xl z-40 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
                >
                    <div className="px-4 py-6 space-y-3">
                        {/* Mobile Nav Links */}
                        <div className="space-y-1">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl text-base font-bold transition-all flex items-center gap-3 ${isActive('/') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}>
                                <span className="bg-slate-800 p-1.5 rounded-lg text-blue-400"><Terminal className="w-4 h-4" /></span>
                                الرئيسية
                            </Link>
                            <Link href="/skills" onClick={() => setIsMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl text-base font-bold transition-all flex items-center gap-3 ${isActive('/skills') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}>
                                <span className="bg-slate-800 p-1.5 rounded-lg text-yellow-400"><Zap className="w-4 h-4" /></span>
                                التخصصات
                            </Link>
                            <Link href="/experience" onClick={() => setIsMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl text-base font-bold transition-all flex items-center gap-3 ${isActive('/experience') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}>
                                <span className="bg-slate-800 p-1.5 rounded-lg text-purple-400"><Briefcase className="w-4 h-4" /></span>
                                الخبرات
                            </Link>
                            <Link href="/projects" onClick={() => setIsMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl text-base font-bold transition-all flex items-center gap-3 ${isActive('/projects') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}>
                                <span className="bg-slate-800 p-1.5 rounded-lg text-green-400"><FolderGit2 className="w-4 h-4" /></span>
                                المشاريع
                            </Link>
                            <Link href="/articles" onClick={() => setIsMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl text-base font-bold transition-all flex items-center gap-3 ${isActive('/articles') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}>
                                <span className="bg-slate-800 p-1.5 rounded-lg text-pink-400"><FileText className="w-4 h-4" /></span>
                                المدونة
                            </Link>
                            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl text-base font-bold transition-all flex items-center gap-3 ${isActive('/contact') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}>
                                <span className="bg-slate-800 p-1.5 rounded-lg text-cyan-400"><MessageSquare className="w-4 h-4" /></span>
                                اتصل بنا
                            </Link>
                        </div>

                        <div className="h-px bg-slate-800/50 my-4 mx-2"></div>

                        {/* User Section Mobile */}
                        {user ? (
                            <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50">
                                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-700/50">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} className="w-12 h-12 rounded-full border-2 border-blue-500/30" alt={user.displayName || "User"} />
                                    <div>
                                        <div className="text-white font-bold">{user.displayName || user.email}</div>
                                        <div className="text-xs text-slate-400">عضوية مفعلة</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Link href={`/users/${user.uid}`} onClick={() => setIsMobileMenuOpen(false)} className="text-center py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 hover:text-white transition-colors">ملفي الشخصي</Link>
                                    <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 hover:text-white transition-colors">الإعدادات</Link>
                                </div>
                                <button
                                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                    className="w-full mt-2 text-center py-2.5 rounded-xl bg-red-500/10 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-colors border border-red-500/20"
                                >
                                    تسجيل الخروج
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all transform hover:scale-[1.02]"
                            >
                                الدخول للنظام / تسجيل جديد
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
}
