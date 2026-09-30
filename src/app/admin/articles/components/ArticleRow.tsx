"use client";

import Link from "next/link";
import { Check, ExternalLink, EyeOff, FileText, Pencil, Trash2, Video } from "lucide-react";
import { Badge, Button, MenuDivider, MenuItem, Spinner } from "@/components/ui";
import { isPublicArticle } from "@/lib/content/shared";
import { cn } from "@/lib/utils";
import { RowMenu, Thumb } from "@/components/admin/kit/list";
import { formatDate } from "@/components/admin/kit/listData";
import { articleCover, articleStatus, articleSummary, articleTitle, isPendingArticle, type ArticleRow } from "../articleData";

export type ArticleAction = "publish" | "unpublish" | "delete";

interface ArticleRowItemProps {
    article: ArticleRow;
    /** A change to this article is being saved */
    busy: boolean;
    onAction: (article: ArticleRow, action: ArticleAction) => void;
}

/** One article in the list: opens its editor; publish / unpublish / delete from the row. */
export function ArticleRowItem({ article, busy, onAction }: ArticleRowItemProps) {
    const href = `/admin/articles/${article.id}`;
    const title = articleTitle(article);
    const summary = articleSummary(article);
    const isPublic = isPublicArticle(article);
    const status = articleStatus(article);
    const date = formatDate(article.createdAt);

    return (
        <li
            aria-busy={busy}
            className={cn(
                "flex animate-fade-in gap-3 p-3 transition-opacity sm:flex-row sm:items-center sm:gap-4 sm:p-4",
                // With a visible "publish" button the actions go under the text on phones, so the title keeps its width
                isPublic ? "items-center" : "flex-col",
                busy && "opacity-60"
            )}
        >
            <Link href={href} className="group flex min-w-0 flex-1 items-center gap-3 rounded-control sm:gap-4">
                <Thumb src={articleCover(article)} className="aspect-video w-14 sm:w-24">
                    {article.media?.[0]?.type === "video" ? <Video aria-hidden className="size-4" /> : <FileText aria-hidden className="size-4" />}
                </Thumb>
                <span className="min-w-0 flex-1">
                    {/* dir="auto" renders English titles correctly; match-parent keeps them on the page's side */}
                    <span
                        dir="auto"
                        className="block truncate text-sm font-medium text-foreground underline-offset-4 [text-align:match-parent] group-hover:underline"
                    >
                        {title}
                    </span>
                    {summary && (
                        <span dir="auto" className="mt-0.5 hidden truncate text-sm text-muted [text-align:match-parent] sm:block">
                            {summary}
                        </span>
                    )}
                    <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-subtle">
                        {/* The tab already says pending/published; only an unusual status gets a label */}
                        {!isPublic && !isPendingArticle(article) && <Badge variant={status.variant}>{status.label}</Badge>}
                        <span dir="auto" className="max-w-full truncate">
                            {article.authorName || "من غير اسم"}
                        </span>
                        {date && (
                            <>
                                <span aria-hidden>·</span>
                                <span>{date}</span>
                            </>
                        )}
                    </span>
                </span>
            </Link>

            <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
                {!isPublic && (
                    <Button variant="secondary" size="sm" className="h-10 sm:h-8" onClick={() => onAction(article, "publish")} disabled={busy}>
                        {busy ? <Spinner className="size-4" /> : <Check />}
                        نشر
                    </Button>
                )}
                <RowMenu label={`إجراءات «${title}»`}>
                    {(close) => (
                        <>
                            <MenuItem href={href} onClick={close}>
                                <Pencil /> تعديل
                            </MenuItem>
                            {isPublic && (
                                <MenuItem
                                    onClick={() => {
                                        close();
                                        window.open(`/articles/${article.id}`, "_blank", "noopener,noreferrer");
                                    }}
                                >
                                    <ExternalLink /> عرض على الموقع
                                </MenuItem>
                            )}
                            {isPublic && (
                                <MenuItem
                                    onClick={() => {
                                        close();
                                        if (!busy) onAction(article, "unpublish");
                                    }}
                                >
                                    <EyeOff /> إلغاء النشر
                                </MenuItem>
                            )}
                            <MenuDivider />
                            <MenuItem
                                danger
                                onClick={() => {
                                    close();
                                    if (!busy) onAction(article, "delete");
                                }}
                            >
                                <Trash2 /> حذف
                            </MenuItem>
                        </>
                    )}
                </RowMenu>
            </div>
        </li>
    );
}
