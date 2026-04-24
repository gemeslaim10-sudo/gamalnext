import Link from 'next/link';
import { Wrench, Video, Mic, Languages, Coins, Table, QrCode, Lock, FileText, Image, Youtube, Code, Ruler, Calendar, Timer, LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
    Video, Mic, Languages, Coins, Table, QrCode, Lock, FileText, Image, Youtube, Code, Ruler, Calendar, Timer
};

interface ToolCardProps {
    tool: any;
}

export function ToolCard({ tool }: ToolCardProps) {
    const Icon = ICON_MAP[tool.icon] || Wrench;
    return (
        <Link
            href={tool.href}
            className={`group relative p-6 rounded-2xl border ${tool.border} bg-slate-900/50 hover:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
        >
            <div className={`mb-4 w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${tool.color}`} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {tool.name}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
                {tool.description}
            </p>
            <div className="mt-4 flex items-center text-sm font-medium text-slate-500 group-hover:text-slate-300 transition-colors">
                Use Tool <span className="ml-auto">→</span>
            </div>
        </Link>
    );
}
