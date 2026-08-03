'use client';

import { Terminal } from 'lucide-react';
import { MobileUserSection } from './mobile/MobileUserSection';
import { MobileNavGrid } from './mobile/MobileNavGrid';
import type { User } from 'firebase/auth';
import type { BrandingSettings } from '@/types';

interface MobileMenuProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    user: User | null;
    logout: () => void;
    isActive: (path: string) => boolean;
    setIsAuthModalOpen: (open: boolean) => void;
    branding?: BrandingSettings | null;
}

export default function MobileMenu({ isOpen, setIsOpen, user, logout, isActive, setIsAuthModalOpen, branding }: MobileMenuProps) {
    if (!isOpen) return null;

    return (
        <div className="xl:hidden fixed inset-0 top-14 bg-[#030712]/98 backdrop-blur-3xl z-40 overflow-y-auto overflow-x-hidden border-t border-white/5 flex flex-col">
            <div className="flex-1 px-4 py-5 flex flex-col gap-4">
                
                {/* User Section — more compact */}
                <MobileUserSection 
                    user={user} 
                    setIsOpen={setIsOpen} 
                    logout={logout} 
                    setIsAuthModalOpen={setIsAuthModalOpen} 
                />

                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full"></div>

                {/* Navigation Grid */}
                <MobileNavGrid isActive={isActive} setIsOpen={setIsOpen} />

                {/* Footer */}
                <div className="mt-auto pb-3 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                        <Terminal className="w-3 h-3 text-blue-400" />
                        <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase">
                            {branding?.siteName || "GAMAL TECH"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
