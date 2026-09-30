"use client";

import { useId, useState, type HTMLAttributes, type ReactNode } from "react";
import { Plus, X } from "lucide-react";
import { Button, Field, Input, Textarea } from "@/components/ui";
import { cn } from "@/lib/utils";

// Controlled inputs used across the SEO editor. Texts pick their direction from what's typed
// (dir="auto"); numbers, links and codes are always left-to-right.

interface TextFieldProps {
    label: ReactNode;
    value: string;
    onChange: (value: string) => void;
    hint?: ReactNode;
    error?: ReactNode;
    placeholder?: string;
    /** Renders a textarea with this many rows */
    rows?: number;
    type?: "text" | "email" | "tel" | "url";
    inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
    dir?: "auto" | "ltr";
    maxLength?: number;
    className?: string;
    inputClassName?: string;
}

export function TextField({
    label,
    value,
    onChange,
    hint,
    error,
    placeholder,
    rows,
    type = "text",
    inputMode,
    dir = "auto",
    maxLength,
    className,
    inputClassName,
}: TextFieldProps) {
    const id = useId();
    return (
        <Field label={label} htmlFor={id} hint={hint} error={error} className={className}>
            {rows ? (
                <Textarea
                    id={id}
                    dir={dir}
                    rows={rows}
                    value={value}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    aria-invalid={error ? true : undefined}
                    onChange={(e) => onChange(e.target.value)}
                    className={cn("min-h-0 resize-y", inputClassName)}
                />
            ) : (
                <Input
                    id={id}
                    dir={dir}
                    type={type}
                    inputMode={inputMode}
                    value={value}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    aria-invalid={error ? true : undefined}
                    onChange={(e) => onChange(e.target.value)}
                    className={inputClassName}
                />
            )}
        </Field>
    );
}

interface ListFieldProps {
    label: ReactNode;
    hint?: ReactNode;
    items: string[];
    onChange: (items: string[]) => void;
    addLabel: string;
    /** Accessible name of a row, e.g. (i) => `Link ${i + 1}` */
    itemLabel: (index: number) => string;
    emptyText: string;
    placeholder?: string;
    /** Two-line textarea rows instead of single-line inputs */
    multiline?: boolean;
    type?: "text" | "url";
    dir?: "auto" | "ltr";
    /** A warning shown under a row (never blocks saving) */
    check?: (value: string) => string | undefined;
}

/** One value per row, with add and remove. Empty rows are dropped when saving. */
export function ListField({
    label,
    hint,
    items,
    onChange,
    addLabel,
    itemLabel,
    emptyText,
    placeholder,
    multiline,
    type = "text",
    dir = "auto",
    check,
}: ListFieldProps) {
    // The row just added gets the focus
    const [focusRow, setFocusRow] = useState<number | null>(null);

    const change = (index: number, value: string) => onChange(items.map((item, i) => (i === index ? value : item)));
    const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
    const add = () => {
        setFocusRow(items.length);
        onChange([...items, ""]);
    };

    return (
        <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">{label}</legend>
            {hint && <p className="text-xs text-subtle">{hint}</p>}

            {items.length === 0 ? (
                <p className="rounded-control border border-border px-4 py-5 text-center text-sm text-subtle">{emptyText}</p>
            ) : (
                <ul className="space-y-2">
                    {items.map((item, index) => {
                        const warning = item.trim() ? check?.(item) : undefined;
                        const common = {
                            value: item,
                            dir,
                            placeholder,
                            autoFocus: index === focusRow,
                            "aria-label": itemLabel(index),
                            "aria-invalid": warning ? true : undefined,
                        };
                        return (
                            // Rows have no ids; the inputs are controlled, so index keys stay correct
                            <li key={index}>
                                <div className="flex items-start gap-2">
                                    {multiline ? (
                                        <Textarea
                                            {...common}
                                            rows={2}
                                            onChange={(e) => change(index, e.target.value)}
                                            className="min-h-0 min-w-0 resize-y"
                                        />
                                    ) : (
                                        <Input
                                            {...common}
                                            type={type}
                                            inputMode={type === "url" ? "url" : undefined}
                                            onChange={(e) => change(index, e.target.value)}
                                            className="min-w-0"
                                        />
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                        aria-label={`حذف: ${itemLabel(index)}`}
                                        title="حذف"
                                        className="shrink-0"
                                    >
                                        <X />
                                    </Button>
                                </div>
                                {warning && <p className="mt-1 text-xs text-warning">{warning}</p>}
                            </li>
                        );
                    })}
                </ul>
            )}

            <Button variant="secondary" onClick={add} className="w-full sm:w-auto">
                <Plus />
                {addLabel}
            </Button>
        </fieldset>
    );
}
