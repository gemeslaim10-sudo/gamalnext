'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Terminal, Zap, FolderGit2, FileText, MessageSquare, Package, User, Settings, LogOut } from 'lucide-react';

interface MobileMenuProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    user: any;
    logout: () => void;
    isActive: (path: string) => boolean;
    setIsAuthModalOpen: (open: boolean) => void;
    branding?: any;
}

export default function MobileMenu({ isOpen, setIsOpen, user, logout, isActive, setIsAuthModalOpen, branding }: MobileMenuProps) {
    if (!isOpen) return null;

    const navItems = [
        { name: 'Home', path: '/', icon: Terminal, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { name: 'Specialties', path: '/skills', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        { name: 'Projects', path: '/projects', icon: FolderGit2, color: 'text-green-400', bg: 'bg-green-500/10' },
        { name: 'Blog', path: '/articles', icon: FileText, color: 'text-pink-400', bg: 'bg-pink-500/10' },
        { name: 'Tools', path: '/tools', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { name: 'Pricing', path: 'https://packages.gamaltech.info', icon: Package, color: 'text-orange-400', bg: 'bg-orange-500/10', external: true },
        { name: 'Contact', path: '/contact', icon: MessageSquare, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    ];

    return (
        <div className="lg:hidden fixed inset-0 top-14 bg-[#030712]/95 backdrop-blur-3xl z-40 overflow-y-auto overflow-x-hidden border-t border-white/5 flex flex-col animate-in slide-in-from-top-2 duration-300">
            <div className="flex-1 px-4 py-8 flex flex-col gap-6">
                
                {/* User Section (Moved to top for quick access) */}
                {user ? (
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 shadow-2xl flex flex-col gap-5">
                        <div className="flex items-center gap-4">
                            <Image 
                                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                                width={56} 
                                height={56} 
                                className="w-14 h-14 rounded-full border-2 border-blue-500/30 object-cover shadow-lg" 
                                alt={user.displayName || "User"} 
                            />
                            <div>
                                <div className="text-white font-bold text-lg leading-tight">{user.displayName || user.email}</div>
                                <div className="text-blue-400 text-sm font-medium">Active Member</div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link href={`/users/${user.uid}`} onClick={() => setIsOpen(false)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-colors border border-white/5">
                                <User className="w-4 h-4" /> Profile
                            </Link>
                            <Link href="/settings" onClick={() => setIsOpen(false)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-colors border border-white/5">
                                <Settings className="w-4 h-4" /> Settings
                            </Link>
                        </div>
                        <button
                            onClick={() => { logout(); setIsOpen(false); }}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-colors border border-red-500/20"
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => { setIsAuthModalOpen(true); setIsOpen(false); }}
                        className="w-full py-4 rounded-[1.5rem] bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    >
                        <User className="w-5 h-5" /> Login / Sign up
                    </button>
                )}

                <div className="h-px bg-white/5 w-full rounded-full my-1"></div>

                {/* Navigation Links - Bento Grid */}
                <div className="grid grid-cols-2 gap-3 pb-8">
                    {navItems.map((item, index) => {
                        const active = isActive(item.path);
                        const baseClasses = `flex flex-col items-center justify-center gap-3 p-5 rounded-[2rem] border transition-all duration-300 ${
                            active 
                            ? 'bg-blue-500/10 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                        }`;
                        const Icon = item.icon;

                        const content = (
                            <>
                                <div className={`p-3 rounded-2xl ${active ? item.bg : 'bg-white/5'} ${active ? item.color : 'text-slate-400'} shadow-inner`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className={`font-semibold text-sm ${active ? 'text-white' : 'text-slate-300'}`}>
                                    {item.name}
                                </span>
                            </>
                        );

                        if (item.external) {
                            return (
                                <a 
                                    key={item.name}
                                    href={item.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setIsOpen(false)}
                                    className={baseClasses}
                                >
                                    {content}
                                </a>
                            );
                        }

                        return (
                            <Link 
                                key={item.name}
                                href={item.path}
                                onClick={() => setIsOpen(false)}
                                className={baseClasses}
                            >
                                {content}
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-auto pb-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <Terminal className="w-3 h-3 text-blue-400" />
                        <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">
                            {branding?.siteName || "GAMAL TECH"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
