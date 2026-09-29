import { Badge, Card } from "@/components/ui";
import { SPEC_KEYS, type PricingItem, type PricingLabels } from "@/lib/pricing/types";
import { fixedPrice, formatAmount } from "@/lib/pricing/utils";
import { cn } from "@/lib/utils";
import { RequestButton } from "./RequestButton";

interface PricingItemCardProps {
    item: PricingItem;
    labels: PricingLabels;
    /** Show the "custom quote" label where the price would be (packages). Services omit it: their button says it. */
    showQuoteLabel?: boolean;
}

/** One package or service: name, price, short note, spec list and a request button. */
export function PricingItemCard({ item, labels, showQuoteLabel = true }: PricingItemCardProps) {
    const price = fixedPrice(item);
    const currency = labels.currency.trim();
    const specs = SPEC_KEYS.map((key) => ({ key, label: labels[key], value: item[key].trim() })).filter((spec) => spec.value);

    return (
        <Card padding="none" className={cn("reveal flex flex-col", item.featured && "border-border-strong")}>
            <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <h3 dir="auto" className="min-w-0 break-words text-base font-semibold leading-snug text-foreground">
                        {item.name}
                    </h3>
                    {item.featured && labels.featured && <Badge className="shrink-0">{labels.featured}</Badge>}
                </div>

                {price !== null ? (
                    <p className="flex flex-wrap items-baseline gap-x-1.5 text-foreground">
                        {currency && <span className="text-sm font-medium text-muted">{currency}</span>}
                        <span className="text-2xl font-semibold tracking-tight tabular-nums">{formatAmount(price)}</span>
                    </p>
                ) : (
                    showQuoteLabel &&
                    labels.customQuote && <p className="text-lg font-semibold text-foreground">{labels.customQuote}</p>
                )}

                {item.description && (
                    <p dir="auto" className="text-sm leading-relaxed text-muted">
                        {item.description}
                    </p>
                )}

                {specs.length > 0 && (
                    // Pushed to the bottom so spec rows line up across cards in the same row
                    <dl className="mt-auto divide-y divide-border border-t border-border text-sm">
                        {specs.map((spec) => (
                            <div key={spec.key} className="flex items-baseline justify-between gap-4 py-2">
                                <dt className="shrink-0 text-subtle">{spec.label}</dt>
                                <dd dir="auto" className="min-w-0 break-words text-right text-foreground">
                                    {spec.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                )}
            </div>

            <div className="p-4 pt-0 sm:p-5 sm:pt-0">
                <RequestButton
                    service={item.name}
                    label={price !== null ? labels.request : labels.requestQuote}
                    variant={item.featured ? "primary" : "secondary"}
                    className="w-full"
                />
            </div>
        </Card>
    );
}
