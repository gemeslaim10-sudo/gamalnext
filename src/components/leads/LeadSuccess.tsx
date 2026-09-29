"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadSuccessProps {
    title: string;
    message: string;
    /** Buttons under the message (the caller lays them out) */
    actions?: ReactNode;
    /** Card-sized heading instead of the dialog-sized one */
    compact?: boolean;
    className?: string;
}

/** Calm thank-you state shown in place of the lead form once it's sent. */
export function LeadSuccess({ title, message, actions, compact, className }: LeadSuccessProps) {
    const headingRef = useRef<HTMLHeadingElement>(null);

    // The form (and the focused button) just disappeared: move focus here so it isn't lost
    useEffect(() => {
        headingRef.current?.focus();
    }, []);

    return (
        <div className={cn("animate-fade-in", className)}>
            <div className="flex items-start gap-3">
                <CircleCheck aria-hidden className={cn("size-5 shrink-0 text-success", compact ? "mt-0.5" : "mt-1")} />
                <div className="min-w-0 flex-1" role="status">
                    <h2
                        ref={headingRef}
                        tabIndex={-1}
                        dir="auto"
                        className={cn(
                            "font-semibold tracking-tight text-foreground outline-none",
                            compact ? "text-base" : "text-xl"
                        )}
                    >
                        {title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{message}</p>
                </div>
            </div>
            {actions && <div className="mt-6">{actions}</div>}
        </div>
    );
}
