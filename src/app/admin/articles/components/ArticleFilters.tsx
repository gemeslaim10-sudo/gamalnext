interface ArticleFiltersProps {
    filter: 'all' | 'published' | 'pending';
    setFilter: (f: 'all' | 'published' | 'pending') => void;
}

export function ArticleFilters({ filter, setFilter }: ArticleFiltersProps) {
    return (
        <div className="flex gap-4 mb-6">
            <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
                All
            </button>
            <button
                onClick={() => setFilter('published')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'published' ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
                Published
            </button>
            <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
                Pending Review
            </button>
        </div>
    );
}
