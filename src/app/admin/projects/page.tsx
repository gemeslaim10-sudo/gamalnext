"use client";

import { Plus } from "lucide-react";
import { Toaster } from "react-hot-toast";

// ── Sub-Components ────────────────────────────────────────────────────────────
import ProjectsToolbar from "./ProjectsToolbar";
import ProjectCard from "./ProjectCard";
import { useProjectsAdmin } from "./hooks/useProjectsAdmin";

export default function ProjectsPage() {
    const {
        register, handleSubmit, setValue, watch, isSubmitting,
        fields, remove, loading, searchQuery, setSearchQuery,
        categoryFilter, setCategoryFilter, expandedCards, viewMode, setViewMode,
        watchedItems, listEndRef, addProject, onSubmit, filteredIndices,
        stats, toggleExpand, expandAll, collapseAll
    } = useProjectsAdmin();

    if (loading) return (
        <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-900 rounded-xl animate-pulse" />)}
        </div>
    );

    return (
        <div className="space-y-4">
            <Toaster />

            <ProjectsToolbar
                stats={stats}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                viewMode={viewMode}
                setViewMode={setViewMode}
                expandAll={expandAll}
                collapseAll={collapseAll}
                addProject={addProject}
                onSave={handleSubmit(onSubmit)}
                isSaving={isSubmitting}
            />

            {/* ── Search Results Count ────────────────────────────────────── */}
            {(searchQuery || categoryFilter !== "all") && (
                <p className="text-[11px] text-slate-500 px-1">
                    Showing {filteredIndices.length} of {fields.length} projects
                    {searchQuery && <> matching &quot;<span className="text-slate-300">{searchQuery}</span>&quot;</>}
                </p>
            )}

            {/* ── Projects List ───────────────────────────────────────────── */}
            <div className={viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3"
                : "space-y-2"
            }>
                {filteredIndices.map((index) => (
                    <ProjectCard
                        key={fields[index].id}
                        field={fields[index]}
                        index={index}
                        item={watchedItems?.[index]}
                        isExpanded={expandedCards.has(fields[index].id)}
                        onToggleExpand={toggleExpand}
                        onRemove={remove}
                        register={register}
                        watch={watch}
                        setValue={setValue}
                    />
                ))}
            </div>
            <div ref={listEndRef} />

            {/* ── Empty State ─────────────────────────────────────────────── */}
            {fields.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/30">
                    <div className="bg-slate-900 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="text-slate-700 w-7 h-7" />
                    </div>
                    <p className="text-slate-500 font-bold mb-4 text-sm">No projects yet</p>
                    <button
                        type="button"
                        onClick={addProject}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all text-sm"
                    >
                        Add your first project
                    </button>
                </div>
            )}

            {filteredIndices.length === 0 && fields.length > 0 && (
                <div className="text-center py-10 text-slate-500 text-sm">
                    No projects match your search.
                    <button onClick={() => { setSearchQuery(""); setCategoryFilter("all"); }} className="text-blue-400 hover:text-blue-300 ml-2">
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}
