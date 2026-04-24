"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./sidebarConfig";

export default function SidebarNavigation() {
    const pathname = usePathname();

    return (
        <div className="px-4 py-3 border-b border-slate-800/30">
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em] mb-2 px-1">Navigate</h4>
            <nav className="space-y-0.5">
                {NAV_ITEMS.map(item => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all
                                ${isActive
                                    ? 'bg-blue-500/10 text-blue-400'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                                }
                            `}
                        >
                            <item.icon className="w-3.5 h-3.5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
