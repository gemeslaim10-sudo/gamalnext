'use client';

import { useEffect } from 'react';
import { Button, ButtonLink, Page } from '@/components/ui';
import { useCopy } from '@/components/providers/CopyProvider';

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useCopy();

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <Page className="flex flex-col items-center py-20 text-center sm:py-28">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{t("errors.errorTitle")}</h1>
            <p className="mt-3 max-w-md text-muted">{t("errors.errorText")}</p>

            <code className="mt-6 block max-h-32 w-full max-w-md overflow-auto rounded-control border border-border bg-surface px-4 py-3 text-left font-mono text-xs break-words text-subtle" dir="ltr">
                {error.message || t("errors.errorUnknown")}
            </code>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
                <ButtonLink href="/">{t("errors.errorHome")}</ButtonLink>
                <Button variant="secondary" onClick={() => reset()}>
                    {t("errors.errorRetry")}
                </Button>
            </div>
        </Page>
    );
}
