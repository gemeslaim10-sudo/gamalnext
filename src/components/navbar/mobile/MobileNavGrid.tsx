import Link from 'next/link';
import { Terminal, Zap, FolderGit2, FileText, MessageSquare, Package } from 'lucide-react';

interface MobileNavGridProps {
    isActive: (path: string) => boolean;
    setIsOpen: (open: boolean) => void;
}

export function MobileNavGrid({ isActive, setIsOpen }: MobileNavGridProps) {
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
        <div className="grid grid-cols-2 gap-3 pb-8">
            {navItems.map((item) => {
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
    );
}
