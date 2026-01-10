'use client';

import Link from 'next/link';
import { ChevronDown, Zap, Briefcase, FolderGit2 } from 'lucide-react';

export default function MegaMenu() {
    return (
        <div className="relative group/menu">
            <button className="flex items-center gap-1 text-sm font-medium text-white hover:text-blue-400 transition-colors py-4">
                التعريف بنا <ChevronDown className="w-4 h-4 group-hover/menu:rotate-180 transition-transform" />
            </button>

            {/* Mega Menu Dropdown */}
            <div className="absolute top-14 right-0 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all transform translate-y-2 group-hover/menu:translate-y-0 z-50 overflow-hidden text-right">
                <div className="p-4 grid gap-2">
                    <Link href="/skills" className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800 transition-colors group/item">
                        <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400 group-hover/item:text-blue-300 group-hover/item:bg-blue-500/20 transition-colors">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">مجالات التخصص</h4>
                            <p className="text-slate-500 text-xs mt-0.5">التطوير الرقمي و SEO</p>
                        </div>
                    </Link>

                    <Link href="/experience" className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800 transition-colors group/item">
                        <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400 group-hover/item:text-purple-300 group-hover/item:bg-purple-500/20 transition-colors">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">الخبرة العملية</h4>
                            <p className="text-slate-500 text-xs mt-0.5">المسار المهني والأدوار السابقة</p>
                        </div>
                    </Link>

                    <Link href="/projects" className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800 transition-colors group/item">
                        <div className="bg-green-500/10 p-2 rounded-lg text-green-400 group-hover/item:text-green-300 group-hover/item:bg-green-500/20 transition-colors">
                            <FolderGit2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">أعمالي</h4>
                            <p className="text-slate-500 text-xs mt-0.5">مجموعة من المشاريع التي قمت بتنفيذها</p>
                        </div>
                    </Link>
                </div>
                <div className="bg-slate-950/50 p-3 text-center border-t border-slate-800">
                    <Link href="/contact" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                        لبدء تعاون مثمر، يرجى التواصل &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}
