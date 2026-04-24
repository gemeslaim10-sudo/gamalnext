import { ChevronDown, Trash } from "lucide-react";
import { CATEGORY_CONFIG, type ProjectItem } from "../types";

interface ProjectRowHeaderProps {
    fieldId: string;
    index: number;
    item: ProjectItem | undefined;
    isExpanded: boolean;
    onToggleExpand: (id: string) => void;
    onRemove: (index: number) => void;
}

export function ProjectRowHeader({
    fieldId, index, item, isExpanded, onToggleExpand, onRemove
}: ProjectRowHeaderProps) {
    const catConfig = CATEGORY_CONFIG[item?.category || 'design'];
    const CatIcon = catConfig.icon;

    return (
        <div
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer select-none hover:bg-slate-800/30 transition-colors"
            onClick={() => onToggleExpand(fieldId)}
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
                onClick={(e) => { e.stopPropagation(); onRemove(index); }}
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
    );
}
