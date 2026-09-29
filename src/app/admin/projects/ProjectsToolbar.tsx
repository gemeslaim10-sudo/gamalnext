"use client";

import { Search, ChevronDown, ChevronUp, LayoutGrid, List, X } from "lucide-react";
import { Button, Chip, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
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
}

/** Search, category filter, expand/collapse and list/grid toggle above the projects list. */
export default function ProjectsToolbar({
    stats, searchQuery, setSearchQuery, categoryFilter, setCategoryFilter,
    viewMode, setViewMode, expandAll, collapseAll,
}: ProjectsToolbarProps) {
    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative w-full lg:max-w-xs">
                <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    aria-label="Search projects"
                    className="px-9"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        aria-label="Clear search"
                        className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-control text-subtle transition-colors hover:text-foreground"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:flex-1">
                {/* Category filter */}
                <Chip active={categoryFilter === "all"} onClick={() => setCategoryFilter("all")}>
                    All ({stats.total})
                </Chip>
                {(Object.entries(CATEGORY_CONFIG) as [string, typeof CATEGORY_CONFIG.design][]).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    const count = stats[key as keyof typeof stats];
                    return (
                        <Chip key={key} active={categoryFilter === key} onClick={() => setCategoryFilter(key)}>
                            <Icon aria-hidden className="size-3.5" /> {cfg.label} ({count})
                        </Chip>
                    );
                })}

                {/* Expand/Collapse + View Toggle */}
                <div className="ml-auto flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={expandAll} aria-label="Expand all" title="Expand all">
                        <ChevronDown />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={collapseAll} aria-label="Collapse all" title="Collapse all">
                        <ChevronUp />
                    </Button>
                    <div aria-hidden className="mx-1 h-5 w-px bg-border" />
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setViewMode('list')}
                        aria-label="List view"
                        aria-pressed={viewMode === 'list'}
                        title="List view"
                        className={cn(viewMode === 'list' && "bg-surface-hover text-foreground")}
                    >
                        <List />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setViewMode('grid')}
                        aria-label="Grid view"
                        aria-pressed={viewMode === 'grid'}
                        title="Grid view"
                        className={cn(viewMode === 'grid' && "bg-surface-hover text-foreground")}
                    >
                        <LayoutGrid />
                    </Button>
                </div>
            </div>
        </div>
    );
}
