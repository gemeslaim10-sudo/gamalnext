"use client";

import { memo, type ChangeEvent } from "react";
import { RotateCcw } from "lucide-react";
import { Button, Input, Textarea } from "@/components/ui";
import type { CopyField } from "@/lib/copy/types";
import { copyInputId, missingPlaceholders } from "../copyAdmin";

interface CopyFieldRowProps {
    /** Full key, e.g. "nav.home" */
    storageKey: string;
    field: CopyField;
    value: string;
    /** Differs from the saved text */
    changed: boolean;
    /** Stable (the rows are memoized) */
    onChange: (key: string, value: string) => void;
}

/**
 * One text: where it appears on the site (and the {placeholders} it may use), its box, and a button
 * that puts the default back. Labels are the English descriptions from src/config/copy.
 */
export const CopyFieldRow = memo(function CopyFieldRow({ storageKey, field, value, changed, onChange }: CopyFieldRowProps) {
    const id = copyInputId(storageKey);
    const missing = missingPlaceholders(field, value);
    const box = {
        id,
        value,
        dir: "auto" as const,
        onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(storageKey, event.target.value),
    };

    return (
        <div className="grid gap-2 px-4 py-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-4 sm:px-5">
            <div className="min-w-0 sm:pt-2.5">
                <label htmlFor={id} className="block break-words text-sm leading-snug text-foreground">
                    <bdi dir="ltr">{field.label}</bdi>
                    {changed && (
                        <>
                            <span aria-hidden className="ms-2 inline-block size-1.5 rounded-full bg-warning align-middle" />
                            <span className="sr-only">(لسه ما اتحفظش)</span>
                        </>
                    )}
                </label>
                {field.hint && (
                    <p className="mt-1 break-words text-xs leading-relaxed text-subtle">
                        <bdi dir="ltr">{field.hint}</bdi>
                    </p>
                )}
            </div>

            <div className="min-w-0">
                <div className="flex items-start gap-1">
                    {field.type === "textarea" ? <Textarea {...box} rows={3} /> : <Input {...box} />}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onChange(storageKey, field.default)}
                        disabled={value === field.default}
                        aria-label="رجّع النص الافتراضي"
                        title={`الافتراضي: ${field.default}`}
                    >
                        <RotateCcw />
                    </Button>
                </div>
                {missing.length > 0 && (
                    <p className="mt-1.5 text-xs leading-relaxed text-warning">
                        ناقص <bdi dir="ltr">{missing.join(" ")}</bdi>: الموقع بيحط مكانها قيمة حقيقية، ولو شلتها مش هتظهر.
                    </p>
                )}
            </div>
        </div>
    );
});
