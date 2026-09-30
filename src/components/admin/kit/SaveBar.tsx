"use client";

import { Check, RotateCcw, Save } from "lucide-react";
import { Button, Spinner } from "@/components/ui";
import { cn } from "@/lib/utils";

interface SaveBarProps {
    dirty: boolean;
    saving: boolean;
    onSave: () => void;
    /** Puts the fields back to the last saved values */
    onReset?: () => void;
    /** Disables saving (e.g. a field is invalid) */
    disabled?: boolean;
    className?: string;
}

/** Sticks to the bottom of the screen on every editor: shows whether there are unsaved changes, with Save / Undo. */
export function SaveBar({ dirty, saving, onSave, onReset, disabled, className }: SaveBarProps) {
    return (
        <div
            className={cn(
                "sticky bottom-0 z-20 -mx-4 mt-8 flex items-center justify-between gap-3 border-t border-border bg-background px-4 py-3 sm:-mx-6 sm:px-6",
                className
            )}
        >
            <p className="flex min-w-0 items-center gap-2 text-sm" role="status" aria-live="polite">
                {dirty ? (
                    <>
                        <span aria-hidden className="size-2 shrink-0 rounded-full bg-warning" />
                        <span className="truncate text-foreground">فيه تعديلات لسه ما اتحفظتش</span>
                    </>
                ) : (
                    <>
                        <Check aria-hidden className="size-4 shrink-0 text-subtle" />
                        <span className="truncate text-subtle">كل التعديلات محفوظة</span>
                    </>
                )}
            </p>
            <div className="flex shrink-0 items-center gap-2">
                {onReset && (
                    <Button variant="ghost" size="sm" onClick={onReset} disabled={!dirty || saving} className="h-10 sm:h-8">
                        <RotateCcw /> تراجع
                    </Button>
                )}
                <Button size="sm" onClick={onSave} disabled={!dirty || saving || disabled} className="h-10 px-4 sm:h-8">
                    {saving ? <Spinner className="size-4 text-primary-foreground" /> : <Save />}
                    حفظ
                </Button>
            </div>
        </div>
    );
}
