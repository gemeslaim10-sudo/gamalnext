"use client";

import { useId } from "react";
import { ExternalLink } from "lucide-react";
import { SectionCard } from "@/components/admin/SectionCard";
import { Alert, ButtonLink, Label, Switch } from "@/components/ui";
import { SEO_PARTS, seoVars } from "../seoEditor";
import { TextField } from "../components/fields";
import { SeoEditor, useInheritedSettings, useSeoPart } from "../components/SeoEditor";
import { VariablesHelp } from "../components/VariablesHelp";

/** Whether AI assistants may read the site, and the opening paragraph of /llms.txt. */
export default function SeoAiEditor() {
    const part = useSeoPart(SEO_PARTS.ai);
    const inherited = useInheritedSettings();
    const switchId = useId();

    return (
        <SeoEditor
            title="المساعدات الذكية و llms.txt"
            description="ChatGPT و Gemini و Perplexity و Claude وغيرهم بيقروا المواقع عشان يجاوبوا أسئلة الناس ويرشّحولهم شركات."
            part={part}
            inherited={inherited}
        >
            {(draft, merged) => (
                <>
                    <SectionCard title="السماح بالقراءة">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <Label htmlFor={switchId} className="cursor-pointer">
                                    السماح للمساعدات الذكية بقراءة الموقع
                                </Label>
                                <p className="mt-1 text-xs leading-relaxed text-subtle">
                                    وهو شغال، يقدروا يقروا صفحاتك ويعرفوا خدماتك وأسعارك وطريقة التواصل معاك، ويرشّحوك لما حد يسألهم.
                                </p>
                            </div>
                            <Switch
                                id={switchId}
                                checked={draft.allowAiCrawlers}
                                onCheckedChange={(allowAiCrawlers) => part.set({ allowAiCrawlers })}
                            />
                        </div>
                        {!draft.allowAiCrawlers && (
                            <Alert variant="warning" className="mt-4">
                                المساعدات الذكية ممنوعة من قراءة الموقع، فمش هتعرف نشاطك ومش هترشّحه. نتايج جوجل العادية مش بتتأثر.
                            </Alert>
                        )}
                    </SectionCard>

                    <SectionCard
                        title="ملف llms.txt"
                        description="ملخص للموقع مكتوب مخصوص للمساعدات الذكية. الموقع بيعمله لوحده من النص ده ومن باقي المحتوى."
                    >
                        <div className="space-y-4">
                            <TextField
                                label="الفقرة الأولى"
                                rows={5}
                                value={draft.llmsIntro}
                                onChange={(llmsIntro) => part.set({ llmsIntro })}
                                hint="أول حاجة المساعد الذكي بيقراها عن نشاطك: مين إنت، بتقدم إيه، ولمين. فاضي = وصف الصفحة الرئيسية."
                            />
                            <div className="flex flex-wrap gap-2">
                                <ButtonLink href="/llms.txt" external variant="secondary" size="sm">
                                    <ExternalLink />
                                    فتح llms.txt
                                </ButtonLink>
                                <ButtonLink href="/llms-full.txt" external variant="secondary" size="sm">
                                    <ExternalLink />
                                    فتح llms-full.txt
                                </ButtonLink>
                            </div>
                            <p className="text-xs text-subtle">الملفين بيعرضوا آخر نسخة محفوظة — احفظ الأول عشان تشوف تعديلاتك.</p>
                        </div>
                    </SectionCard>

                    <VariablesHelp vars={seoVars(merged, inherited.data)} />
                </>
            )}
        </SeoEditor>
    );
}
