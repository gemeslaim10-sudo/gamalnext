import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { Star } from "lucide-react";
import { db } from "@/lib/firebase";
import { Card, Section } from "@/components/ui";
import { getCopy } from "@/lib/copy/server";
import { cn } from "@/lib/utils";
import { formatTimestamp, getTimestampMs } from "@/types";
import type { Review } from "@/types";
import AddReview from "./AddReview";

async function getReviews() {
    try {
        const q = query(
            collection(db, "reviews"),
            where("status", "==", "approved"),
            orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Serialize timestamps if needed, though they pass fine to client components in Server Actions usually,
            // but for props passing we might need simple JSON types or ensure the client handles the detailed object.
            // For safety with Firestore timestamps passing to Client Component:
            createdAt: doc.data().createdAt?.seconds ? doc.data().createdAt.seconds * 1000 : Date.now()
        } as Review));
    } catch (e) {
        console.error("Error fetching reviews:", e);
        return [];
    }
}

/** Approved reviews + the review form. Texts: /admin/copy → Profile page; reviews are moderated in /admin/reviews. */
export default async function Reviews() {
    const [reviews, t] = await Promise.all([getReviews(), getCopy()]);

    return (
        <Section
            id="reviews"
            title={t("profile.reviewsTitle")}
            description={reviews.length === 0 ? t("profile.reviewsEmpty") : undefined}
        >
            {reviews.length > 0 && (
                <ul className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {reviews.map((review) => (
                        <li key={review.id}>
                            <ReviewCard review={review} />
                        </li>
                    ))}
                </ul>
            )}
            <AddReview />
        </Section>
    );
}

function ReviewCard({ review }: { review: Review }) {
    const date = formatTimestamp(review.createdAt);
    const ms = getTimestampMs(review.createdAt);

    return (
        <Card className="reveal flex h-full flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
                <p dir="auto" className="min-w-0 break-words text-sm font-semibold text-foreground">
                    {review.userName}
                </p>
                <Stars rating={review.rating} />
            </div>
            <p dir="auto" className="whitespace-pre-line break-words text-sm leading-relaxed text-muted">
                {review.comment}
            </p>
            {date && (
                <time dateTime={ms ? new Date(ms).toISOString() : undefined} className="mt-auto text-xs text-subtle">
                    {date}
                </time>
            )}
        </Card>
    );
}

function Stars({ rating }: { rating: number }) {
    const value = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    return (
        <div role="img" aria-label={`Rated ${value} out of 5`} className="flex shrink-0 items-center gap-0.5 pt-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    aria-hidden
                    className={cn("size-3.5", n <= value ? "fill-current text-foreground" : "text-subtle")}
                />
            ))}
        </div>
    );
}
