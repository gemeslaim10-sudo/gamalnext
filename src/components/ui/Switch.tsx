import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type SwitchProps = Omit<ComponentProps<"button">, "type" | "role" | "onChange" | "aria-checked"> & {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
};

/**
 * On/off toggle (`role="switch"`). Name it with a `<Label htmlFor={id}>` (clicking the label
 * toggles it too) or an `aria-label`.
 */
export function Switch({ checked, onCheckedChange, onClick, className, ...props }: SwitchProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={(event) => {
                onClick?.(event);
                if (!event.defaultPrevented) onCheckedChange(!checked);
            }}
            className={cn(
                // The invisible ::after grows the tap target to 40px without changing the layout
                "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border px-0.5 after:absolute after:-inset-2",
                "transition-colors duration-(--motion-fast) ease-out disabled:cursor-not-allowed disabled:opacity-50",
                checked ? "border-primary bg-primary" : "border-border-strong bg-surface-hover",
                className
            )}
            {...props}
        >
            <span
                aria-hidden
                className={cn(
                    "size-4.5 rounded-full transition-transform duration-(--motion-fast) ease-out",
                    checked ? "translate-x-5 bg-primary-foreground rtl:-translate-x-5" : "translate-x-0 bg-muted"
                )}
            />
        </button>
    );
}
