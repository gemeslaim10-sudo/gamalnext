import { ChevronDown } from "lucide-react";
import type { PricingFaqItem } from "@/lib/pricing/types";

/** Questions that open in place (native <details>, so it works without JavaScript). */
export function FaqList({ items }: { items: PricingFaqItem[] }) {
    return (
        <div className="reveal max-w-content divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
            {items.map((item) => (
                <details key={item.id} className="group">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover sm:px-5 [&::-webkit-details-marker]:hidden">
                        <span dir="auto" className="min-w-0">
                            {item.question}
                        </span>
                        <ChevronDown
                            aria-hidden
                            className="size-4 shrink-0 text-muted transition-transform duration-(--motion-base) ease-out group-open:rotate-180"
                        />
                    </summary>
                    <p
                        dir="auto"
                        className="whitespace-pre-line px-4 pb-4 text-sm leading-relaxed text-muted group-open:animate-fade-in sm:px-5"
                    >
                        {item.answer}
                    </p>
                </details>
            ))}
        </div>
    );
}
