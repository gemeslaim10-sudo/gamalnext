"use client";

import { Plus, Save } from "lucide-react";
import { Button, Card, EmptyState, PageHeader, Skeleton } from "@/components/ui";

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

    const renderCard = (index: number, className?: string) => (
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
            className={className}
        />
    );

    return (
        <>
            <PageHeader
                title="Projects"
                description="Portfolio items shown on the projects page. Changes go live after you save."
                actions={
                    !loading && (
                        <>
                            <Button variant="secondary" onClick={addProject} className="flex-1 sm:flex-none">
                                <Plus /> Add Project
                            </Button>
                            <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="flex-1 sm:flex-none">
                                <Save /> {isSubmitting ? "Saving..." : "Save All"}
                            </Button>
                        </>
                    )
                }
            />

            {loading ? (
                <Card padding="none" className="divide-y divide-border">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3">
                            <Skeleton className="size-10 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-3.5 w-1/3" />
                                <Skeleton className="h-3 w-1/4" />
                            </div>
                        </div>
                    ))}
                </Card>
            ) : (
                <>
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
                    />

                    <div className="mt-4 space-y-3">
                        {/* ── Search Results Count ────────────────────────── */}
                        {(searchQuery || categoryFilter !== "all") && (
                            <p className="text-xs text-subtle">
                                Showing {filteredIndices.length} of {fields.length} projects
                                {searchQuery && <> matching &quot;<span className="text-muted">{searchQuery}</span>&quot;</>}
                            </p>
                        )}

                        {/* ── Projects List ───────────────────────────────── */}
                        {filteredIndices.length > 0 && (
                            viewMode === 'grid' ? (
                                <div className="grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {filteredIndices.map((index) =>
                                        renderCard(index, "overflow-hidden rounded-card border border-border bg-surface")
                                    )}
                                </div>
                            ) : (
                                <Card padding="none" className="divide-y divide-border overflow-hidden">
                                    {filteredIndices.map((index) => renderCard(index))}
                                </Card>
                            )
                        )}
                        <div ref={listEndRef} />

                        {/* ── Empty State ─────────────────────────────────── */}
                        {fields.length === 0 && (
                            <EmptyState
                                title="No projects yet"
                                action={
                                    <Button variant="secondary" onClick={addProject}>
                                        <Plus /> Add your first project
                                    </Button>
                                }
                            />
                        )}

                        {filteredIndices.length === 0 && fields.length > 0 && (
                            <div className="py-10 text-center text-sm text-subtle">
                                No projects match your search.
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { setSearchQuery(""); setCategoryFilter("all"); }}
                                    className="ml-2"
                                >
                                    Clear filters
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
}
