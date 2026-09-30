"use client";

import { use } from "react";
import { CircleHelp, FileText, LayoutList, Settings2 } from "lucide-react";
import { AdminHub, AdminPage, useAdminDoc, type HubGroup } from "@/components/admin/kit";
import { ButtonLink } from "@/components/ui";
import { SERVICES_PATH, hasPage, normalizeServices, servicePath } from "@/lib/services/content";
import { SERVICE_LANGS } from "@/lib/services/types";
import { LANG_LABEL, SERVICES_CRUMBS } from "../useServicesPart";

/** One service: its basics, and its page in each language split into three small editors. */
export default function ServiceHub({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    // Already loaded by the services list, so this costs no extra read
    const doc = useAdminDoc(SERVICES_PATH, normalizeServices);
    const item = doc.data?.items.find((entry) => entry.slug === slug);
    const base = `/admin/services/${slug}`;

    const groups: HubGroup[] = [
        {
            title: "الأساسيات",
            items: [
                {
                    href: `${base}/basics`,
                    title: "الظهور والربط",
                    description: "ظاهرة ولا مخفية، الرابط، الأسعار اللي بتظهر فيها، والمشاريع والمقالات المرتبطة.",
                    icon: Settings2,
                },
            ],
        },
        ...SERVICE_LANGS.map((lang) => ({
            title: `الصفحة ${LANG_LABEL[lang]}${item && !hasPage(item, lang) ? " (مش منشورة)" : ""}`,
            items: [
                { href: `${base}/${lang}/intro`, title: "العنوان والمقدمة والـ SEO", description: "الاسم والعنوان الرئيسي والمقدمة وعنوان ووصف جوجل والدعوة في الآخر.", icon: FileText },
                { href: `${base}/${lang}/sections`, title: "الأقسام", description: "لمين الخدمة، المشاكل اللي بتحلها، بتشمل إيه، وخطوات الشغل.", icon: LayoutList },
                { href: `${base}/${lang}/faq`, title: "الأسئلة الشائعة", description: "أسئلة وإجابات حقيقية بيسألها العملاء.", icon: CircleHelp },
            ],
        })),
    ];

    return (
        <AdminPage
            title={item?.en.name || item?.ar.name || slug}
            description={item && !item.visible ? "الخدمة دي مخفية. ظهّرها من «الظهور والربط» لما نصوصها تخلص." : "كل جزء بيتعدّل ويتحفظ لوحده."}
            breadcrumbs={SERVICES_CRUMBS}
            actions={
                item && hasPage(item, "en") ? (
                    <ButtonLink href={servicePath(slug)} external variant="secondary" size="sm">
                        عرض الصفحة
                    </ButtonLink>
                ) : undefined
            }
        >
            <AdminHub groups={groups} />
        </AdminPage>
    );
}
