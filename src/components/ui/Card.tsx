import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const PADDING = {
    none: "",
    sm: "p-4",
    md: "p-4 sm:p-5",
    lg: "p-5 sm:p-6",
} as const;

type CardProps = ComponentProps<"div"> & {
    padding?: keyof typeof PADDING;
    /** Adds a hover border for cards that act as links */
    interactive?: boolean;
};

export function Card({ padding = "md", interactive, className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-card border border-border bg-surface",
                PADDING[padding],
                interactive &&
                    "transition duration-(--motion-base) ease-out hover:-translate-y-0.5 hover:border-border-strong",
                className
            )}
            {...props}
        />
    );
}
