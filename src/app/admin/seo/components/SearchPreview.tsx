import Image from "next/image";
import { DESCRIPTION_LIMIT, SITE_HOST, TITLE_LIMIT, textLength } from "../seoEditor";

interface SearchPreviewProps {
    /** Page path, e.g. "/pricing" */
    path: string;
    /** Final title, placeholders already filled */
    title: string;
    description: string;
    siteName: string;
}

/** Cuts the text where Google roughly would. */
function clip(text: string, limit: number) {
    const chars = Array.from(text);
    return chars.length > limit ? `${chars.slice(0, limit).join("").trimEnd()}…` : text;
}

/** How the page roughly looks in Google results, with length counters. */
export function SearchPreview({ path, title, description, siteName }: SearchPreviewProps) {
    const crumbs = [SITE_HOST, ...path.split("/").filter(Boolean)].join(" › ");

    return (
        <div className="space-y-2">
            <div role="group" aria-label="معاينة النتيجة في جوجل" dir="ltr" className="rounded-control border border-border bg-background p-3 sm:p-4">
                <div className="flex min-w-0 items-center gap-2.5">
                    <Image
                        src="/icon.png"
                        alt=""
                        width={24}
                        height={24}
                        className="size-6 shrink-0 rounded-full border border-border bg-surface-hover"
                    />
                    <div className="min-w-0 leading-tight">
                        <p dir="auto" className="truncate text-sm text-foreground">
                            {siteName}
                        </p>
                        <p dir="ltr" className="truncate text-xs text-subtle">
                            {crumbs}
                        </p>
                    </div>
                </div>
                <p dir="auto" className="mt-2 break-words text-lg leading-snug text-foreground">
                    {clip(title, TITLE_LIMIT) || "بدون عنوان"}
                </p>
                <p dir="auto" className="mt-1 break-words text-sm leading-relaxed text-muted">
                    {clip(description, DESCRIPTION_LIMIT) || "بدون وصف"}
                </p>
            </div>
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                <Counter label="العنوان" length={textLength(title)} limit={TITLE_LIMIT} />
                <Counter label="الوصف" length={textLength(description)} limit={DESCRIPTION_LIMIT} />
            </p>
        </div>
    );
}

function Counter({ label, length, limit }: { label: string; length: number; limit: number }) {
    const tooLong = length > limit;
    return (
        <span className={tooLong ? "text-warning" : "text-subtle"}>
            {label}: <span className="tabular-nums">{`${length}/${limit}`}</span> حرف
            {tooLong && " — أطول من اللازم، وجوجل هيقصّ الباقي"}
        </span>
    );
}
