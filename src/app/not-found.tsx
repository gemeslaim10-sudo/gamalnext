import type { Metadata } from 'next';
import { ButtonLink, Page } from '@/components/ui';
import { getCopy } from '@/lib/copy/server';
import { GoBackButton } from './_components/GoBackButton';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getCopy();
    // Replaces the site-wide "index, follow" so it doesn't contradict the noindex Next.js adds to 404s
    return { title: t("errors.notFoundSeoTitle"), robots: { index: false, follow: true } };
}

export default async function NotFound() {
    const t = await getCopy();
    return (
        <Page className="flex flex-col items-center py-20 text-center sm:py-28">
            <p className="text-sm font-medium text-subtle">{t("errors.notFoundCode")}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{t("errors.notFoundTitle")}</h1>
            <p className="mt-3 max-w-md text-muted">{t("errors.notFoundText")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
                <ButtonLink href="/">{t("errors.notFoundHome")}</ButtonLink>
                <GoBackButton>{t("errors.notFoundBack")}</GoBackButton>
            </div>
        </Page>
    );
}
