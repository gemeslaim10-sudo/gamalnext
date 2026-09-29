"use client";

import { Alert, Button, Card, Skeleton, Spinner } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";

export function FeedSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((n) => (
                <Card key={n} padding="none" className="overflow-hidden">
                    <div className="flex items-center gap-3 p-4 sm:p-5">
                        <Skeleton className="size-9 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-3.5 w-1/3" />
                            <Skeleton className="h-3 w-1/4" />
                        </div>
                    </div>
                    <div className="space-y-2 px-4 pb-4 sm:px-5">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-3.5 w-full" />
                        <Skeleton className="h-3.5 w-5/6" />
                    </div>
                    <Skeleton className="aspect-video rounded-none" />
                </Card>
            ))}
        </div>
    );
}

export function FeedErrorBanner({ error, onRetry }: { error: string; onRetry: () => void }) {
    const t = useCopy();
    return (
        <Alert variant="danger" className="flex flex-wrap items-center justify-between gap-3">
            <span className="min-w-0">
                <span className="font-medium">{t("home.feedError")}</span>{" "}
                <span className="break-words opacity-80">{error}</span>
            </span>
            <Button variant="secondary" size="sm" onClick={onRetry}>
                {t("home.retry")}
            </Button>
        </Alert>
    );
}

export function FeedEndMessage() {
    const t = useCopy();
    return <p className="py-8 text-center text-sm text-subtle">{t("home.feedEnd")}</p>;
}

export function FeedLoadingSpinner() {
    return (
        <div className="flex justify-center py-6">
            <Spinner />
        </div>
    );
}
