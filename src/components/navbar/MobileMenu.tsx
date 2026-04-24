'use client';

import { Terminal } from 'lucide-react';
import { MobileUserSection } from './mobile/MobileUserSection';
import { MobileNavGrid } from './mobile/MobileNavGrid';

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

    return (
        <div className="lg:hidden fixed inset-0 top-14 bg-[#030712]/95 backdrop-blur-3xl z-40 overflow-y-auto overflow-x-hidden border-t border-white/5 flex flex-col animate-in slide-in-from-top-2 duration-300">
            <div className="flex-1 px-4 py-8 flex flex-col gap-6">
                
                <MobileUserSection 
                    user={user} 
                    setIsOpen={setIsOpen} 
                    logout={logout} 
                    setIsAuthModalOpen={setIsAuthModalOpen} 
                />

                <div className="h-px bg-white/5 w-full rounded-full my-1"></div>

                <MobileNavGrid isActive={isActive} setIsOpen={setIsOpen} />

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
