import { Chip } from "@/components/ui";

interface ArticleFiltersProps {
    filter: 'all' | 'published' | 'pending';
    setFilter: (f: 'all' | 'published' | 'pending') => void;
}

const FILTERS: { value: ArticleFiltersProps["filter"]; label: string }[] = [
    { value: 'all', label: "All" },
    { value: 'published', label: "Published" },
    { value: 'pending', label: "Pending Review" },
];

export function ArticleFilters({ filter, setFilter }: ArticleFiltersProps) {
    return (
        <div className="mb-4 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
                <Chip key={f.value} active={filter === f.value} onClick={() => setFilter(f.value)}>
                    {f.label}
                </Chip>
            ))}
        </div>
    );
}
