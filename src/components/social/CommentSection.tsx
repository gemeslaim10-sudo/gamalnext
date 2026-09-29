"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { ALLOWED_ADMINS } from "@/lib/constants";
import { useComments } from "./hooks/useComments";
import { useCopy } from "@/components/providers/CopyProvider";
import { Avatar, Button, Skeleton, Spinner, Textarea } from "@/components/ui";

const formatCommentDate = (createdAt?: { toDate?: () => Date }) =>
    createdAt?.toDate ? createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;

export default function CommentSection({ articleId }: { articleId: string }) {
    const t = useCopy();
    const {
        user,
        comments,
        loading,
        newComment,
        setNewComment,
        submitting,
        handleSubmit,
        handleDelete
    } = useComments(articleId);

    return (
        <section>
            <h3 className="text-base font-semibold text-foreground">
                {t("blog.commentsTitle")}
                {/* The count appears once the comments have loaded, never a placeholder 0 */}
                {!loading && <span className="ml-1 font-normal text-subtle">{comments.length}</span>}
            </h3>

            {/* Input */}
            {user ? (
                <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
                    <Avatar src={user.photoURL} alt={user.displayName || "User"} size={28} className="mt-1.5" />
                    <div className="min-w-0 flex-1">
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={t("blog.commentPlaceholder")}
                            aria-label="Write a comment"
                            dir="auto"
                            rows={3}
                            className="min-h-20 resize-y"
                            required
                        />
                        <div className="mt-2 flex justify-end">
                            <Button type="submit" size="sm" disabled={submitting}>
                                {submitting && <Spinner className="size-4 text-primary-foreground" />}
                                {t("blog.commentPost")}
                            </Button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mt-4 flex flex-col gap-3 rounded-card border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{t("blog.commentJoinTitle")}</p>
                        <p className="mt-0.5 text-sm text-muted">{t("blog.commentJoinText")}</p>
                    </div>
                    {/* The navbar owns the sign-in dialog and opens it on this event */}
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => document.dispatchEvent(new CustomEvent("open-auth-modal"))}
                        className="shrink-0 self-start sm:self-auto"
                    >
                        {t("blog.commentLogin")}
                    </Button>
                </div>
            )}

            {/* List */}
            {loading ? (
                <ul aria-hidden className="mt-6 space-y-5">
                    {[0, 1].map((i) => (
                        <li key={i} className="flex gap-3">
                            <Skeleton className="size-7 shrink-0 rounded-full" />
                            <div className="flex-1 space-y-2 pt-1">
                                <Skeleton className="h-3 w-32" />
                                <Skeleton className="h-3 w-4/5" />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                comments.length > 0 && (
                    <ul className="mt-6 divide-y divide-border">
                        {comments.map((comment) => (
                            <li key={comment.id} className="flex animate-fade-in gap-3 py-4 first:pt-0 last:pb-0">
                                <Link href={`/users/${comment.userId}`} className="mt-0.5 shrink-0 rounded-full">
                                    <Avatar src={comment.userPhoto} alt={comment.userName} size={28} />
                                </Link>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/users/${comment.userId}`}
                                            className="min-w-0 truncate text-sm font-medium text-foreground hover:underline hover:underline-offset-4"
                                        >
                                            {comment.userName}
                                        </Link>
                                        <span className="shrink-0 text-xs text-subtle">
                                            {formatCommentDate(comment.createdAt) ?? t("blog.commentJustNow")}
                                        </span>
                                        {user && (user.uid === comment.userId || ALLOWED_ADMINS.includes(user.email || "")) && (
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => handleDelete(comment.id)}
                                                aria-label={t("blog.commentDeleteTooltip")}
                                                title={t("blog.commentDeleteTooltip")}
                                                className="-my-1.5 ml-auto hover:bg-danger/10 hover:text-danger"
                                            >
                                                <Trash2 />
                                            </Button>
                                        )}
                                    </div>
                                    <p dir="auto" className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-muted">
                                        {comment.content}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )
            )}
        </section>
    );
}
