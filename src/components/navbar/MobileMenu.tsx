'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Terminal, Zap, Briefcase, FolderGit2, FileText, MessageSquare } from 'lucide-react';

interface MobileMenuProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    user: any;
    logout: () => void;
    isActive: (path: string) => boolean;
    setIsAuthModalOpen: (open: boolean) => void;
}

export default function MobileMenu({ isOpen, setIsOpen, user, logout, isActive, setIsAuthModalOpen }: MobileMenuProps) {
    if (!isOpen) return null;

    return (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 absolute w-full top-20 left-0 transition-all duration-300 shadow-xl z-40">
            <div className="px-4 py-6 space-y-3">
                {/* Mobile Nav Links */}
                <div className="space-y-1 text-right">
                    <Link href="/" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl text-base font-bold transition-all flex items-center justify-end gap-3 ${isActive('/') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}>
                        الرئيسية
                        <span className="bg-slate-800 p-1.5 rounded-lg text-blue-400"><Terminal className="w-4 h-4" /></span>
                    </Link>
                    <Link href="/skills" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl text-base font-bold transition-all flex items-center justify-end gap-3 ${isActive('/skills') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}>
                        التخصصات
                        <span className="bg-slate-800 p-1.5 rounded-lg text-yellow-400"><Zap className="w-4 h-4" /></span>
                    </Link>
                    <Link href="/experience" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl text-base font-bold transition-all flex items-center justify-end gap-3 ${isActive('/experience') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}>
                        الخبرات
                        <span className="bg-slate-800 p-1.5 rounded-lg text-purple-400"><Briefcase className="w-4 h-4" /></span>
                    </Link>
                    <Link href="/projects" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl text-base font-bold transition-all flex items-center justify-end gap-3 ${isActive('/projects') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}>
                        المشاريع
                        <span className="bg-slate-800 p-1.5 rounded-lg text-green-400"><FolderGit2 className="w-4 h-4" /></span>
                    </Link>
                    <Link href="/articles" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl text-base font-bold transition-all flex items-center justify-end gap-3 ${isActive('/articles') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}>
                        المدونة
                        <span className="bg-slate-800 p-1.5 rounded-lg text-pink-400"><FileText className="w-4 h-4" /></span>
                    </Link>
                    <Link href="/contact" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl text-base font-bold transition-all flex items-center justify-end gap-3 ${isActive('/contact') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}>
                        اتصل بنا
                        <span className="bg-slate-800 p-1.5 rounded-lg text-cyan-400"><MessageSquare className="w-4 h-4" /></span>
                    </Link>
                </div>

                <div className="h-px bg-slate-800/50 my-4 mx-2"></div>

                {/* User Section Mobile */}
                {user ? (
                    <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50 text-right">
                        <div className="flex items-center justify-end gap-4 mb-4 pb-4 border-b border-slate-700/50">
                            <div>
                                <div className="text-white font-bold">{user.displayName || user.email}</div>
                                <div className="text-xs text-slate-400">عضوية مفعلة</div>
                            </div>
                            <Image src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} width={48} height={48} className="w-12 h-12 rounded-full border-2 border-blue-500/30" alt={user.displayName || "User"} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Link href={`/users/${user.uid}`} onClick={() => setIsOpen(false)} className="text-center py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 hover:text-white transition-colors">ملفي الشخصي</Link>
                            <Link href="/settings" onClick={() => setIsOpen(false)} className="text-center py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 hover:text-white transition-colors">الإعدادات</Link>
                        </div>
                        <button
                            onClick={() => { logout(); setIsOpen(false); }}
                            className="w-full mt-2 text-center py-2.5 rounded-xl bg-red-500/10 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-colors border border-red-500/20"
                        >
                            تسجيل الخروج
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => { setIsAuthModalOpen(true); setIsOpen(false); }}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all transform hover:scale-[1.02]"
                    >
                        الدخول للنظام / تسجيل جديد
                    </button>
                )}
            </div>
        </div>
    );
}
