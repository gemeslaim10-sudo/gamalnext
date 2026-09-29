import { Badge, Card } from "@/components/ui";
import type { PricingAddon, PricingLabels } from "@/lib/pricing/types";
import { discountPercent, fillTemplate, fixedPrice, formatPrice } from "@/lib/pricing/utils";
import { RequestButton } from "./RequestButton";

interface AddonListProps {
    addons: PricingAddon[];
    labels: PricingLabels;
}

/** Paid add-ons as one list: the old price struck through, the new price, the discount and a request button. */
export function AddonList({ addons, labels }: AddonListProps) {
    return (
        <Card padding="none" className="reveal divide-y divide-border">
            {addons.map((addon) => {
                const price = fixedPrice(addon);
                const percent = price !== null ? discountPercent(addon.originalPrice, price) : null;

                return (
                    <div key={addon.id} className="flex flex-col gap-3 p-4 sm:p-5 md:flex-row md:items-center md:gap-6">
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                <h3 dir="auto" className="min-w-0 break-words text-base font-semibold text-foreground">
                                    {addon.name}
                                </h3>
                                {addon.featured && labels.featured && <Badge>{labels.featured}</Badge>}
                            </div>
                            {addon.description && (
                                <p dir="auto" className="mt-1 text-sm leading-relaxed text-muted">
                                    {addon.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between gap-4 md:justify-end">
                            <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                                {price !== null ? (
                                    <>
                                        {percent !== null && addon.originalPrice !== null && (
                                            <del className="text-sm text-subtle line-through">
                                                {labels.originalPrice && <span className="sr-only">{labels.originalPrice}: </span>}
                                                {formatPrice(addon.originalPrice, labels.currency)}
                                            </del>
                                        )}
                                        <span className="whitespace-nowrap text-base font-semibold tabular-nums text-foreground">
                                            {formatPrice(price, labels.currency)}
                                        </span>
                                        {percent !== null && labels.discount && (
                                            <Badge>{fillTemplate(labels.discount, { percent })}</Badge>
                                        )}
                                    </>
                                ) : (
                                    labels.customQuote && (
                                        <span className="text-sm font-medium text-foreground">{labels.customQuote}</span>
                                    )
                                )}
                            </div>
                            <RequestButton
                                service={addon.name}
                                label={price !== null ? labels.request : labels.requestQuote}
                                variant={addon.featured ? "primary" : "secondary"}
                                className="shrink-0"
                            />
                        </div>
                    </div>
                );
            })}
        </Card>
    );
}
