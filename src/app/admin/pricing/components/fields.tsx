"use client";

import { useId, type ReactNode } from "react";
import { SectionCard } from "@/components/admin/SectionCard";
import { Field, Input, Label, Switch, Textarea } from "@/components/ui";
import type { PricingSectionText } from "@/lib/pricing/types";
import { cn } from "@/lib/utils";

// Small controlled inputs used across the pricing editors. The page content is written in English
// (Arabic works too): text inputs pick their direction from what's typed (dir="auto").

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
                    className="min-h-0 resize-y"
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

/** An on/off switch with its label and an optional hint (clicking the label toggles it too). */
export function ToggleField({ label, checked, onChange, hint, className }: ToggleFieldProps) {
    const id = useId();
    return (
        <div className={cn("flex min-h-10 items-start justify-between gap-4 py-1", className)}>
            <div className="min-w-0">
                <Label htmlFor={id} className="cursor-pointer">
                    {label}
                </Label>
                {hint && <p className="mt-0.5 text-xs text-subtle">{hint}</p>}
            </div>
            <Switch id={id} checked={checked} onCheckedChange={onChange} className="mt-0.5" />
        </div>
    );
}

interface SectionTextCardProps {
    value: PricingSectionText;
    onChange: (value: PricingSectionText) => void;
}

/** Title + description shown above a section of the public page. */
export function SectionTextCard({ value, onChange }: SectionTextCardProps) {
    return (
        <SectionCard title="عنوان القسم في الصفحة" description="بيظهر فوق القسم. لو مسحت العنوان، العنوان والوصف يختفوا مع بعض.">
            <div className="space-y-4">
                <TextField label="العنوان" value={value.title} onChange={(title) => onChange({ ...value, title })} />
                <TextField
                    label="الوصف"
                    rows={2}
                    value={value.description}
                    onChange={(description) => onChange({ ...value, description })}
                    hint="اختياري."
                />
            </div>
        </SectionCard>
    );
}
