import type { ReactNode } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Card, FadeImg, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";
import { getTimestampMs } from "@/types";
import { getArticleSummary, formatArticleDateEn } from "@/lib/articles/articleCardHelpers";
import { articlePath } from "@/lib/articles/paths";
import type { FirebaseTimestamp, MediaItem } from "@/types";

/** The fields a card needs; every article list in the app has them. */
export interface ArticleCardData {
    id: string;
    title: string;
    summary?: string;
    content?: string;
    media?: MediaItem[];
    createdAt?: FirebaseTimestamp;
    /** Readable address (older articles use their id) */
    slug?: string;
}

interface ArticleCardProps {
    article: ArticleCardData;
    /** Show the cover area (a plain placeholder when the article has no media) */
    showCover?: boolean;
    /** Extra controls next to the date, e.g. edit / delete for the author */
    actions?: ReactNode;
    className?: string;
}

/** Lists reserve a cover area only when at least one article has media, so rows line up. */
export function hasAnyCover(articles: ArticleCardData[]) {
    return articles.some((article) => Boolean(article.media?.[0]?.url));
}

/** The one article card: /articles, related articles, user profiles and the profile page. */
export function ArticleCard({ article, showCover = true, actions, className }: ArticleCardProps) {
    const cover = article.media?.[0];
    const summary = getArticleSummary(article, 150);
    const date = formatArticleDateEn(article.createdAt ?? null);
    const ms = getTimestampMs(article.createdAt);

    return (
        <Card padding="none" interactive className={cn("reveal relative flex flex-col overflow-hidden", className)}>
            {showCover && (
                <div className="aspect-video shrink-0 border-b border-border bg-surface-hover">
                    {cover?.url ? (
                        cover.type === "video" ? (
                            <video src={cover.url} muted playsInline preload="metadata" aria-hidden className="size-full object-cover" />
                        ) : (
                            // Plain <img>: article media can come from hosts that next/image is not configured for
                            <FadeImg src={cover.url} alt={article.title} loading="lazy" className="size-full object-cover" />
                        )
                    ) : (
                        <div className="flex size-full items-center justify-center text-subtle">
                            <FileText aria-hidden className="size-6" />
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 dir="auto" className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
                    {/* The link covers the whole card, so the card is one click target */}
                    <Link
                        href={articlePath(article)}
                        className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-foreground"
                    >
                        {article.title}
                    </Link>
                </h3>
                {summary && (
                    <p dir="auto" className="line-clamp-2 text-sm leading-relaxed text-muted">
                        {summary}
                    </p>
                )}
                {(date || actions) && (
                    <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                        <time dateTime={ms ? new Date(ms).toISOString() : undefined} className="text-xs text-subtle">
                            {date}
                        </time>
                        {/* Above the card link so they stay clickable */}
                        {actions && <div className="relative z-10 -my-1.5 flex items-center gap-1">{actions}</div>}
                    </div>
                )}
            </div>
        </Card>
    );
}

export function ArticleCardSkeleton({ className }: { className?: string }) {
    return (
        <Card padding="none" className={cn("overflow-hidden", className)} aria-hidden>
            <Skeleton className="aspect-video rounded-none" />
            <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="mt-4 h-3 w-24" />
            </div>
        </Card>
    );
}
