"use client";

import type { ReactNode } from "react";
import { SectionCard } from "@/components/admin/SectionCard";
import type { LeadCaptureSettings } from "@/components/leads/settings";
import { CaptureEditor, useCapturePart } from "./CaptureEditor";
import { TextFields, type TextFieldConfig, type TextKey } from "./TextFields";

export interface TextSection<K extends TextKey> {
    title: string;
    description?: string;
    fields: TextFieldConfig<K>[];
}

interface TextsEditorProps<K extends TextKey> {
    title: string;
    description?: ReactNode;
    /** Every key the sections edit, defined outside the component */
    keys: readonly K[];
    sections: TextSection<K>[];
    withPreview?: boolean;
    actions?: ReactNode;
    /** Shown under the fields */
    note?: ReactNode;
}

/** An editor made only of text fields, grouped in cards. */
export function TextsEditor<K extends TextKey>({ title, description, keys, sections, withPreview, actions, note }: TextsEditorProps<K>) {
    const part = useCapturePart(keys);

    return (
        <CaptureEditor title={title} description={description} part={part} withPreview={withPreview} actions={actions}>
            {(draft) => (
                <>
                    {sections.map((section) => (
                        <SectionCard key={section.title} title={section.title} description={section.description}>
                            <TextFields
                                fields={section.fields}
                                values={draft}
                                onChange={(key, value) => part.set({ [key]: value } as Partial<Pick<LeadCaptureSettings, K>>)}
                            />
                        </SectionCard>
                    ))}
                    {note}
                </>
            )}
        </CaptureEditor>
    );
}
