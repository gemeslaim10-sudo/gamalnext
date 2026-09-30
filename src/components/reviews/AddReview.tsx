'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCopy } from '@/components/providers/CopyProvider';
import { loadFirestore } from '@/lib/firebase-app';
import { reportEvent } from '@/lib/reportEvent';
import { Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Card, Field, Skeleton, Textarea } from '@/components/ui';
import { cn } from '@/lib/utils';

/**
 * Review form on the profile page. The security rules only accept reviews from signed-in members
 * (with `userId` = their uid), so visitors get a log in prompt instead of a form that can't be sent.
 * Every text is editable in /admin/copy → Profile page.
 */
export default function AddReview({ onAdded }: { onAdded?: () => void }) {
    const { user, loading: authLoading } = useAuth();
    const t = useCopy();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (!comment.trim()) {
            setError(t("profile.reviewCommentRequired"));
            return;
        }

        setLoading(true);
        try {
            const { db, addDoc, collection, serverTimestamp } = await loadFirestore();
            const reviewRef = await addDoc(collection(db, "reviews"), {
                uid: user.uid,
                userId: user.uid, // required by the reviews security rule
                userName: user.displayName || t("profile.reviewAnonymous"),
                userImage: user.photoURL || "",
                rating,
                comment: comment.trim(),
                status: "pending", // Default pending approval
                createdAt: serverTimestamp(),
                isGuest: false
            });
            // Waiting for approval: the owner can get an email about it
            reportEvent({ event: "review.pending", id: reviewRef.id });
            toast.success(t("profile.reviewSuccess"));
            setComment("");
            setRating(5);
            if (onAdded) onAdded();
        } catch (e) {
            toast.error(t("profile.reviewFailed"));
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card padding="lg" className="max-w-content">
            <h3 className="text-base font-semibold text-foreground">{t("profile.reviewFormTitle")}</h3>

            {authLoading ? (
                // Signed-in state is only known in the browser; a quiet placeholder avoids flashing the wrong view
                <Skeleton className="mt-4 h-10" />
            ) : !user ? (
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-relaxed text-muted">{t("profile.reviewLoginText")}</p>
                    {/* The navbar owns the sign-in dialog and opens it on this event */}
                    <Button
                        variant="secondary"
                        onClick={() => document.dispatchEvent(new CustomEvent("open-auth-modal"))}
                        className="shrink-0 self-start sm:self-auto"
                    >
                        {t("profile.reviewLoginButton")}
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-5">
                    <fieldset>
                        <legend className="text-sm font-medium text-foreground">{t("profile.reviewRating")}</legend>
                        <div className="mt-1.5 flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    aria-label={`Rate ${star} out of 5`}
                                    aria-pressed={rating === star}
                                    className="flex size-10 items-center justify-center rounded-control transition-colors hover:bg-surface-hover"
                                >
                                    <Star
                                        aria-hidden
                                        className={cn('size-6', rating >= star ? 'fill-current text-foreground' : 'text-subtle')}
                                    />
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    <Field label={t("profile.reviewComment")} htmlFor="review-comment" error={error}>
                        <Textarea
                            id="review-comment"
                            value={comment}
                            onChange={(e) => {
                                setComment(e.target.value);
                                if (error) setError("");
                            }}
                            aria-required
                            aria-invalid={Boolean(error)}
                            rows={4}
                            dir="auto"
                            className="resize-y"
                            placeholder={t("profile.reviewCommentPlaceholder")}
                        />
                    </Field>

                    <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                        {loading ? t("profile.reviewSubmitting") : t("profile.reviewSubmit")}
                    </Button>
                </form>
            )}
        </Card>
    );
}
