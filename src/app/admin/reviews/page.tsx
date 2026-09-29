"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { refreshSite } from "@/lib/refreshSite";
import { Check, Trash2, Star, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import type { FirebaseTimestamp } from "@/types";
import { Badge, Button, Card, EmptyState, PageHeader } from "@/components/ui";
import { cn } from "@/lib/utils";

type Review = {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'hidden';
    createdAt: FirebaseTimestamp;
}

const STATUS_BADGE = {
    approved: "success",
    pending: "warning",
    hidden: "neutral",
} as const;

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(50));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
            setReviews(data);
        });
        return () => unsubscribe();
    }, []);

    const updateStatus = async (id: string, status: 'approved' | 'hidden') => {
        try {
            await updateDoc(doc(db, "reviews", id), { status });
            void refreshSite();
            toast.success(`Review ${status}`);
        } catch {
            toast.error("Error updating status");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this review?")) {
            try {
                await deleteDoc(doc(db, "reviews", id));
                void refreshSite();
                toast.success("Review deleted");
            } catch {
                toast.error("Error deleting review");
            }
        }
    };

    return (
        <>
            <PageHeader title="Manage Reviews" description="Approve client reviews before they appear on the site, or hide them later." />

            {reviews.length === 0 ? (
                <EmptyState title="No reviews found." />
            ) : (
                <Card padding="none" className="overflow-hidden">
                    <ul className="divide-y divide-border">
                        {reviews.map((review) => (
                            <li key={review.id} className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-start md:justify-between md:gap-6">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <h3 className="text-sm font-medium text-foreground">{review.userName}</h3>
                                        <div className="flex gap-0.5" role="img" aria-label={`${review.rating} out of 5`}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    aria-hidden
                                                    className={cn("size-3.5", i < review.rating ? "fill-current text-foreground" : "text-border-strong")}
                                                />
                                            ))}
                                        </div>
                                        <Badge variant={STATUS_BADGE[review.status] ?? "neutral"} className="capitalize">
                                            {review.status}
                                        </Badge>
                                    </div>
                                    <p dir="auto" className="mt-2 line-clamp-4 break-words text-sm leading-relaxed text-muted">&quot;{review.comment}&quot;</p>
                                </div>

                                <div className="flex shrink-0 items-center justify-end gap-2">
                                    {review.status !== 'approved' && (
                                        <Button variant="secondary" size="sm" onClick={() => updateStatus(review.id, 'approved')}>
                                            <Check /> Approve
                                        </Button>
                                    )}
                                    {review.status === 'approved' && (
                                        <Button variant="secondary" size="sm" onClick={() => updateStatus(review.id, 'hidden')}>
                                            <EyeOff /> Hide
                                        </Button>
                                    )}
                                    <Button
                                        variant="danger"
                                        size="icon-sm"
                                        onClick={() => handleDelete(review.id)}
                                        aria-label={`Delete review by ${review.userName}`}
                                        title="Delete"
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}
        </>
    );
}
