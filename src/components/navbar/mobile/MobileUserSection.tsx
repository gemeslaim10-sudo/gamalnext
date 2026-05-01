import Link from 'next/link';
import Image from 'next/image';
import { User, Settings, LogOut } from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';

interface MobileUserSectionProps {
    user: FirebaseUser | null;
    setIsOpen: (open: boolean) => void;
    logout: () => void;
    setIsAuthModalOpen: (open: boolean) => void;
}

export function MobileUserSection({ user, setIsOpen, logout, setIsAuthModalOpen }: MobileUserSectionProps) {
    if (user) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <Image 
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                        width={44} 
                        height={44} 
                        className="w-11 h-11 rounded-full border-2 border-blue-500/30 object-cover" 
                        alt={user.displayName || "User"} 
                    />
                    <div className="min-w-0">
                        <div className="text-white font-bold text-sm truncate">{user.displayName || user.email}</div>
                        <div className="text-blue-400 text-xs">Active Member</div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/users/${user.uid}`} onClick={() => setIsOpen(false)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors border border-white/5">
                        <User className="w-3.5 h-3.5" /> Profile
                    </Link>
                    <Link href="/settings" onClick={() => setIsOpen(false)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors border border-white/5">
                        <Settings className="w-3.5 h-3.5" /> Settings
                    </Link>
                    <button
                        onClick={() => { logout(); setIsOpen(false); }}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors border border-red-500/20"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => { setIsAuthModalOpen(true); setIsOpen(false); }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
            <User className="w-4 h-4" /> Login / Sign up
        </button>
    );
}
