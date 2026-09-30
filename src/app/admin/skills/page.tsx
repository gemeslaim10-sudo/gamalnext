import { AppWindow, Briefcase, Gauge, Type, Wrench } from "lucide-react";
import { AdminHub, AdminPage, type HubGroup } from "@/components/admin/kit";

const GROUPS: HubGroup[] = [
    {
        items: [
            { href: "/admin/skills/services", title: "الخدمات", description: "كروت الخدمات: العنوان والوصف والأيقونة والتاجز", icon: Briefcase },
            { href: "/admin/skills/tech-stack", title: "التقنيات", description: "التقنيات ونسبة إتقانك لكل واحدة", icon: Gauge },
            { href: "/admin/skills/software", title: "البرامج", description: "البرامج اللي بتشتغل عليها ومستواك فيها", icon: AppWindow },
            { href: "/admin/skills/tools", title: "أدوات يومية", description: "أدوات الإنتاجية اللي بتستخدمها كل يوم", icon: Wrench },
        ],
    },
    {
        title: "مرتبط",
        items: [
            { href: "/admin/copy/skills", title: "عناوين صفحة المهارات", description: "عنوان الصفحة وعناوين الأقسام دي", icon: Type },
        ],
    },
];

/** Start screen of the skills page content: one card per list, nothing is read from the database here. */
export default function SkillsHubPage() {
    return (
        <AdminPage title="الخدمات والمهارات" description="القوايم اللي بتظهر في صفحة المهارات. كل قايمة في صفحة لوحدها، وبتتحفظ لوحدها.">
            <AdminHub groups={GROUPS} />
        </AdminPage>
    );
}
