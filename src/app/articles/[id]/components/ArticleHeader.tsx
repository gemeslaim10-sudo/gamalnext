import Link from "next/link";
import { BackLink } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";

interface ArticleHeaderProps {
    title: string;
    authorId?: string;
    authorName?: string;
    formattedDate: string;
    /** ISO date for the <time> element */
    isoDate?: string;
    contentDir: "rtl" | "ltr";
}

export function ArticleHeader({ title, authorId, authorName, formattedDate, isoDate, contentDir }: ArticleHeaderProps) {
    const t = useCopy();

    return (
        <>
            <BackLink href="/articles">{t("blog.backToBlog")}</BackLink>

            <header dir={contentDir}>
                <h1 className="break-words text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
                    {title}
                </h1>
                <p className="mt-3 text-sm text-subtle">
                    {authorName && (
                        <>
                            {authorId ? (
                                <Link href={`/users/${authorId}`} className="transition-colors hover:text-foreground">
                                    {authorName}
                                </Link>
                            ) : (
                                authorName
                            )}
                            <span aria-hidden className="mx-2">
                                ·
                            </span>
                        </>
                    )}
                    <time dateTime={isoDate}>{formattedDate}</time>
                </p>
            </header>
        </>
    );
}
