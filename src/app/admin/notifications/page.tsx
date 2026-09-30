import { BellRing, BookOpen, Mail, Send } from "lucide-react";
import { AdminHub, AdminPage, type HubGroup } from "@/components/admin/kit";
import { NotificationsStatus } from "./components/NotificationsStatus";

// Email notifications (settings/notifications). Each card opens one part; nothing is read here.

const GROUPS: HubGroup[] = [
    {
        items: [
            {
                href: "/admin/notifications/provider",
                title: "مزوّد الإيميل والمستلمين",
                description: "تشغيل الإشعارات، مفتاح Resend، ومين يوصله الإيميل.",
                icon: Mail,
            },
            {
                href: "/admin/notifications/events",
                title: "الأحداث",
                description: "إيه اللي يبعتلك إيميل: عميل جديد، عضو جديد، حاجة مستنية مراجعتك…",
                icon: BellRing,
            },
            {
                href: "/admin/notifications/test",
                title: "إرسال إيميل تجريبي",
                description: "ابعت إيميل واحد تتأكد بيه إن الإعداد شغال.",
                icon: Send,
            },
            {
                href: "/admin/notifications/setup",
                title: "طريقة الإعداد",
                description: "خطوات عمل حساب Resend ومفتاح API، خطوة بخطوة.",
                icon: BookOpen,
            },
        ],
    },
];

export default function NotificationsHub() {
    return (
        <AdminPage title="الإشعارات" description="إيميل يوصلك لما يحصل حاجة مهمة على الموقع، زي عميل جديد ساب رقمه.">
            <NotificationsStatus />
            <AdminHub groups={GROUPS} />
        </AdminPage>
    );
}
