import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-hot-toast";
import { revalidateProjects } from "@/app/actions";
import { type ProjectsForm } from "../types";

export function useProjectsAdmin() {
    const { register, control, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<ProjectsForm>({
        defaultValues: { items: [] }
    });

    const { fields, prepend, remove } = useFieldArray({ control, name: "items" });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    const watchedItems = watch("items");
    const listEndRef = useRef<HTMLDivElement>(null);

    const addProject = useCallback(() => {
        setSearchQuery("");
        setCategoryFilter("all");
        prepend({ title: "", image: "", gallery: [], tags: "", link: "", description: "", category: "software" });
        
        setTimeout(() => {
            setExpandedCards(prev => {
                const next = new Set(prev);
                const firstRow = document.querySelector('[data-project-row]');
                if (firstRow) {
                    const id = firstRow.getAttribute('data-project-row');
                    if (id) next.add(id);
                }
                return next;
            });
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
        } catch {
            toast.error("حدث خطأ أثناء الحفظ.");
        }
    };

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

    const stats = useMemo(() => {
        const items = watchedItems || [];
        return {
            total: items.length,
            design: items.filter(i => i?.category === 'design').length,
            video: items.filter(i => i?.category === 'video').length,
            software: items.filter(i => i?.category === 'software').length,
        };
    }, [watchedItems]);

    const toggleExpand = (id: string) => {
        setExpandedCards(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const expandAll = () => setExpandedCards(new Set(fields.map(f => f.id)));
    const collapseAll = () => setExpandedCards(new Set());

    return {
        register,
        handleSubmit,
        setValue,
        watch,
        isSubmitting,
        fields,
        remove,
        loading,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        expandedCards,
        viewMode,
        setViewMode,
        watchedItems,
        listEndRef,
        addProject,
        onSubmit,
        filteredIndices,
        stats,
        toggleExpand,
        expandAll,
        collapseAll
    };
}
