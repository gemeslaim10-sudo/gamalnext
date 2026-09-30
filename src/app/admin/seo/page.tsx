import { BadgeCheck, Bot, Building2, Files, ListChecks, Search, Send, Share2 } from "lucide-react";
import { AdminHub, AdminPage, type HubGroup } from "@/components/admin/kit";

// SEO settings live in one document (site_content/seo) edited in parts: each card opens one part,
// which saves only its own fields. Nothing is read here.

const GROUPS: HubGroup[] = [
    {
        title: "جوجل ونتايج البحث",
        items: [
            {
                href: "/admin/seo/basics",
                title: "الأساسيات",
                description: "عنوان الموقع ووصفه والكلمات المفتاحية، مع معاينة شكله في جوجل.",
                icon: Search,
            },
            {
                href: "/admin/seo/pages",
                title: "الصفحات",
                description: "عنوان ووصف كل صفحة من صفحات الموقع في نتايج البحث.",
                icon: Files,
            },
            {
                href: "/admin/seo/business",
                title: "بيانات النشاط التجاري",
                description: "هويتك وتواصلك وعنوانك ومواعيدك، لجوجل والمساعدات الذكية.",
                icon: Building2,
            },
            {
                href: "/admin/seo/sharing",
                title: "مشاركة الروابط",
                description: "الاسم والسطر اللي بيظهروا لما حد يبعت رابط من الموقع.",
                icon: Share2,
            },
        ],
    },
    {
        title: "الذكاء الاصطناعي (GEO)",
        description: "إزاي ChatGPT و Gemini و Perplexity و Claude يقروا موقعك ويرشّحوه.",
        items: [
            {
                href: "/admin/seo/ai",
                title: "المساعدات الذكية و llms.txt",
                description: "السماح لهم بقراءة الموقع، والفقرة اللي بيقروها الأول عن نشاطك.",
                icon: Bot,
            },
            {
                href: "/admin/seo/facts",
                title: "معلومات عايزهم يقولوها عنك",
                description: "جمل قصيرة وحقيقية بتظهر في llms.txt.",
                icon: ListChecks,
            },
        ],
    },
    {
        title: "الفهرسة والتحقق",
        items: [
            {
                href: "/admin/seo/verification",
                title: "أكواد التحقق",
                description: "ربط الموقع بـ Google Search Console و Bing و Yandex.",
                icon: BadgeCheck,
            },
            {
                href: "/admin/seo/indexing",
                title: "إرسال الصفحات والملفات",
                description: "إرسال الصفحات لـ Bing و IndexNow، وملفات sitemap و robots و llms.",
                icon: Send,
            },
        ],
    },
];

export default function AdminSeoHub() {
    return (
        <AdminPage
            title="الـ SEO والظهور"
            description="إزاي موقعك بيظهر في جوجل ومحركات البحث، وفي المساعدات الذكية، ولما حد يشارك رابط منه. كل جزء بيتحفظ لوحده."
        >
            <AdminHub groups={GROUPS} />
        </AdminPage>
    );
}
