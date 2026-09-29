import type { ReactNode } from "react";
import { Card } from "@/components/ui";

interface SectionCardProps {
    title: ReactNode;
    description?: ReactNode;
    /** Small button shown next to the title, e.g. "Add item" */
    action?: ReactNode;
    className?: string;
    children: ReactNode;
}

/** A titled card that groups related fields on admin forms. */
export function SectionCard({ title, description, action, className, children }: SectionCardProps) {
    return (
        <Card padding="lg" className={className}>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="text-base font-semibold text-foreground">{title}</h2>
                    {description && <p className="mt-1 text-sm text-muted">{description}</p>}
                </div>
                {action && <div className="shrink-0">{action}</div>}
            </div>
            {children}
        </Card>
    );
}
