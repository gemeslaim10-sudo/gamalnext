"use client";

import { toast } from "react-hot-toast";
import { loadFirestore } from "@/lib/firebase-app";
import { refreshSite } from "@/lib/refreshSite";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { refreshAdminCounts, type AdminListOptions } from "@/components/admin/kit";
import { invalidateCounts, type CountFilter } from "@/components/admin/kit/listData";
import type { FirebaseTimestamp } from "@/types";

/** A client review, as stored. */
export interface ReviewDoc {
    userId?: string;
    userName?: string;
    userImage?: string;
    rating?: number;
    comment?: string;
    status?: string;
    createdAt?: FirebaseTimestamp;
}

export type ReviewRow = ReviewDoc & { id: string };

export const REVIEW_TABS = ["pending", "approved", "hidden"] as const;
export type ReviewStatus = (typeof REVIEW_TABS)[number];

export const REVIEW_STATUS: Record<ReviewStatus, { tab: string; label: string; variant: "warning" | "success" | "neutral" }> = {
    pending: { tab: "مستني المراجعة", label: "مستني المراجعة", variant: "warning" },
    approved: { tab: "ظاهر", label: "ظاهر على الموقع", variant: "success" },
    hidden: { tab: "مخفي", label: "مخفي", variant: "neutral" },
};

// Status filter + newest first (the reviews collection has the index for this)
export const REVIEW_LISTS: Record<ReviewStatus, AdminListOptions> = {
    pending: { where: { status: "pending" } },
    approved: { where: { status: "approved" } },
    hidden: { where: { status: "hidden" } },
};

export const REVIEW_COUNTS: Record<ReviewStatus, CountFilter> = {
    pending: { status: "pending" },
    approved: { status: "approved" },
    hidden: { status: "hidden" },
};

export const reviewAuthor = (review: ReviewDoc) => review.userName?.trim() || "عميل";

/** 0–5 whole stars. */
export const reviewRating = (review: ReviewDoc) => Math.max(0, Math.min(5, Math.round(Number(review.rating) || 0)));

/** After any change: refresh the reviews on the site (the only place they're shown), the menu counters and the tab totals. */
function afterReviewChange() {
    void refreshSite({ tags: [CACHE_TAGS.reviews] }).then((ok) => {
        if (!ok) toast("اتحفظ، بس الموقع لسه ما اتحدّثش. لو التغيير ما ظهرش دوس «تفريغ الكاش» في الرئيسية.");
    });
    void refreshAdminCounts();
    invalidateCounts("reviews");
}

export async function setReviewStatus(reviewId: string, status: "approved" | "hidden") {
    const { db, doc, updateDoc } = await loadFirestore();
    await updateDoc(doc(db, "reviews", reviewId), { status });
    afterReviewChange();
}

export async function deleteReview(reviewId: string) {
    const { db, doc, deleteDoc } = await loadFirestore();
    await deleteDoc(doc(db, "reviews", reviewId));
    afterReviewChange();
}
