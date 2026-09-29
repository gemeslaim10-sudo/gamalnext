import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Badge, Button } from "@/components/ui";
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
            className="flex cursor-pointer select-none items-center gap-2 px-4 py-3 transition-colors hover:bg-surface-hover @md:gap-3"
            onClick={() => onToggleExpand(fieldId)}
        >
            {/* Index */}
            <span className="hidden w-5 shrink-0 text-center text-xs tabular-nums text-subtle @md:inline">
                {index + 1}
            </span>

            {/* Thumbnail */}
            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-control border border-border bg-surface-hover text-subtle">
                {item?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt="" className="size-full object-cover" />
                ) : (
                    <CatIcon aria-hidden className="size-4" />
                )}
            </div>

            {/* Title + Tags */}
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                    {item?.title || <span className="font-normal text-subtle">Untitled</span>}
                </p>
                {item?.tags && (
                    <p className="truncate text-xs text-subtle">{item.tags}</p>
                )}
            </div>

            {/* Category Badge */}
            <Badge className="hidden shrink-0 @md:inline-flex">
                <CatIcon aria-hidden />
                {catConfig.label}
            </Badge>

            {/* Actions */}
            <Button
                variant="danger"
                size="icon-sm"
                onClick={(e) => { e.stopPropagation(); onRemove(index); }}
                aria-label={`Delete ${item?.title || "project"}`}
                title="Delete"
                className="shrink-0"
            >
                <Trash2 />
            </Button>

            {/* Expand Arrow */}
            <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => { e.stopPropagation(); onToggleExpand(fieldId); }}
                aria-label={isExpanded ? "Collapse" : "Expand"}
                aria-expanded={isExpanded}
                className="shrink-0"
            >
                {isExpanded ? <ChevronUp /> : <ChevronDown />}
            </Button>
        </div>
    );
}
