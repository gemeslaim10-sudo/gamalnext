import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Centers page content and applies the standard side gutters. */
export function Container({ className, ...props }: ComponentProps<"div">) {
    return <div className={cn("mx-auto w-full max-w-page px-4 sm:px-6", className)} {...props} />;
}

/** Vertical rhythm for a full page body (below the navbar, above the footer). */
export function Page({ className, ...props }: ComponentProps<"div">) {
    return <Container className={cn("py-8 sm:py-12", className)} {...props} />;
}

interface PageHeaderProps {
    title: ReactNode;
    description?: ReactNode;
    /** Buttons shown next to the title on wide screens, below it on phones */
    actions?: ReactNode;
    className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
    return (
        <header className={cn("mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between", className)}>
            <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
                {description && <p className="mt-2 max-w-2xl text-muted">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
        </header>
    );
}

interface SectionProps extends Omit<ComponentProps<"section">, "title"> {
    title?: ReactNode;
    description?: ReactNode;
    /** Usually a "View all" link, aligned with the title */
    action?: ReactNode;
}

export function Section({ title, description, action, className, children, ...props }: SectionProps) {
    return (
        <section className={cn("py-10 sm:py-14", className)} {...props}>
            {(title || action) && (
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div className="min-w-0">
                        {title && <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>}
                        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
                    </div>
                    {action && <div className="shrink-0">{action}</div>}
                </div>
            )}
            {children}
        </section>
    );
}
