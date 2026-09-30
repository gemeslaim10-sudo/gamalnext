import Link from "next/link";
import { textDirStyle } from "@/lib/utils";
import type { FeedItem } from "../types";
import { useCopy } from "@/components/providers/CopyProvider";

interface FeedPostContentProps {
    item: FeedItem;
    isExpanded: boolean;
    hasLongContent: boolean;
    onToggleExpand: (id: string) => void;
}

export function FeedPostContent({ item, isExpanded, hasLongContent, onToggleExpand }: FeedPostContentProps) {
    const t = useCopy();
    const text = isExpanded ? item.fullContent || item.description : item.description;
    // Community posts have a generated title ("X shared a post") that only repeats the header
    const showTitle = item.type !== "post";

    return (
        <div className="px-4 pb-4 pt-3 sm:px-5">
            {showTitle && (
                <h2 style={textDirStyle(item.title)} className="text-lg font-semibold leading-snug text-foreground">
                    <Link href={item.link} className="hover:underline hover:decoration-border-strong hover:underline-offset-4">
                        {item.title}
                    </Link>
                </h2>
            )}
            {text && (
                <p
                    // Re-mounts on expand/collapse so the new text fades in instead of snapping
                    key={isExpanded ? "full" : "short"}
                    style={textDirStyle(text)}
                    className={`${showTitle ? "mt-1.5" : ""} animate-fade-in text-sm leading-relaxed text-muted ${isExpanded ? "whitespace-pre-wrap" : "line-clamp-3"}`}
                >
                    {text}
                </p>
            )}
            {item.type === "article" ? (
                // Articles are read on their own page, where the formatting is shown properly
                <Link
                    href={item.link}
                    className="mt-1.5 inline-block text-sm font-medium text-foreground hover:underline hover:underline-offset-4"
                >
                    {t("home.readArticle")}
                </Link>
            ) : (
                hasLongContent && (
                    <button
                        type="button"
                        onClick={() => onToggleExpand(item.id)}
                        className="mt-1.5 text-sm font-medium text-foreground hover:underline hover:underline-offset-4"
                    >
                        {isExpanded ? t("home.showLess") : t("home.showMore")}
                    </button>
                )
            )}
        </div>
    );
}
