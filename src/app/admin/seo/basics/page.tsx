"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import { splitList } from "@/lib/seo/settings";
import { SEO_PAGE_META, SEO_PARTS, applyTitleTemplate, pageDescription, pageTitle, seoVars } from "../seoEditor";
import { TextField } from "../components/fields";
import { SearchPreview } from "../components/SearchPreview";
import { SeoEditor, useInheritedSettings, useSeoPart } from "../components/SeoEditor";
import { VariablesHelp } from "../components/VariablesHelp";

/** Site title, title pattern, description and keywords, with the home page's Google preview. */
export default function SeoBasicsEditor() {
    const part = useSeoPart(SEO_PARTS.basics);
    const inherited = useInheritedSettings();

    return (
        <SeoEditor
            title="الأساسيات"
            description="العنوان والوصف اللي بيظهروا لما حد يدوّر على موقعك. بيأثروا على كل الصفحات."
            part={part}
            inherited={inherited}
        >
            {(draft, merged) => {
                const vars = seoVars(merged, inherited.data);
                const keywordCount = splitList(draft.keywords).length;
                const templateMissingSlot = draft.titleTemplate.trim() !== "" && !/\{title\}|%s/.test(draft.titleTemplate);

                return (
                    <>
                        <SectionCard title="الصفحة الرئيسية في جوجل" description="معاينة تقريبية بتتحدّث وإنت بتكتب.">
                            <SearchPreview
                                path={SEO_PAGE_META.home.path}
                                title={pageTitle(merged, "home", vars)}
                                description={pageDescription(merged, "home", vars)}
                                siteName={vars.siteName ?? ""}
                            />
                        </SectionCard>

                        <SectionCard title="العنوان والوصف">
                            <div className="space-y-4">
                                <TextField
                                    label="عنوان الموقع"
                                    value={draft.siteTitle}
                                    onChange={(siteTitle) => part.set({ siteTitle })}
                                    hint="عنوان الصفحة الرئيسية في جوجل وفي تبويب المتصفح. الأفضل لحد 60 حرف."
                                />
                                <TextField
                                    label="نمط عنوان الصفحات"
                                    dir="ltr"
                                    value={draft.titleTemplate}
                                    onChange={(titleTemplate) => part.set({ titleTemplate })}
                                    error={templateMissingSlot ? "النمط مفيهوش {title}، فعنوان الصفحة هيتحط قبله لوحده." : undefined}
                                    hint={
                                        <>
                                            باقي الصفحات عنوانها بيتحط مكان <bdi>{"{title}"}</bdi>. مثال لصفحة Projects:{" "}
                                            <bdi className="text-muted">{applyTitleTemplate(draft.titleTemplate, "Projects", vars)}</bdi>
                                        </>
                                    }
                                />
                                <TextField
                                    label="وصف الموقع"
                                    rows={3}
                                    value={draft.description}
                                    onChange={(description) => part.set({ description })}
                                    hint="بيظهر تحت العنوان في نتايج البحث، ولأي صفحة ملهاش وصف خاص. الأفضل من 120 لـ 160 حرف."
                                />
                                <TextField
                                    label="الكلمات المفتاحية"
                                    rows={2}
                                    value={draft.keywords}
                                    onChange={(keywords) => part.set({ keywords })}
                                    hint={`افصل بينها بفاصلة (,). بتتضاف لكل الصفحات — ${keywordCount} كلمة دلوقتي.`}
                                />
                            </div>
                        </SectionCard>

                        <VariablesHelp vars={vars} withTitle />
                    </>
                );
            }}
        </SeoEditor>
    );
}
