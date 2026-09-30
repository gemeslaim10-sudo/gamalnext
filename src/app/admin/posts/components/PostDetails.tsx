"use client";

import { Ban, Check, Trash2, UserRound } from "lucide-react";
import { Avatar, Badge, Button, ButtonLink, FadeImg, Modal, Spinner } from "@/components/ui";
import { sizedImage } from "@/components/admin/kit/list";
import { formatDate } from "@/components/admin/kit/listData";
import { POST_STATUS, postAuthor, postImages, type PostRow, type PostStatus } from "../postData";
import type { PostAction } from "./PostRow";

interface PostDetailsProps {
    /** The post last opened (kept while the window closes) */
    post: PostRow | null;
    open: boolean;
    busy: boolean;
    onClose: () => void;
    onAction: (post: PostRow, action: PostAction) => void;
}

/** The whole post (text and images) with its actions — nothing more is read for it. */
export function PostDetails({ post, open, busy, onClose, onAction }: PostDetailsProps) {
    const status = post?.status && post.status in POST_STATUS ? POST_STATUS[post.status as PostStatus] : null;
    const images = post ? postImages(post) : [];

    return (
        <Modal open={open && Boolean(post)} onClose={onClose} title="المنشور" size="lg">
            {post && (
                <>
                    <div className="space-y-4 p-5">
                        <div className="flex items-center gap-3">
                            <Avatar src={post.userPhoto} alt="" size={44} />
                            <div className="min-w-0 flex-1">
                                <p dir="auto" className="truncate text-sm font-medium text-foreground">
                                    {postAuthor(post)}
                                </p>
                            </div>
                            {status && <Badge variant={status.variant}>{status.label}</Badge>}
                        </div>

                        {formatDate(post.createdAt) && <p className="text-xs text-subtle">{formatDate(post.createdAt, true)}</p>}

                        {post.content?.trim() ? (
                            <p dir="auto" className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
                                {post.content}
                            </p>
                        ) : (
                            <p className="text-sm text-subtle">منشور من غير كلام.</p>
                        )}

                        {images.length > 0 && (
                            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {images.map((url, index) => (
                                    <li key={`${url}-${index}`}>
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block aspect-square overflow-hidden rounded-control border border-border bg-surface-hover"
                                        >
                                            <FadeImg
                                                src={sizedImage(url, 480)}
                                                alt={`صورة ${index + 1} من ${images.length}`}
                                                loading="lazy"
                                                decoding="async"
                                                referrerPolicy="no-referrer"
                                                className="size-full object-cover"
                                            />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 border-t border-border px-5 py-4">
                        {post.userId && (
                            <ButtonLink href={`/admin/users/${post.userId}`} variant="ghost" size="sm" className="h-10 sm:h-8 me-auto">
                                <UserRound /> صفحة العضو
                            </ButtonLink>
                        )}
                        <div className="ms-auto flex flex-wrap items-center gap-2">
                            {post.status !== "approved" && (
                                <Button variant="secondary" size="sm" className="h-10 sm:h-8" onClick={() => onAction(post, "approve")} disabled={busy}>
                                    {busy ? <Spinner className="size-4" /> : <Check />}
                                    نشر
                                </Button>
                            )}
                            {post.status !== "rejected" && (
                                <Button variant="secondary" size="sm" className="h-10 sm:h-8" onClick={() => onAction(post, "reject")} disabled={busy}>
                                    <Ban /> رفض
                                </Button>
                            )}
                            <Button variant="danger" size="sm" className="h-10 sm:h-8" onClick={() => onAction(post, "delete")} disabled={busy}>
                                <Trash2 /> حذف
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Modal>
    );
}
