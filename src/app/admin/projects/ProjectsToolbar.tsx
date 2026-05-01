"use client";

import { Plus, Save, Search, ChevronDown, ChevronUp, LayoutGrid, List, X } from "lucide-react";
import { CATEGORY_CONFIG } from "./types";

interface ProjectsToolbarProps {
    stats: { total: number; design: number; video: number; software: number };
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    categoryFilter: string;
    setCategoryFilter: (c: string) => void;
    viewMode: 'grid' | 'list';
    setViewMode: (m: 'grid' | 'list') => void;
    expandAll: () => void;
    collapseAll: () => void;
    addProject: () => void;
    onSave: () => void;
    isSaving: boolean;
}

export default function ProjectsToolbar({
    stats, searchQuery, setSearchQuery, categoryFilter, setCategoryFilter,
    viewMode, setViewMode, expandAll, collapseAll, addProject, onSave, isSaving,
}: ProjectsToolbarProps) {
    return (
        <>
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl md:text-2xl font-bold text-white">Projects</h1>
                    <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                        {stats.total}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={addProject}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Project
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                        <Save className="w-3.5 h-3.5" /> {isSaving ? "Saving..." : "Save All"}
                    </button>
                </div>
            </div>

            {/* ── Toolbar: Search + Filters + View Mode ──────────────────── */}
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search projects..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
                    <button
                        onClick={() => setCategoryFilter("all")}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all ${categoryFilter === "all" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-white"}`}
                    >
                        All ({stats.total})
                    </button>
                    {(Object.entries(CATEGORY_CONFIG) as [string, typeof CATEGORY_CONFIG.design][]).map(([key, cfg]) => {
                        const Icon = cfg.icon;
                        const count = stats[key as keyof typeof stats];
                        return (
                            <button
                                key={key}
                                onClick={() => setCategoryFilter(key)}
                                className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold rounded-md transition-all ${categoryFilter === key ? `${cfg.bg} ${cfg.color}` : "text-slate-500 hover:text-white"}`}
                            >
                                <Icon className="w-3 h-3" /> {cfg.label} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* View Toggle + Expand/Collapse */}
                <div className="flex items-center gap-1.5 ml-auto">
                    <button onClick={expandAll} className="text-[10px] text-slate-500 hover:text-white px-2 py-1.5 rounded transition-colors" title="Expand all">
                        <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={collapseAll} className="text-[10px] text-slate-500 hover:text-white px-2 py-1.5 rounded transition-colors" title="Collapse all">
                        <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-5 bg-slate-800" />
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded ${viewMode === 'list' ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500 hover:text-white'}`}
                    >
                        <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded ${viewMode === 'grid' ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500 hover:text-white'}`}
                    >
                        <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </>
    );
}
