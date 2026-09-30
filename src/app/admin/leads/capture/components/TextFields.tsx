"use client";

import { useId } from "react";
import { Field, Input, Textarea } from "@/components/ui";
import { DEFAULT_LEAD_CAPTURE, type LeadCaptureSettings } from "@/components/leads/settings";
import { cn } from "@/lib/utils";

/** Settings fields that hold a text. */
export type TextKey = { [K in keyof LeadCaptureSettings]: LeadCaptureSettings[K] extends string ? K : never }[keyof LeadCaptureSettings];

export interface TextFieldConfig<K extends TextKey> {
    key: K;
    label: string;
    hint?: string;
    /** Spans the full width */
    wide?: boolean;
    /** Textarea (always full width) */
    multiline?: boolean;
}

interface TextFieldsProps<K extends TextKey> {
    fields: TextFieldConfig<K>[];
    values: Pick<LeadCaptureSettings, K>;
    onChange: (key: K, value: string) => void;
}

/**
 * A grid of text inputs. The visitor-facing texts are English by default (Arabic works too), and an
 * emptied field shows its default in grey — saving puts that default back.
 */
export function TextFields<K extends TextKey>({ fields, values, onChange }: TextFieldsProps<K>) {
    const id = useId();
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => {
                const inputId = `${id}-${field.key}`;
                const common = {
                    id: inputId,
                    dir: "auto" as const,
                    value: values[field.key] as string,
                    placeholder: DEFAULT_LEAD_CAPTURE[field.key],
                };
                return (
                    <Field
                        key={field.key}
                        label={field.label}
                        htmlFor={inputId}
                        hint={field.hint}
                        className={cn((field.wide || field.multiline) && "sm:col-span-2")}
                    >
                        {field.multiline ? (
                            <Textarea {...common} rows={3} className="min-h-0 resize-y" onChange={(e) => onChange(field.key, e.target.value)} />
                        ) : (
                            <Input {...common} onChange={(e) => onChange(field.key, e.target.value)} />
                        )}
                    </Field>
                );
            })}
        </div>
    );
}
