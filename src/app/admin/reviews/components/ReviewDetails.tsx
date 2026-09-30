"use client";

import { Eye, EyeOff, Trash2, UserRound } from "lucide-react";
import { Avatar, Badge, Button, ButtonLink, Modal, Spinner } from "@/components/ui";
import { formatDate } from "@/components/admin/kit/listData";
import { REVIEW_STATUS, reviewAuthor, reviewRating, type ReviewRow, type ReviewStatus } from "../reviewData";
import { Stars, type ReviewAction } from "./ReviewRow";

interface ReviewDetailsProps {
    /** The review last opened (kept while the window closes) */
    review: ReviewRow | null;
    open: boolean;
    busy: boolean;
    onClose: () => void;
    onAction: (review: ReviewRow, action: ReviewAction) => void;
}

/** The whole review with its actions — nothing more is read for it. */
export function ReviewDetails({ review, open, busy, onClose, onAction }: ReviewDetailsProps) {
    const status = review?.status && review.status in REVIEW_STATUS ? REVIEW_STATUS[review.status as ReviewStatus] : null;

    return (
        <Modal open={open && Boolean(review)} onClose={onClose} title="رأي العميل">
            {review && (
                <>
                    <div className="space-y-4 p-5">
                        <div className="flex items-center gap-3">
                            <Avatar src={review.userImage} alt="" size={44} />
                            <div className="min-w-0 flex-1">
                                <p dir="auto" className="truncate text-sm font-medium text-foreground">
                                    {reviewAuthor(review)}
                                </p>
                                <Stars rating={reviewRating(review)} className="mt-1" />
                            </div>
                            {status && <Badge variant={status.variant}>{status.label}</Badge>}
                        </div>

                        {formatDate(review.createdAt) && <p className="text-xs text-subtle">{formatDate(review.createdAt, true)}</p>}

                        {review.comment?.trim() ? (
                            <p dir="auto" className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
                                {review.comment}
                            </p>
                        ) : (
                            <p className="text-sm text-subtle">من غير تعليق.</p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 border-t border-border px-5 py-4">
                        {review.userId && (
                            <ButtonLink href={`/admin/users/${review.userId}`} variant="ghost" size="sm" className="h-10 sm:h-8 me-auto">
                                <UserRound /> صفحة العضو
                            </ButtonLink>
                        )}
                        <div className="ms-auto flex flex-wrap items-center gap-2">
                            {review.status !== "approved" && (
                                <Button variant="secondary" size="sm" className="h-10 sm:h-8" onClick={() => onAction(review, "approve")} disabled={busy}>
                                    {busy ? <Spinner className="size-4" /> : <Eye />}
                                    إظهار
                                </Button>
                            )}
                            {review.status !== "hidden" && (
                                <Button variant="secondary" size="sm" className="h-10 sm:h-8" onClick={() => onAction(review, "hide")} disabled={busy}>
                                    <EyeOff /> إخفاء
                                </Button>
                            )}
                            <Button variant="danger" size="sm" className="h-10 sm:h-8" onClick={() => onAction(review, "delete")} disabled={busy}>
                                <Trash2 /> حذف
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Modal>
    );
}
