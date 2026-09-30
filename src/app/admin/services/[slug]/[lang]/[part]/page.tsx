"use client";

import { use, useCallback } from "react";
import { notFound } from "next/navigation";
import { SectionCard } from "@/components/admin/SectionCard";
import { hasPage, servicePath } from "@/lib/services/content";
import type { ServiceCopy, ServiceFaq, ServiceLang, ServiceStep, ServicesContent } from "@/lib/services/types";
import { TextField } from "../../../../pricing/components/fields";
import { ListEditor, type RowBadge } from "../../../../pricing/components/ListEditor";
import { ServicesEditorFrame } from "../../../ServicesEditorFrame";
import { LANG_LABEL, SERVICES_CRUMBS, replaceService, useServicesPart } from "../../../useServicesPart";

type Part = "intro" | "sections" | "faq";
const PARTS: Record<Part, { title: string; description: string }> = {
    intro: { title: "العنوان والمقدمة والـ SEO", description: "أول حاجة الزائر وجوجل بيقروها. اكتب في المقدمة بتعمل إيه ولمين في أول جملة." },
    sections: { title: "الأقسام", description: "كل قسم بيظهر لما يكون فيه سطر واحد على الأقل." },
    faq: { title: "الأسئلة الشائعة", description: "أسئلة حقيقية بيسألها العملاء، بإجابات قصيرة وصادقة. محركات البحث والذكاء الاصطناعي بتقراها." },
};

/** The edited copy, with ids on the steps and questions so the list editor can track them. */
interface CopyDraft {
    copy: ServiceCopy;
    process: (ServiceStep & { id: string })[];
    faqs: (ServiceFaq & { id: string })[];
}

/** Ids from the position when loaded; new rows get a time-based one (made in the click handler). */
const withIds = <T,>(items: T[]) => items.map((item, index) => ({ ...item, id: `row-${index}` }));
const newRow = <T,>(item: T) => ({ ...item, id: `new-${Date.now()}` });
const lines = (value: string[]) => value.join("\n");
const toLines = (text: string) => text.split("\n");
const cleanLines = (value: string[]) => value.map((line) => line.trim()).filter(Boolean);

function Count({ value, max }: { value: string; max: number }) {
    return <span className={value.length > max ? "text-warning" : undefined}>{`${value.length}/${max}`}</span>;
}

/** One language of one service page, in three small parts. */
export default function ServiceCopyEditor({ params }: { params: Promise<{ slug: string; lang: string; part: string }> }) {
    const { slug, lang: rawLang, part: rawPart } = use(params);
    if ((rawLang !== "en" && rawLang !== "ar") || !(rawPart in PARTS)) notFound();
    const lang = rawLang as ServiceLang;
    const partId = rawPart as Part;

    const pick = useCallback(
        (content: ServicesContent): CopyDraft | null => {
            const item = content.items.find((entry) => entry.slug === slug);
            if (!item) return null;
            return { copy: item[lang], process: withIds(item[lang].process), faqs: withIds(item[lang].faqs) };
        },
        [slug, lang]
    );
    const apply = useCallback(
        (content: ServicesContent, draft: CopyDraft) => {
            const item = content.items.find((entry) => entry.slug === slug);
            if (!item) return {};
            const copy: ServiceCopy = {
                ...draft.copy,
                audience: cleanLines(draft.copy.audience),
                problems: cleanLines(draft.copy.problems),
                includes: cleanLines(draft.copy.includes),
                process: draft.process.map(({ title, text }) => ({ title: title.trim(), text: text.trim() })).filter((step) => step.title || step.text),
                faqs: draft.faqs.map(({ question, answer }) => ({ question: question.trim(), answer: answer.trim() })).filter((faq) => faq.question && faq.answer),
            };
            return { items: replaceService(content, slug, { ...item, [lang]: copy }) };
        },
        [slug, lang]
    );
    const part = useServicesPart(pick, apply);
    const item = part.content?.items.find((entry) => entry.slug === slug);
    const name = item?.en.name || item?.ar.name || slug;
    const setCopy = (patch: Partial<ServiceCopy>) => part.change((current) => ({ ...current, copy: { ...current.copy, ...patch } }));
    const rtlHint = lang === "ar" ? " (بالعربي)" : " (English)";

    return (
        <ServicesEditorFrame
            title={`${PARTS[partId].title} ${LANG_LABEL[lang]}`}
            description={PARTS[partId].description}
            breadcrumbs={[...SERVICES_CRUMBS, { label: name, href: `/admin/services/${slug}` }]}
            part={part}
            viewHref={item && hasPage(item, lang) ? servicePath(slug, lang) : undefined}
        >
            {(draft) => {
                const copy = draft.copy;
                if (partId === "intro") {
                    return (
                        <>
                            <SectionCard title="الاسم والعنوان">
                                <TextField label={`اسم الخدمة${rtlHint}`} value={copy.name} onChange={(value) => setCopy({ name: value })} hint="قصير، بيظهر في الكروت واللينكات. فاضي = مفيش صفحة باللغة دي." />
                                <TextField label="سطر تحت الاسم في الكروت" rows={2} value={copy.summary} onChange={(value) => setCopy({ summary: value })} />
                                <TextField label="العنوان الرئيسي (H1)" value={copy.h1} onChange={(value) => setCopy({ h1: value })} hint="بيقول الخدمة بوضوح، زي «برمجة نظام ERP مخصص لشركتك». فاضي = مفيش صفحة باللغة دي." />
                                <TextField
                                    label="المقدمة"
                                    rows={8}
                                    value={copy.intro}
                                    onChange={(value) => setCopy({ intro: value })}
                                    hint="أول جملة تجاوب: الخدمة دي إيه ولمين. سطر فاضي = فقرة جديدة."
                                />
                            </SectionCard>
                            <SectionCard title="نتيجة جوجل" description="العنوان بيتضاف بعده « | GTech» تلقائيًا.">
                                <TextField label="عنوان جوجل" value={copy.seoTitle} onChange={(value) => setCopy({ seoTitle: value })} hint={<>حوالي 50 حرف. <Count value={copy.seoTitle} max={52} /></>} />
                                <TextField
                                    label="وصف جوجل"
                                    rows={3}
                                    value={copy.seoDescription}
                                    onChange={(value) => setCopy({ seoDescription: value })}
                                    hint={<>جملة أو اتنين بيشجعوا على الضغط. <Count value={copy.seoDescription} max={160} /></>}
                                />
                            </SectionCard>
                            <SectionCard title="الدعوة في آخر الصفحة">
                                <TextField label="العنوان" value={copy.ctaTitle} onChange={(value) => setCopy({ ctaTitle: value })} />
                                <TextField label="النص" rows={3} value={copy.ctaText} onChange={(value) => setCopy({ ctaText: value })} />
                            </SectionCard>
                        </>
                    );
                }

                if (partId === "sections") {
                    const listField = (titleKey: "audienceTitle" | "problemsTitle" | "includesTitle", listKey: "audience" | "problems" | "includes", label: string) => (
                        <SectionCard title={label}>
                            <TextField label="عنوان القسم" value={copy[titleKey]} onChange={(value) => setCopy({ [titleKey]: value } as Partial<ServiceCopy>)} />
                            <TextField
                                label="السطور"
                                rows={6}
                                value={lines(copy[listKey])}
                                onChange={(value) => setCopy({ [listKey]: toLines(value) } as Partial<ServiceCopy>)}
                                hint="سطر لكل نقطة."
                            />
                        </SectionCard>
                    );
                    return (
                        <>
                            {listField("audienceTitle", "audience", "لمين الخدمة")}
                            {listField("problemsTitle", "problems", "المشاكل اللي بتحلها")}
                            {listField("includesTitle", "includes", "بتشمل إيه")}
                            <SectionCard title="خطوات الشغل">
                                <TextField label="عنوان القسم" value={copy.processTitle} onChange={(value) => setCopy({ processTitle: value })} />
                                <ListEditor<CopyDraft["process"][number]>
                                    items={draft.process}
                                    onChange={(fn) => part.change((current) => ({ ...current, process: fn(current.process) }))}
                                    createItem={() => newRow({ title: "", text: "" })}
                                    addLabel="إضافة خطوة"
                                    removeLabel="حذف الخطوة"
                                    emptyText="مفيش خطوات لسه."
                                    getTitle={(step) => step.title}
                                    untitledLabel="خطوة من غير عنوان"
                                    renderFields={(step, change) => (
                                        <>
                                            <TextField label="الخطوة" value={step.title} onChange={(title) => change({ title })} />
                                            <TextField label="الشرح" rows={2} value={step.text} onChange={(text) => change({ text })} />
                                        </>
                                    )}
                                />
                            </SectionCard>
                        </>
                    );
                }

                const faqBadges = (faq: ServiceFaq): RowBadge[] => (!faq.question.trim() || !faq.answer.trim() ? [{ label: "ناقص، مش هيظهر", variant: "warning" }] : []);
                return (
                    <SectionCard title="الأسئلة" description={`${draft.faqs.length} في القايمة.`}>
                        <TextField label="عنوان القسم" value={copy.faqTitle} onChange={(value) => setCopy({ faqTitle: value })} />
                        <ListEditor<CopyDraft["faqs"][number]>
                            items={draft.faqs}
                            onChange={(fn) => part.change((current) => ({ ...current, faqs: fn(current.faqs) }))}
                            createItem={() => newRow({ question: "", answer: "" })}
                            addLabel="إضافة سؤال"
                            removeLabel="حذف السؤال"
                            emptyText="مفيش أسئلة لسه."
                            getTitle={(faq) => faq.question}
                            untitledLabel="سؤال من غير نص"
                            getBadges={faqBadges}
                            renderFields={(faq, change) => (
                                <>
                                    <TextField label="السؤال" value={faq.question} onChange={(question) => change({ question })} />
                                    <TextField label="الإجابة" rows={4} value={faq.answer} onChange={(answer) => change({ answer })} hint="ابدأ بالإجابة المباشرة، وبعدها التفاصيل." />
                                </>
                            )}
                        />
                    </SectionCard>
                );
            }}
        </ServicesEditorFrame>
    );
}
