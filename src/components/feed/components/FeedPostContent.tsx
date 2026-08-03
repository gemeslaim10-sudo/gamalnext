import { textDirStyle } from "@/lib/utils";
import type { FeedItem } from "../types";

interface FeedPostContentProps {
    item: FeedItem;
    isExpanded: boolean;
    hasLongContent: boolean;
    onToggleExpand: (id: string) => void;
}

export function FeedPostContent({ item, isExpanded, hasLongContent, onToggleExpand }: FeedPostContentProps) {
    return (
        <div className="px-3 sm:px-6 pb-3 sm:pb-4">
            <h2
                style={textDirStyle(item.title)}
                className="text-lg sm:text-2xl font-bold text-white mb-1.5 sm:mb-2 leading-tight"
            >
                {item.title}
            </h2>
            <div
                style={textDirStyle(isExpanded ? (item.fullContent || item.description) : item.description)}
                className={`text-slate-300 text-sm sm:text-base leading-relaxed ${!isExpanded ? "line-clamp-3" : "whitespace-pre-wrap"}`}
            >
                {isExpanded ? (item.fullContent || item.description) : item.description}
            </div>
            {hasLongContent && (
                <button
                    onClick={() => onToggleExpand(item.id)}
                    className="mt-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors text-sm"
                >
                    {isExpanded ? "Show Less" : "Read More / عرض المزيد"}
                </button>
            )}
        </div>
    );
}
