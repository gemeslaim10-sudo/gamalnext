import Link from 'next/link';
import Image from 'next/image';
import { User, Settings, LogOut } from 'lucide-react';

interface MobileUserSectionProps {
    user: any;
    setIsOpen: (open: boolean) => void;
    logout: () => void;
    setIsAuthModalOpen: (open: boolean) => void;
}

export function MobileUserSection({ user, setIsOpen, logout, setIsAuthModalOpen }: MobileUserSectionProps) {
    if (user) {
        return (
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
        );
    }

    return (
        <button
            onClick={() => { setIsAuthModalOpen(true); setIsOpen(false); }}
            className="w-full py-4 rounded-[1.5rem] bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
        >
            <User className="w-5 h-5" /> Login / Sign up
        </button>
    );
}
