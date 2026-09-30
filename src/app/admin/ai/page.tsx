import { Cpu, IdCard, KeyRound, MessageCircle, ScrollText } from "lucide-react";
import { AdminHub, AdminPage, type HubGroup, type HubItem } from "@/components/admin/kit";
import { ADMIN_NAV_ITEMS } from "@/config/admin-nav";

/** Same title, description and icon as the menu entry, so the two never drift apart. */
function fromMenu(href: string): HubItem {
    const item = ADMIN_NAV_ITEMS.find((entry) => entry.href === href);
    return { href, title: item?.label ?? href, description: item?.description, icon: item?.icon };
}

const GROUPS: HubGroup[] = [
    {
        title: "الإعدادات",
        description: "كل جزء في صفحة لوحده، وبيتحفظ لوحده.",
        items: [
            { href: "/admin/ai/identity", title: "الهوية", description: "الاسم والبراند والسطر الفرعي ونص خانة الكتابة", icon: IdCard },
            {
                href: "/admin/ai/instructions",
                title: "الشخصية والتعليمات",
                description: "الدور والأهداف والنبرة ولغة الرد والقواعد",
                icon: ScrollText,
            },
            { href: "/admin/ai/welcome", title: "رسالة الترحيب", description: "أول رسالة الزائر بيشوفها لما يفتح الشات", icon: MessageCircle },
            { href: "/admin/ai/model", title: "الموديل", description: "موديل Gemini اللي بيرد، والبدائل لو اتشغل", icon: Cpu },
            { href: "/admin/ai/keys", title: "مفاتيح الـ API", description: "مفاتيح Gemini وGroq وOpenRouter وOpenAI", icon: KeyRound },
        ],
    },
    {
        title: "المعرفة والتجربة",
        items: [fromMenu("/admin/ai/knowledge"), fromMenu("/admin/ai/test")],
    },
];

export default function AdminAiPage() {
    return (
        <AdminPage
            title="إعدادات المساعد"
            description="المساعد الذكي بيرد على زوار الموقع من الشات. اختار الجزء اللي عايز تعدّله."
        >
            <AdminHub groups={GROUPS} />
        </AdminPage>
    );
}
