import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HubItem {
    href: string;
    title: string;
    description?: string;
    icon?: LucideIcon;
    /** Small extra line, e.g. "12 نص" or "آخر تعديل: …" */
    meta?: ReactNode;
    /** Badge on the end, e.g. a pending count */
    badge?: ReactNode;
    /** Opens in a new tab (e.g. the live page) */
    external?: boolean;
}

export interface HubGroup {
    title?: string;
    description?: string;
    items: HubItem[];
}

/**
 * A section's start screen: a list of cards, each opening one focused editor. Nothing is read from
 * the database here — each editor loads only what it edits.
 */
export function AdminHub({ groups, className }: { groups: HubGroup[]; className?: string }) {
    return (
        <div className={cn("space-y-8", className)}>
            {groups.map((group, index) => (
                <section key={group.title ?? index} aria-label={group.title}>
                    {(group.title || group.description) && (
                        <div className="mb-3">
                            {group.title && <h2 className="text-sm font-semibold text-foreground">{group.title}</h2>}
                            {group.description && <p className="mt-0.5 text-xs text-subtle">{group.description}</p>}
                        </div>
                    )}
                    <ul className="grid gap-3 sm:grid-cols-2">
                        {group.items.map((item) => (
                            <li key={item.href}>
                                <HubCard item={item} />
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    );
}

function HubCard({ item }: { item: HubItem }) {
    const Icon = item.icon;
    const body = (
        <>
            {Icon && (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-control border border-border bg-surface-hover text-muted transition-colors group-hover:text-foreground">
                    <Icon className="size-5" />
                </span>
            )}
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-foreground">{item.title}</span>
                {item.description && <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted">{item.description}</span>}
                {item.meta && <span className="mt-1.5 block text-xs text-subtle">{item.meta}</span>}
            </span>
            {item.badge && <span className="shrink-0">{item.badge}</span>}
            <ChevronLeft
                aria-hidden
                className="size-4 shrink-0 text-subtle transition-transform duration-(--motion-fast) group-hover:-translate-x-0.5 ltr:rotate-180 ltr:group-hover:translate-x-0.5"
            />
        </>
    );
    const classes =
        "group flex h-full items-center gap-3 rounded-card border border-border bg-surface p-4 transition duration-(--motion-base) ease-out hover:-translate-y-0.5 hover:border-border-strong";

    return item.external ? (
        <a href={item.href} target="_blank" rel="noopener noreferrer" className={classes}>
            {body}
        </a>
    ) : (
        <Link href={item.href} className={classes}>
            {body}
        </Link>
    );
}
