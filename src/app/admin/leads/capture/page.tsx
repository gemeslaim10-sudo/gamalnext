import { CircleCheck, Contact, ListChecks, MessageSquare, TextCursorInput, Timer } from "lucide-react";
import { AdminHub, AdminPage, type HubGroup } from "@/components/admin/kit";

// The lead popup and the contact form share one document (site_content/lead_capture), edited in
// parts. Each part loads it once and saves only its own fields. Nothing is read here.

const GROUPS: HubGroup[] = [
    {
        title: "النافذة",
        items: [
            {
                href: "/admin/leads/capture/behavior",
                title: "التوقيت والتشغيل",
                description: "النافذة تفتح لوحدها ولا لأ، وبعد كام ثانية.",
                icon: Timer,
            },
            {
                href: "/admin/leads/capture/popup",
                title: "نصوص النافذة",
                description: "الترحيب ورسالتك وزرار الإرسال و«بعدين».",
                icon: MessageSquare,
            },
            {
                href: "/admin/leads/capture/services",
                title: "الخدمات المقترحة",
                description: "خانة «محتاج إيه؟» والاقتراحات اللي بتظهر فيها.",
                icon: ListChecks,
            },
        ],
    },
    {
        title: "مشترك بين النافذة وصفحة التواصل",
        items: [
            {
                href: "/admin/leads/capture/form",
                title: "الفورم والأخطاء",
                description: "خانات الاسم والرقم، رسايل الأخطاء، وملاحظة الخصوصية.",
                icon: TextCursorInput,
            },
            {
                href: "/admin/leads/capture/success",
                title: "رسالة النجاح",
                description: "اللي بيظهر بعد ما الزائر يبعت رقمه.",
                icon: CircleCheck,
            },
        ],
    },
    {
        title: "صفحة التواصل",
        items: [
            {
                href: "/admin/leads/capture/contact",
                title: "صفحة التواصل",
                description: "عنوان الصفحة ووصفها وفورم الرسالة.",
                icon: Contact,
            },
        ],
    },
];

export default function LeadCaptureHub() {
    return (
        <AdminPage
            title="نافذة جمع الأرقام"
            description="النافذة اللي بتطلب من الزوار اسمهم ورقمهم، ونفس الفورم في صفحة التواصل. زرار «معاينة» جوه كل جزء بيوريك النافذة بتعديلاتك قبل الحفظ."
        >
            <AdminHub groups={GROUPS} />
        </AdminPage>
    );
}
