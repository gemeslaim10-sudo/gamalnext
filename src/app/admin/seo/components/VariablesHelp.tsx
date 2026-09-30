import { ChevronDown } from "lucide-react";
import type { SeoVars } from "../seoEditor";

interface VariablesHelpProps {
    vars: SeoVars;
    /** Also explains {title} (only the title pattern uses it) */
    withTitle?: boolean;
}

/** The placeholders every SEO text may use, with their current values. Folded by default. */
export function VariablesHelp({ vars, withTitle }: VariablesHelpProps) {
    const rows: { token: string; meaning: string; value?: string; showValue: boolean }[] = [
        { token: "{siteName}", meaning: "اسم الموقع من «إعدادات الموقع»", value: vars.siteName, showValue: true },
        { token: "{ownerName}", meaning: "اسم المؤسس من «النشاط التجاري»، ولو فاضي من الإعدادات", value: vars.ownerName, showValue: true },
        { token: "{phone}", meaning: "رقم التليفون من «النشاط التجاري»، ولو فاضي من الإعدادات", value: vars.phone, showValue: true },
        { token: "{city}", meaning: "المدينة من «النشاط التجاري»", value: vars.city, showValue: true },
        ...(withTitle ? [{ token: "{title}", meaning: "عنوان الصفحة نفسها، في «نمط عنوان الصفحات» بس", showValue: false }] : []),
    ];

    return (
        <details className="group rounded-card border border-border bg-surface">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                المتغيرات اللي تقدر تكتبها في النصوص
                <ChevronDown aria-hidden className="size-4 shrink-0 text-subtle transition-transform duration-(--motion-fast) group-open:rotate-180" />
            </summary>
            <div className="border-t border-border px-4 py-4">
                <p className="mb-3 text-xs leading-relaxed text-subtle">
                    اكتب أي واحد منهم في النص والموقع بيحط مكانه القيمة الحالية، فلو غيّرت رقمك مثلًا بيتغيّر في كل مكان.
                </p>
                <dl className="divide-y divide-border rounded-control border border-border text-sm">
                    {rows.map((row) => (
                        <div key={row.token} className="flex flex-col gap-1 px-3 py-2.5 sm:flex-row sm:items-baseline sm:gap-4">
                            <dt className="shrink-0 sm:w-28">
                                <code dir="ltr" className="rounded-control bg-surface-hover px-1.5 py-0.5 text-xs text-foreground">
                                    {row.token}
                                </code>
                            </dt>
                            <dd className="min-w-0 text-muted">
                                {row.meaning}
                                {row.showValue && (
                                    <>
                                        {" — "}
                                        {row.value === undefined ? (
                                            <span className="text-subtle">مش معروف دلوقتي</span>
                                        ) : row.value ? (
                                            <bdi className="text-foreground">{row.value}</bdi>
                                        ) : (
                                            <span className="text-subtle">فاضي، فبيتشال من النص</span>
                                        )}
                                    </>
                                )}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </details>
    );
}
