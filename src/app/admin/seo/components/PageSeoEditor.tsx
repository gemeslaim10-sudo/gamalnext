"use client";

import { ExternalLink } from "lucide-react";
import { SectionCard } from "@/components/admin/SectionCard";
import { ButtonLink } from "@/components/ui";
import type { SeoPageId } from "@/lib/seo/settings";
import { SEO_PAGE_META, SEO_PAGE_PARTS, SITE_HOST, pageDescription, pageTitle, seoVars } from "../seoEditor";
import { TextField } from "./fields";
import { SearchPreview } from "./SearchPreview";
import { PAGES_CRUMBS, SeoEditor, useInheritedSettings, useSeoPart } from "./SeoEditor";
import { VariablesHelp } from "./VariablesHelp";

/** Title, description and keywords of one main page, with its Google preview. */
export function PageSeoEditor({ id }: { id: SeoPageId }) {
    const meta = SEO_PAGE_META[id];
    const isHome = id === "home";
    const part = useSeoPart(SEO_PAGE_PARTS[id]);
    const inherited = useInheritedSettings();

    return (
        <SeoEditor
            title={meta.label}
            description={
                <bdi dir="ltr">
                    {SITE_HOST}
                    {isHome ? "" : meta.path}
                </bdi>
            }
            breadcrumbs={PAGES_CRUMBS}
            part={part}
            inherited={inherited}
            actions={
                <ButtonLink href={meta.path} external variant="secondary" size="sm">
                    <ExternalLink />
                    فتح الصفحة
                </ButtonLink>
            }
        >
            {(page, merged) => {
                const vars = seoVars(merged, inherited.data);
                return (
                    <>
                        <SectionCard title="في جوجل" description="معاينة تقريبية بتتحدّث وإنت بتكتب.">
                            <SearchPreview
                                path={meta.path}
                                title={pageTitle(merged, id, vars)}
                                description={pageDescription(merged, id, vars)}
                                siteName={vars.siteName ?? ""}
                            />
                        </SectionCard>

                        <SectionCard title="العنوان والوصف">
                            <div className="space-y-4">
                                <TextField
                                    label="عنوان الصفحة"
                                    value={page.title}
                                    onChange={(title) => part.set({ title })}
                                    placeholder={isHome ? merged.siteTitle : undefined}
                                    hint={
                                        isHome
                                            ? "فاضي = «عنوان الموقع» من الأساسيات. عنوان الرئيسية بيظهر زي ما هو من غير النمط."
                                            : "بيتحط مكان {title} في «نمط عنوان الصفحات» من الأساسيات. فاضي = نفس عنوان الصفحة الرئيسية."
                                    }
                                />
                                <TextField
                                    label="وصف الصفحة"
                                    rows={3}
                                    value={page.description}
                                    onChange={(description) => part.set({ description })}
                                    placeholder={merged.description}
                                    hint="فاضي = «وصف الموقع» من الأساسيات."
                                />
                                <TextField
                                    label="كلمات مفتاحية إضافية"
                                    value={page.keywords}
                                    onChange={(keywords) => part.set({ keywords })}
                                    hint="بتتضاف للكلمات العامة. افصل بينها بفاصلة (,)."
                                />
                            </div>
                        </SectionCard>

                        <VariablesHelp vars={vars} />
                    </>
                );
            }}
        </SeoEditor>
    );
}
