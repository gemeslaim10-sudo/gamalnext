"use client";

import { useId, type ReactNode } from "react";
import { SectionCard } from "@/components/admin/SectionCard";
import { Field, Input, Textarea } from "@/components/ui";
import type { PricingSectionText } from "@/lib/pricing/types";
import { cn } from "@/lib/utils";

// Small controlled inputs used across the pricing editor. Content is typed in English,
// Arabic is fine too: text inputs pick their direction from what's typed (dir="auto").

interface TextFieldProps {
    label: ReactNode;
    value: string;
    onChange: (value: string) => void;
    hint?: ReactNode;
    placeholder?: string;
    /** Renders a textarea with this many rows */
    rows?: number;
    type?: "text" | "email" | "tel";
    dir?: "auto" | "ltr";
    className?: string;
}

export function TextField({ label, value, onChange, hint, placeholder, rows, type = "text", dir = "auto", className }: TextFieldProps) {
    const id = useId();
    return (
        <Field label={label} htmlFor={id} hint={hint} className={className}>
            {rows ? (
                <Textarea
                    id={id}
                    dir={dir}
                    rows={rows}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    className="min-h-0"
                />
            ) : (
                <Input
                    id={id}
                    dir={dir}
                    type={type}
                    inputMode={type === "tel" ? "tel" : undefined}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
        </Field>
    );
}

interface AmountFieldProps {
    label: ReactNode;
    value: number | null;
    onChange: (value: number | null) => void;
    hint?: ReactNode;
    disabled?: boolean;
}

/** A price input: empty means "no price". */
export function AmountField({ label, value, onChange, hint, disabled }: AmountFieldProps) {
    const id = useId();
    return (
        <Field label={label} htmlFor={id} hint={hint}>
            <Input
                id={id}
                dir="ltr"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={value ?? ""}
                disabled={disabled}
                onChange={(e) => {
                    const next = e.target.valueAsNumber;
                    onChange(e.target.value === "" || !Number.isFinite(next) || next < 0 ? null : next);
                }}
                className="tabular-nums"
            />
        </Field>
    );
}

interface ToggleFieldProps {
    label: ReactNode;
    checked: boolean;
    onChange: (checked: boolean) => void;
    hint?: ReactNode;
    className?: string;
}

/** Checkbox with its label and an optional hint; the whole row is clickable. */
export function ToggleField({ label, checked, onChange, hint, className }: ToggleFieldProps) {
    return (
        <label className={cn("flex min-h-10 cursor-pointer items-start gap-3 py-1", className)}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 cursor-pointer accent-foreground"
            />
            <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">{label}</span>
                {hint && <span className="mt-0.5 block text-xs text-subtle">{hint}</span>}
            </span>
        </label>
    );
}

interface SectionTextCardProps {
    title: ReactNode;
    value: PricingSectionText;
    onChange: (value: PricingSectionText) => void;
}

/** Title + description of one section of the public page. */
export function SectionTextCard({ title, value, onChange }: SectionTextCardProps) {
    return (
        <SectionCard title={title} description="يظهر فوق القسم في صفحة الأسعار. امسح العنوان لإخفاء العنوان والوصف معًا.">
            <div className="space-y-4">
                <TextField label="عنوان القسم" value={value.title} onChange={(next) => onChange({ ...value, title: next })} />
                <TextField
                    label="وصف القسم"
                    rows={2}
                    value={value.description}
                    onChange={(next) => onChange({ ...value, description: next })}
                    hint="اختياري"
                />
            </div>
        </SectionCard>
    );
}
