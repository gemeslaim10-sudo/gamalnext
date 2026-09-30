"use client";

import { SectionCard } from "@/components/admin/SectionCard";
import { Avatar, ButtonLink } from "@/components/ui";
import { SEO_PARTS, inheritedPlaceholder } from "../../seoEditor";
import { TextField } from "../../components/fields";
import { BUSINESS_CRUMBS, SeoEditor, useInheritedSettings, useSeoPart } from "../../components/SeoEditor";

const digitsOnly = (value: string) => value.replace(/\D/g, "");

/** Who the business is: name, other names, summary, founder and founding year. */
export default function SeoIdentityEditor() {
    const part = useSeoPart(SEO_PARTS.identity);
    const inherited = useInheritedSettings();
    const year = part.draft?.foundingYear ?? "";
    const yearInvalid = year !== "" && year.length !== 4;

    return (
        <SeoEditor
            title="الهوية"
            description="مين إنت وبتعمل إيه. اكتبها كحقايق بسيطة من غير مبالغة."
            breadcrumbs={BUSINESS_CRUMBS}
            part={part}
            inherited={inherited}
            saveDisabled={yearInvalid}
        >
            {(draft) => (
                <>
                    <SectionCard title="النشاط">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextField
                                label="اسم النشاط"
                                value={draft.name}
                                onChange={(name) => part.set({ name })}
                                placeholder={inheritedPlaceholder(inherited.data?.siteName)}
                                hint="فاضي = اسم الموقع من الإعدادات."
                            />
                            <TextField
                                label="أسماء تانية بيدوّر بيها الناس"
                                value={draft.alternateNames}
                                onChange={(alternateNames) => part.set({ alternateNames })}
                                hint="افصل بينها بفاصلة (,)."
                            />
                            <TextField
                                label="نبذة عن النشاط"
                                rows={4}
                                value={draft.summary}
                                onChange={(summary) => part.set({ summary })}
                                hint="كام جملة حقيقية: بتعمل إيه، لمين، ومنين. فاضي = وصف الموقع."
                                className="sm:col-span-2"
                            />
                            <TextField
                                label="اسم المؤسس"
                                value={draft.founderName}
                                onChange={(founderName) => part.set({ founderName })}
                                placeholder={inheritedPlaceholder(inherited.data?.ownerName)}
                                hint="فاضي = اسمك من الإعدادات."
                            />
                            <TextField
                                label="أسماء تانية ليك"
                                value={draft.founderAlternateNames}
                                onChange={(founderAlternateNames) => part.set({ founderAlternateNames })}
                                hint="اسمك بالعربي، والاسم اللي على LinkedIn أو أي اسم بيدوّروا عليك بيه، مفصولين بفاصلة (,). بيعرّف جوجل إنهم كلهم نفس الشخص صاحب GTech."
                                className="sm:col-span-2"
                            />
                            <TextField
                                label="سنة التأسيس"
                                dir="ltr"
                                inputMode="numeric"
                                maxLength={4}
                                value={draft.foundingYear}
                                onChange={(value) => part.set({ foundingYear: digitsOnly(value) })}
                                placeholder="2020"
                                error={yearInvalid ? "السنة 4 أرقام، مثال: 2020" : undefined}
                                hint="اختياري."
                            />
                        </div>
                    </SectionCard>

                    <div className="flex items-center gap-3 rounded-card border border-border px-4 py-3">
                        <Avatar src={inherited.data?.siteLogo} alt="اللوجو" size={36} />
                        <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                            <p className="text-sm text-muted">اللوجو واسم الموقع الأساسي بيتعدّلوا من «إعدادات الموقع».</p>
                            <ButtonLink href="/admin/settings" variant="ghost" size="sm" className="-ms-3 shrink-0 self-start sm:ms-0 sm:self-auto">
                                فتح الإعدادات
                            </ButtonLink>
                        </div>
                    </div>
                </>
            )}
        </SeoEditor>
    );
}
