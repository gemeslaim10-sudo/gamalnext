import { Briefcase, CircleQuestionMark, ExternalLink, Info, Package, PanelTop, Phone, Puzzle, SearchCheck, Type } from "lucide-react";
import { AdminHub, AdminPage, type HubGroup } from "@/components/admin/kit";
import { ButtonLink } from "@/components/ui";

// The pricing page is one document (site_content/pricing) edited in parts: each card opens one part,
// which loads the document once and saves only its own fields. Nothing is read here.

// In the order the sections appear on the page
const GROUPS: HubGroup[] = [
    {
        title: "أعلى الصفحة والأسعار",
        items: [
            {
                href: "/admin/pricing/header",
                title: "رأس الصفحة والعرض",
                description: "العنوان والوصف اللي فوق، وشريط العرض أو الخصم.",
                icon: PanelTop,
            },
            {
                href: "/admin/pricing/packages",
                title: "الباقات",
                description: "باقات المواقع بأسعارها ومواصفاتها وترتيبها.",
                icon: Package,
            },
            {
                href: "/admin/pricing/addons",
                title: "الإضافات",
                description: "إضافات مدفوعة بالسعر قبل الخصم وبعده.",
                icon: Puzzle,
            },
            {
                href: "/admin/pricing/services",
                title: "الخدمات بعرض سعر",
                description: "خدمات من غير سعر ثابت، بزر «طلب عرض سعر».",
                icon: Briefcase,
            },
        ],
    },
    {
        title: "معلومات وتواصل",
        items: [
            {
                href: "/admin/pricing/info",
                title: "كروت المعلومات",
                description: "ملاحظات قصيرة زي الصيانة والهوية البصرية.",
                icon: Info,
            },
            {
                href: "/admin/pricing/faq",
                title: "الأسئلة الشائعة",
                description: "الأسئلة وإجاباتها في آخر الصفحة.",
                icon: CircleQuestionMark,
            },
            {
                href: "/admin/pricing/contact",
                title: "أرقام التواصل",
                description: "أرقام الاتصال وواتساب والإيميل في قسم التواصل.",
                icon: Phone,
            },
        ],
    },
    {
        title: "نصوص عامة",
        items: [
            {
                href: "/admin/pricing/labels",
                title: "نصوص الأزرار والأسعار",
                description: "العملة وأزرار الطلب والتواصل وعناوين سطور المواصفات.",
                icon: Type,
            },
            {
                href: "/admin/seo/pages/pricing",
                title: "الصفحة في جوجل",
                description: "عنوان ووصف صفحة الأسعار في نتايج البحث.",
                icon: SearchCheck,
            },
        ],
    },
];

export default function AdminPricingHub() {
    return (
        <AdminPage
            title="الأسعار والباقات"
            description="محتوى صفحة الأسعار متقسّم لأجزاء. افتح الجزء اللي عايز تعدّله، وكل جزء بيتحفظ لوحده."
            actions={
                <ButtonLink href="/pricing" external variant="secondary">
                    <ExternalLink />
                    عرض الصفحة
                </ButtonLink>
            }
        >
            <AdminHub groups={GROUPS} />
        </AdminPage>
    );
}
