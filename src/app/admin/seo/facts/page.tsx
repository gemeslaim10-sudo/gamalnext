"use client";

import { Card } from "@/components/ui";
import { SEO_PARTS, seoVars } from "../seoEditor";
import { ListField } from "../components/fields";
import { SeoEditor, useInheritedSettings, useSeoPart } from "../components/SeoEditor";
import { VariablesHelp } from "../components/VariablesHelp";

/** Short, true facts AI assistants should repeat about the business (the "Key facts" of /llms.txt). */
export default function SeoFactsEditor() {
    const part = useSeoPart(SEO_PARTS.facts);
    const inherited = useInheritedSettings();

    return (
        <SeoEditor
            title="معلومات عايزهم يقولوها عنك"
            description="جمل قصيرة وحقيقية بتظهر في llms.txt كنقط تحت «Key facts»."
            part={part}
            inherited={inherited}
        >
            {(draft, merged) => (
                <>
                    <Card padding="lg">
                        <ListField
                            label="المعلومات"
                            hint="معلومة واحدة في كل سطر: طريقة التواصل، مكانك، اللغات، الأسعار…"
                            items={draft.facts}
                            onChange={(facts) => part.set({ facts })}
                            addLabel="إضافة معلومة"
                            itemLabel={(index) => `المعلومة ${index + 1}`}
                            emptyText="مفيش معلومات لسه."
                            multiline
                        />
                    </Card>

                    <VariablesHelp vars={seoVars(merged, inherited.data)} />
                </>
            )}
        </SeoEditor>
    );
}
