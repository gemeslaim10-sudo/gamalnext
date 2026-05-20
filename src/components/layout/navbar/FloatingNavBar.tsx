import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface FloatingNavBarProps {
    isScrolled: boolean;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (val: boolean) => void;
    isActive: (path: string) => boolean;
}

export function FloatingNavBar({ isScrolled, isMobileMenuOpen, setIsMobileMenuOpen, isActive }: FloatingNavBarProps) {
    if (!isScrolled) return null;

    return (
        <div style={{ display: 'none' }} className="fixed top-4 right-4 z-[91] flex items-center gap-1">
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
    );
}
