"use client";

import { Ban, Check, Trash2 } from "lucide-react";
import { Avatar, Button, MenuDivider, MenuItem, Spinner } from "@/components/ui";
import { cn } from "@/lib/utils";
import { RowMenu, Thumb } from "@/components/admin/kit/list";
import { formatDate } from "@/components/admin/kit/listData";
import { postAuthor, postImages, type PostRow } from "../postData";

export type PostAction = "approve" | "reject" | "delete";

interface PostRowItemProps {
    post: PostRow;
    busy: boolean;
    onOpen: (post: PostRow) => void;
    onAction: (post: PostRow, action: PostAction) => void;
}

/** One post: opens the full post; approve / reject / delete from the row. */
export function PostRowItem({ post, busy, onOpen, onAction }: PostRowItemProps) {
    const author = postAuthor(post);
    const images = postImages(post);
    const date = formatDate(post.createdAt);
    const canApprove = post.status !== "approved";
    const canReject = post.status !== "rejected";

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
                onClick={() => onOpen(post)}
                aria-label={`عرض منشور ${author}`}
                className="group flex min-w-0 flex-1 items-start gap-3 rounded-control text-start"
            >
                <Avatar src={post.userPhoto} alt="" size={40} />
                <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span dir="auto" className="max-w-full truncate text-sm font-medium text-foreground underline-offset-4 group-hover:underline">
                            {author}
                        </span>
                        {date && <span className="text-xs text-subtle">{date}</span>}
                    </span>
                    <span dir="auto" className="mt-1 line-clamp-2 block whitespace-pre-line break-words text-sm leading-relaxed text-muted">
                        {post.content?.trim() || "منشور من غير كلام"}
                    </span>
                    {images.length > 0 && (
                        <span className="mt-2 flex items-center gap-1.5">
                            {images.slice(0, 3).map((url, index) => (
                                <Thumb key={`${url}-${index}`} src={url} className="size-12" />
                            ))}
                            {images.length > 3 && <span className="text-xs text-subtle">+{images.length - 3}</span>}
                        </span>
                    )}
                </span>
            </button>

            <div className="flex shrink-0 items-center gap-1 self-end sm:self-start">
                {canApprove && (
                    <Button variant="secondary" size="sm" className="h-10 sm:h-8" onClick={() => onAction(post, "approve")} disabled={busy}>
                        {busy ? <Spinner className="size-4" /> : <Check />}
                        نشر
                    </Button>
                )}
                {post.status === "pending" && (
                    <Button variant="secondary" size="sm" className="h-10 sm:h-8" onClick={() => onAction(post, "reject")} disabled={busy}>
                        <Ban /> رفض
                    </Button>
                )}
                <RowMenu label={`إجراءات منشور ${author}`}>
                    {(close) => (
                        <>
                            {canReject && post.status !== "pending" && (
                                <>
                                    <MenuItem
                                        onClick={() => {
                                            close();
                                            if (!busy) onAction(post, "reject");
                                        }}
                                    >
                                        <Ban /> رفض (يختفي من الصفحة)
                                    </MenuItem>
                                    <MenuDivider />
                                </>
                            )}
                            <MenuItem
                                danger
                                onClick={() => {
                                    close();
                                    if (!busy) onAction(post, "delete");
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
