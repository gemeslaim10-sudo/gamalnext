"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm, useFieldArray } from "react-hook-form";
import {
    Save, Plus, Trash, Video, Search, ChevronDown, ChevronUp,
    GripVertical, Eye, EyeOff, Filter, LayoutGrid, List, X,
    Palette, Film, Code2, Hash
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";
import { revalidateProjects } from "@/app/actions";
import Image from "next/image";

type ProjectItem = {
    title: string;
    image: string;
    tags: string;
    link: string;
    description: string;
    category: 'design' | 'video' | 'software';
    gallery?: string[];
    videoUrl?: string;
    embedCode?: string;
}

interface ProjectsForm {
    items: ProjectItem[];
}

const CATEGORY_CONFIG = {
    design: { label: "Design", icon: Palette, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
    video: { label: "Video", icon: Film, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    software: { label: "Software", icon: Code2, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
};

export default function ProjectsPage() {
    const { register, control, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<ProjectsForm>({
        defaultValues: { items: [] }
    });

    const { fields, append, prepend, remove, move } = useFieldArray({ control, name: "items" });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    const watchedItems = watch("items");
    const listEndRef = useRef<HTMLDivElement>(null);

    // ── Add Project (Prepend + auto-expand) ───────────────────────────────
    const addProject = useCallback(() => {
        // Clear filters so new item is visible
        setSearchQuery("");
        setCategoryFilter("all");
        // Prepend new item (adds to the TOP)
        prepend({ title: "", image: "", gallery: [], tags: "", link: "", description: "", category: "software" });
        
        // We need to wait for the field to be rendered, then expand it
        setTimeout(() => {
            setExpandedCards(prev => {
                const next = new Set(prev);
                // Get the very first row from DOM
                const firstRow = document.querySelector('[data-project-row]');
                if (firstRow) {
                    const id = firstRow.getAttribute('data-project-row');
                    if (id) next.add(id);
                }
                return next;
            });
            
            // Scroll to top to see it
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
    }, [prepend]);

    useEffect(() => {
        async function loadData() {
            try {
                const snap = await getDoc(doc(db, "site_content", "projects"));
                if (snap.exists()) {
                    const data = snap.data() as ProjectsForm;
                    setValue("items", data.items || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [setValue]);

    const onSubmit = async (data: ProjectsForm) => {
        try {
            await setDoc(doc(db, "site_content", "projects"), data);
            await revalidateProjects();
            toast.success("تم تحديث المشاريع بنجاح!");
        } catch (e) {
            toast.error("حدث خطأ أثناء الحفظ.");
        }
    };

    // ── Filter & Search ─────────────────────────────────────────────────────
    const filteredIndices = useMemo(() => {
        return fields.map((_, i) => i).filter(i => {
            const item = watchedItems?.[i];
            if (!item) return true;
            const matchesSearch = !searchQuery ||
                item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tags?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [fields, watchedItems, searchQuery, categoryFilter]);

    // ── Stats ───────────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const items = watchedItems || [];
        return {
            total: items.length,
            design: items.filter(i => i?.category === 'design').length,
            video: items.filter(i => i?.category === 'video').length,
            software: items.filter(i => i?.category === 'software').length,
        };
    }, [watchedItems]);

    // ── Expand/Collapse ─────────────────────────────────────────────────────
    const toggleExpand = (id: string) => {
        setExpandedCards(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const expandAll = () => setExpandedCards(new Set(fields.map(f => f.id)));
    const collapseAll = () => setExpandedCards(new Set());

    if (loading) return (
        <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-900 rounded-xl animate-pulse" />)}
        </div>
    );

    return (
        <div className="space-y-4">
            <Toaster />

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
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                        <Save className="w-3.5 h-3.5" /> {isSubmitting ? "Saving..." : "Save All"}
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
                {filteredIndices.map((index) => {
                    const field = fields[index];
                    const item = watchedItems?.[index];
                    const isExpanded = expandedCards.has(field.id);
                    const catConfig = CATEGORY_CONFIG[item?.category || 'design'];
                    const CatIcon = catConfig.icon;

                    return (
                        <div
                            key={field.id}
                            data-project-row={field.id}
                            className={`bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-all hover:border-slate-700 ${isExpanded ? 'ring-1 ring-blue-500/20' : ''}`}
                        >
                            {/* ── Collapsed Row (Always Visible) ──────── */}
                            <div
                                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer select-none hover:bg-slate-800/30 transition-colors"
                                onClick={() => toggleExpand(field.id)}
                            >
                                {/* Index */}
                                <span className="text-[10px] font-mono text-slate-600 w-5 text-center shrink-0">
                                    {index + 1}
                                </span>

                                {/* Thumbnail */}
                                <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden shrink-0">
                                    {item?.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                                            <CatIcon className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>

                                {/* Title + Tags */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        {item?.title || <span className="text-slate-600 italic">Untitled</span>}
                                    </p>
                                    {item?.tags && (
                                        <p className="text-[10px] text-slate-500 truncate">{item.tags}</p>
                                    )}
                                </div>

                                {/* Category Badge */}
                                <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md ${catConfig.bg} ${catConfig.color} ${catConfig.border} border shrink-0`}>
                                    <CatIcon className="w-3 h-3" />
                                    <span className="hidden sm:inline">{catConfig.label}</span>
                                </span>

                                {/* Actions */}
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); remove(index); }}
                                    className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0"
                                    title="Delete"
                                >
                                    <Trash className="w-3.5 h-3.5" />
                                </button>

                                {/* Expand Arrow */}
                                <div className={`transition-transform duration-200 text-slate-500 ${isExpanded ? 'rotate-180' : ''}`}>
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>

                            {/* ── Expanded Form (Toggleable) ──────────── */}
                            {isExpanded && (
                                <div className="border-t border-slate-800/60 p-4 bg-slate-950/40 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
                                        {/* Image & Gallery */}
                                        <div className="space-y-4">
                                            <ImageUpload
                                                value={watch(`items.${index}.image`)}
                                                onChange={(val) => setValue(`items.${index}.image`, val)}
                                                label={item?.category === 'video' ? "Thumbnail" : "Main Project Image"}
                                            />
                                            {item?.category !== 'video' && (
                                                <MultiImageUpload
                                                    value={watch(`items.${index}.gallery`) || []}
                                                    onChange={(urls) => setValue(`items.${index}.gallery`, urls)}
                                                    label="Project Gallery"
                                                />
                                            )}
                                        </div>

                                        {/* Fields */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Title</label>
                                                <input
                                                    {...register(`items.${index}.title`)}
                                                    className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-white w-full focus:border-blue-500 outline-none transition-all text-sm"
                                                    placeholder="Project title..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Category</label>
                                                <select
                                                    {...register(`items.${index}.category`)}
                                                    className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-white w-full focus:border-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                                                >
                                                    <option value="design">Design</option>
                                                    <option value="video">Video</option>
                                                    <option value="software">Software</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Tags</label>
                                                <input
                                                    {...register(`items.${index}.tags`)}
                                                    className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-white w-full focus:border-blue-500 outline-none transition-all text-sm"
                                                    placeholder="React, UI/UX, Firebase"
                                                />
                                            </div>

                                            {/* Link for Software */}
                                            {item?.category === 'software' && (
                                                <div>
                                                    <label className="block text-[10px] font-bold text-blue-400 mb-1 uppercase tracking-wider">Project URL</label>
                                                    <input
                                                        {...register(`items.${index}.link`)}
                                                        className="bg-blue-500/5 border border-blue-500/20 p-2.5 rounded-lg text-white w-full focus:border-blue-500 outline-none transition-all text-xs font-mono"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            )}

                                            {/* Video Fields */}
                                            {item?.category === 'video' && (
                                                <>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-purple-400 mb-1 uppercase tracking-wider">Video URL</label>
                                                        <input
                                                            {...register(`items.${index}.videoUrl`)}
                                                            className="bg-purple-500/5 border border-purple-500/20 p-2.5 rounded-lg text-white w-full focus:border-purple-500 outline-none transition-all text-xs"
                                                            placeholder="YouTube, Drive, etc."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-purple-400 mb-1 uppercase tracking-wider">Embed Code</label>
                                                        <input
                                                            {...register(`items.${index}.embedCode`)}
                                                            className="bg-purple-500/5 border border-purple-500/20 p-2.5 rounded-lg text-white w-full focus:border-purple-500 outline-none transition-all text-[10px] font-mono"
                                                            placeholder="<iframe>...</iframe>"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            <div className="sm:col-span-2">
                                                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Description</label>
                                                <textarea
                                                    {...register(`items.${index}.description`)}
                                                    className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-white w-full h-16 focus:border-blue-500 outline-none transition-all resize-none text-xs leading-relaxed"
                                                    placeholder="Describe the project..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
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
