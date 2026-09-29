import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const FIELD =
    "w-full rounded-control border border-border bg-surface px-3 text-sm text-foreground transition duration-(--motion-fast) ease-out " +
    "placeholder:text-subtle hover:border-border-strong focus:border-border-strong focus:outline-none " +
    "focus-visible:outline-none focus:ring-2 focus:ring-foreground/10 disabled:cursor-not-allowed disabled:opacity-50";

export function Input({ className, ...props }: ComponentProps<"input">) {
    return <input className={cn(FIELD, "h-10", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
    return <textarea className={cn(FIELD, "min-h-24 py-2 leading-relaxed", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
    return <select className={cn(FIELD, "h-10", className)} {...props} />;
}

export function Label({ className, ...props }: ComponentProps<"label">) {
    return <label className={cn("text-sm font-medium text-foreground", className)} {...props} />;
}

interface FieldProps {
    label?: ReactNode;
    htmlFor?: string;
    hint?: ReactNode;
    error?: ReactNode;
    className?: string;
    children: ReactNode;
}

/** Label + control + hint/error, with consistent spacing. */
export function Field({ label, htmlFor, hint, error, className, children }: FieldProps) {
    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            {label && <Label htmlFor={htmlFor}>{label}</Label>}
            {children}
            {error ? (
                <p className="text-xs text-danger">{error}</p>
            ) : (
                hint && <p className="text-xs text-subtle">{hint}</p>
            )}
        </div>
    );
}
