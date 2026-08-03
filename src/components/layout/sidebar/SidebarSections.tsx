"use client";

import Link from "next/link";
import Image from "next/image";
import { FileText, Briefcase, FolderOpen, Wrench, ArrowRight, Star } from "lucide-react";
import type { SidebarArticle, SidebarProject, SidebarTool } from "./sidebarConfig";

// ── Articles Section ──────────────────────────────────────────────────────────
export function SidebarArticles({ articles }: { articles: SidebarArticle[] }) {
    if (articles.length === 0) return null;

    return (
        <div className="px-4 py-3 border-b border-slate-800/30">
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em] mb-2.5 px-1 flex items-center gap-1.5">
                <FileText className="w-3 h-3" /> Articles
            </h4>
            <div className="space-y-1">
                {articles.map(a => (
                    <Link
                        key={a.id}
                        href={`/articles/${a.id}`}
                        className="block px-2.5 py-2 rounded-md hover:bg-slate-800/40 transition-colors group"
                    >
                        <p className="text-xs text-slate-300 group-hover:text-white line-clamp-2 leading-relaxed transition-colors">
                            {a.title}
                        </p>
                    </Link>
                ))}
                <Link
                    href="/articles"
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-blue-400/70 hover:text-blue-400 transition-colors"
                >
                    View all <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
    );
}

// ── Projects Section ──────────────────────────────────────────────────────────
export function SidebarProjects({ projects }: { projects: SidebarProject[] }) {
    if (projects.length === 0) return null;

    return (
        <div className="px-4 py-3 border-b border-slate-800/30">
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em] mb-2.5 px-1 flex items-center gap-1.5">
                <Briefcase className="w-3 h-3" /> Projects
            </h4>
            <div className="space-y-1">
                {projects.map(p => (
                    <Link
                        key={p.id}
                        href={`/projects/${p.slug || p.id}`}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-slate-800/40 transition-colors group"
                    >
                        {p.imageUrl ? (
                            <Image
                                src={p.imageUrl}
                                alt={p.title}
                                width={28}
                                height={28}
                                className="rounded-md object-cover w-7 h-7 shrink-0 ring-1 ring-slate-700"
                            />
                        ) : (
                            <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center shrink-0">
                                <FolderOpen className="w-3 h-3 text-slate-500" />
                            </div>
                        )}
                        <p className="text-xs text-slate-300 group-hover:text-white line-clamp-1 transition-colors">
                            {p.title}
                        </p>
                    </Link>
                ))}
                <Link
                    href="/projects"
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-blue-400/70 hover:text-blue-400 transition-colors"
                >
                    View all <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
    );
}

// ── Tools Section ─────────────────────────────────────────────────────────────
export function SidebarTools({ tools }: { tools: SidebarTool[] }) {
    return (
        <div className="px-4 py-3 border-b border-slate-800/30">
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em] mb-2.5 px-1 flex items-center gap-1.5">
                <Wrench className="w-3 h-3" /> Quick Tools
            </h4>
            <div className="space-y-1">
                {tools.map(t => (
                    <Link
                        key={t.href}
                        href={t.href}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-slate-800/40 transition-colors group"
                    >
                        <span className="text-sm">{t.icon}</span>
                        <p className="text-xs text-slate-300 group-hover:text-white transition-colors">
                            {t.name}
                        </p>
                    </Link>
                ))}
                <Link
                    href="/tools"
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-blue-400/70 hover:text-blue-400 transition-colors"
                >
                    All tools <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
    );
}

// ── CTA Section ───────────────────────────────────────────────────────────────
export function SidebarCTA() {
    return (
        <div className="px-4 py-3">
            <Link
                href="/contact"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/30 transition-all group"
            >
                <Star className="w-4 h-4 text-amber-400/70 group-hover:text-amber-400" />
                <div>
                    <p className="text-xs text-slate-300 font-medium">Need a project?</p>
                    <p className="text-[10px] text-slate-500">Get in touch today</p>
                </div>
            </Link>
        </div>
    );
}
