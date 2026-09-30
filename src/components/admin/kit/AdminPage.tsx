import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
    label: string;
    href?: string;
}

interface AdminPageProps {
    title: ReactNode;
    description?: ReactNode;
    /** Where this page sits, e.g. [{ label: "إعدادات الموقع", href: "/admin/settings" }] (the current page is added automatically) */
    breadcrumbs?: Crumb[];
    /** Buttons next to the title (e.g. "Add", "Reload") */
    actions?: ReactNode;
    /** "form" keeps editors at a comfortable reading width; "wide" is for lists and tables */
    width?: "form" | "wide";
    children: ReactNode;
    className?: string;
}

/**
 * The frame of every dashboard screen: breadcrumbs back to the section, title, short explanation,
 * actions, then the content. Keeps all screens consistent.
 */
export function AdminPage({ title, description, breadcrumbs = [], actions, width = "form", children, className }: AdminPageProps) {
    return (
        <div className={cn("mx-auto w-full", width === "form" ? "max-w-3xl" : "max-w-page", className)}>
            {breadcrumbs.length > 0 && (
                <nav aria-label="مسار الصفحة" className="mb-3">
                    <ol className="flex flex-wrap items-center gap-1 text-xs text-subtle">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
                                {crumb.href ? (
                                    <Link href={crumb.href} className="rounded-sm transition-colors hover:text-foreground">
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span>{crumb.label}</span>
                                )}
                                {/* Points "forward" in the right-to-left dashboard, and flips for left-to-right */}
                                <ChevronLeft aria-hidden className="size-3.5 ltr:rotate-180" />
                            </li>
                        ))}
                        <li aria-current="page" className="text-muted">
                            {title}
                        </li>
                    </ol>
                </nav>
            )}

            <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title}</h1>
                    {description && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>}
                </div>
                {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
            </header>

            {children}
        </div>
    );
}
