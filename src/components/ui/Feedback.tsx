import type { ComponentProps, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const BADGE_VARIANTS = {
    neutral: "border-border bg-surface-hover text-muted",
    outline: "border-border text-muted",
    success: "border-success/30 bg-success/10 text-success",
    warning: "border-warning/30 bg-warning/10 text-warning",
    danger: "border-danger/30 bg-danger/10 text-danger",
} as const;

type BadgeProps = ComponentProps<"span"> & { variant?: keyof typeof BADGE_VARIANTS };

/** Small label for tags, statuses and counts. */
export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium [&_svg]:size-3",
                BADGE_VARIANTS[variant],
                className
            )}
            {...props}
        />
    );
}

type ChipProps = ComponentProps<"button"> & { active?: boolean };

/** Toggle-style filter button (categories, tabs). */
export function Chip({ active, className, type = "button", ...props }: ChipProps) {
    return (
        <button
            type={type}
            aria-pressed={active}
            className={cn(
                "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm transition duration-(--motion-base) ease-out active:scale-[0.96]",
                active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted hover:border-border-strong hover:text-foreground",
                className
            )}
            {...props}
        />
    );
}

const ALERT_VARIANTS = {
    neutral: "border-border bg-surface text-muted",
    success: "border-success/30 bg-success/10 text-success",
    warning: "border-warning/30 bg-warning/10 text-warning",
    danger: "border-danger/30 bg-danger/10 text-danger",
} as const;

type AlertProps = ComponentProps<"div"> & { variant?: keyof typeof ALERT_VARIANTS };

export function Alert({ variant = "neutral", className, ...props }: AlertProps) {
    return (
        <div
            role={variant === "danger" ? "alert" : "status"}
            className={cn("rounded-control border px-4 py-3 text-sm", ALERT_VARIANTS[variant], className)}
            {...props}
        />
    );
}

export function Spinner({ className }: { className?: string }) {
    return <Loader2 aria-hidden className={cn("size-5 animate-spin text-muted", className)} />;
}

/** Centered spinner for a whole section or page that is loading. */
export function LoadingBlock({ label = "Loading…", className }: { label?: string; className?: string }) {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-3 py-16 text-sm text-subtle", className)}>
            <Spinner />
            <span>{label}</span>
        </div>
    );
}

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
    return <div className={cn("animate-pulse rounded-control bg-surface-hover", className)} {...props} />;
}

interface EmptyStateProps {
    icon?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn("rounded-card border border-border px-6 py-12 text-center", className)}>
            {icon && <div className="mx-auto mb-3 flex size-10 items-center justify-center text-subtle [&_svg]:size-6">{icon}</div>}
            <p className="font-medium text-foreground">{title}</p>
            {description && <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{description}</p>}
            {action && <div className="mt-5 flex justify-center">{action}</div>}
        </div>
    );
}
