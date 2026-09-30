"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePresence } from "@/hooks/usePresence";
import { Button } from "./Button";

/**
 * Shared open/close motion: things appear with the slower ease-out curve and leave faster with ease-in.
 * Pair with `data-state` from `usePresence`.
 */
export const OVERLAY_TRANSITION =
    "transition duration-(--motion-base) ease-out data-[state=closed]:duration-(--motion-fast) data-[state=closed]:ease-in data-[state=closed]:pointer-events-none";

// ── Modal ─────────────────────────────────────────────────────────────────────

const MODAL_WIDTHS = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl",
} as const;

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: ReactNode;
    /** Accessible name when there is no visible `title` */
    ariaLabel?: string;
    size?: keyof typeof MODAL_WIDTHS;
    className?: string;
    children: ReactNode;
}

const noopSubscribe = () => () => {};

/** False during server render and hydration, true afterwards (portals need `document`). */
function useIsClient() {
    return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/** Dialog that sits on a dimmed backdrop. Slides up from the bottom on phones. */
export function Modal({ open, onClose, title, ariaLabel, size = "md", className, children }: ModalProps) {
    const isClient = useIsClient();
    const { mounted, state } = usePresence(open);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = previous;
            document.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    if (!mounted || !isClient) return null;

    return createPortal(
        <div
            data-state={state}
            className={cn(
                "fixed inset-0 z-50 flex items-end justify-center bg-overlay sm:items-center sm:p-4",
                OVERLAY_TRANSITION,
                "data-[state=closed]:opacity-0"
            )}
            onMouseDown={(e) => open && e.target === e.currentTarget && onClose()}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel ?? (typeof title === "string" ? title : undefined)}
                data-state={state}
                className={cn(
                    "flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-card border border-border bg-surface shadow-popover sm:rounded-card",
                    OVERLAY_TRANSITION,
                    // Phones: slides up like a sheet. Wider screens: a small fade and settle.
                    "data-[state=closed]:translate-y-8 sm:data-[state=closed]:translate-y-2 sm:data-[state=closed]:scale-[0.98] data-[state=closed]:opacity-0",
                    MODAL_WIDTHS[size],
                    className
                )}
            >
                {title && (
                    <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-5 py-4">
                        <h2 className="text-base font-semibold text-foreground">{title}</h2>
                        {/* Dialogs only render in the browser, so the page language is known here */}
                        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label={document.documentElement.lang === "ar" ? "إغلاق" : "Close"}>
                            <X />
                        </Button>
                    </div>
                )}
                <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
            </div>
        </div>,
        document.body
    );
}

// ── Dropdown ──────────────────────────────────────────────────────────────────

interface DropdownProps {
    trigger: (state: { open: boolean; toggle: () => void }) => ReactNode;
    children: ReactNode | ((close: () => void) => ReactNode);
    align?: "start" | "end";
    className?: string;
}

/** Click-to-open menu that closes on outside click or Escape. */
export function Dropdown({ trigger, children, align = "end", className }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const { mounted, state } = usePresence(open);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return undefined;
        const onPointer = (e: PointerEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("pointerdown", onPointer);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onPointer);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const close = () => setOpen(false);

    return (
        <div ref={ref} className="relative">
            {trigger({ open, toggle: () => setOpen((v) => !v) })}
            {mounted && (
                <div
                    data-state={state}
                    className={cn(
                        "absolute top-full z-50 mt-2 min-w-48 rounded-card border border-border bg-surface p-1 shadow-popover",
                        OVERLAY_TRANSITION,
                        // Grows out of the corner it's anchored to
                        "data-[state=closed]:-translate-y-1 data-[state=closed]:scale-95 data-[state=closed]:opacity-0",
                        // Logical sides, so menus also open the right way in the right-to-left dashboard
                        align === "end" ? "end-0 origin-top-right rtl:origin-top-left" : "start-0 origin-top-left rtl:origin-top-right",
                        className
                    )}
                >
                    {typeof children === "function" ? children(close) : children}
                </div>
            )}
        </div>
    );
}

const MENU_ITEM =
    "flex w-full items-center gap-2.5 rounded-control px-3 py-2 text-start text-sm text-muted transition-colors " +
    "hover:bg-surface-hover hover:text-foreground [&_svg]:size-4 [&_svg]:shrink-0";

export function MenuItem({ href, onClick, danger, children }: { href?: string; onClick?: () => void; danger?: boolean; children: ReactNode }) {
    const classes = cn(MENU_ITEM, danger && "text-danger hover:bg-danger/10 hover:text-danger");
    if (href) {
        return (
            <Link href={href} onClick={onClick} className={classes}>
                {children}
            </Link>
        );
    }
    return (
        <button type="button" onClick={onClick} className={classes}>
            {children}
        </button>
    );
}

export function MenuDivider() {
    return <div className="my-1 h-px bg-border" />;
}
