"use client";

import { toast } from "react-hot-toast";
import { loadFirestore } from "@/lib/firebase-app";
import { refreshSite } from "@/lib/refreshSite";
import { refreshAdminCounts, type AdminListOptions } from "@/components/admin/kit";
import { invalidateCounts, type CountFilter } from "@/components/admin/kit/listData";
import type { FirebaseTimestamp } from "@/types";

/** A member's post on the home feed, as stored. */
export interface PostDoc {
    userId?: string;
    userName?: string;
    userPhoto?: string | null;
    content?: string;
    mediaUrl?: string | null;
    gallery?: string[];
    status?: string;
    createdAt?: FirebaseTimestamp;
}

export type PostRow = PostDoc & { id: string };

export const POST_TABS = ["pending", "approved", "rejected"] as const;
export type PostStatus = (typeof POST_TABS)[number];

export const POST_STATUS: Record<PostStatus, { tab: string; label: string; variant: "warning" | "success" | "danger" }> = {
    pending: { tab: "مستني المراجعة", label: "مستني المراجعة", variant: "warning" },
    approved: { tab: "منشور", label: "منشور", variant: "success" },
    rejected: { tab: "مرفوض", label: "مرفوض", variant: "danger" },
};

// Status filter + newest first (the posts collection has the index for this)
export const POST_LISTS: Record<PostStatus, AdminListOptions> = {
    pending: { where: { status: "pending" } },
    approved: { where: { status: "approved" } },
    rejected: { where: { status: "rejected" } },
};

export const POST_COUNTS: Record<PostStatus, CountFilter> = {
    pending: { status: "pending" },
    approved: { status: "approved" },
    rejected: { status: "rejected" },
};

export const postAuthor = (post: PostDoc) => post.userName?.trim() || "عضو";

/** The post's images (older posts have one `mediaUrl` and no gallery). */
export function postImages(post: PostDoc): string[] {
    const gallery = Array.isArray(post.gallery) ? post.gallery.filter((url) => typeof url === "string" && url) : [];
    if (gallery.length > 0) return gallery;
    return post.mediaUrl ? [post.mediaUrl] : [];
}

/** After any change: refresh the cached home feed (a post has no page of its own), the menu counters and the tab totals. */
function afterPostChange(postId: string) {
    void refreshSite({ postId }).then((ok) => {
        if (!ok) toast("اتحفظ، بس الموقع لسه ما اتحدّثش. لو التغيير ما ظهرش دوس «تفريغ الكاش» في الرئيسية.");
    });
    void refreshAdminCounts();
    invalidateCounts("posts");
}

export async function setPostStatus(postId: string, status: "approved" | "rejected") {
    const { db, doc, updateDoc } = await loadFirestore();
    await updateDoc(doc(db, "posts", postId), { status });
    afterPostChange(postId);
}

export async function deletePost(postId: string) {
    const { db, doc, deleteDoc } = await loadFirestore();
    await deleteDoc(doc(db, "posts", postId));
    afterPostChange(postId);
}
