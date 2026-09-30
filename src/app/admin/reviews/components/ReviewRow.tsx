"use client";

import { Eye, EyeOff, Star, Trash2 } from "lucide-react";
import { Avatar, Button, MenuDivider, MenuItem, Spinner } from "@/components/ui";
import { cn } from "@/lib/utils";
import { RowMenu } from "@/components/admin/kit/list";
import { formatDate } from "@/components/admin/kit/listData";
import { reviewAuthor, reviewRating, type ReviewRow } from "../reviewData";

export type ReviewAction = "approve" | "hide" | "delete";

export function Stars({ rating, className }: { rating: number; className?: string }) {
    return (
        <span role="img" aria-label={`${rating} من 5`} className={cn("inline-flex shrink-0 items-center gap-0.5", className)}>
            {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} aria-hidden className={cn("size-3.5", n <= rating ? "fill-current text-foreground" : "text-subtle")} />
            ))}
        </span>
    );
}

interface ReviewRowItemProps {
    review: ReviewRow;
    busy: boolean;
    onOpen: (review: ReviewRow) => void;
    onAction: (review: ReviewRow, action: ReviewAction) => void;
}

/** One review: opens the whole review; show / hide / delete from the row. */
export function ReviewRowItem({ review, busy, onOpen, onAction }: ReviewRowItemProps) {
    const author = reviewAuthor(review);
    const date = formatDate(review.createdAt);

    return (
        <li
            aria-busy={busy}
            className={cn(
                "flex animate-fade-in flex-col gap-3 p-3 transition-opacity sm:flex-row sm:items-start sm:gap-4 sm:p-4",
                busy && "opacity-60"
            )}
        >
            <button
                type="button"
                onClick={() => onOpen(review)}
                aria-label={`عرض رأي ${author}`}
                className="group flex min-w-0 flex-1 items-start gap-3 rounded-control text-start"
            >
                <Avatar src={review.userImage} alt="" size={40} />
                <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span dir="auto" className="max-w-full truncate text-sm font-medium text-foreground underline-offset-4 group-hover:underline">
                            {author}
                        </span>
                        <Stars rating={reviewRating(review)} />
                        {date && <span className="text-xs text-subtle">{date}</span>}
                    </span>
                    <span dir="auto" className="mt-1 line-clamp-2 block whitespace-pre-line break-words text-sm leading-relaxed text-muted">
                        {review.comment?.trim() || "من غير تعليق"}
                    </span>
                </span>
            </button>

            <div className="flex shrink-0 items-center gap-1 self-end sm:self-start">
                {review.status !== "approved" && (
                    <Button variant="secondary" size="sm" className="h-10 sm:h-8" onClick={() => onAction(review, "approve")} disabled={busy}>
                        {busy ? <Spinner className="size-4" /> : <Eye />}
                        إظهار
                    </Button>
                )}
                {review.status === "pending" && (
                    <Button variant="secondary" size="sm" className="h-10 sm:h-8" onClick={() => onAction(review, "hide")} disabled={busy}>
                        <EyeOff /> إخفاء
                    </Button>
                )}
                <RowMenu label={`إجراءات رأي ${author}`}>
                    {(close) => (
                        <>
                            {review.status === "approved" && (
                                <>
                                    <MenuItem
                                        onClick={() => {
                                            close();
                                            if (!busy) onAction(review, "hide");
                                        }}
                                    >
                                        <EyeOff /> إخفاء من الموقع
                                    </MenuItem>
                                    <MenuDivider />
                                </>
                            )}
                            <MenuItem
                                danger
                                onClick={() => {
                                    close();
                                    if (!busy) onAction(review, "delete");
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
