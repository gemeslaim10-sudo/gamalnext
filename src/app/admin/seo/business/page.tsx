import { Clock, Globe, IdCard, MapPin, Phone } from "lucide-react";
import { AdminHub, AdminPage, type HubGroup } from "@/components/admin/kit";

const GROUPS: HubGroup[] = [
    {
        items: [
            {
                href: "/admin/seo/business/identity",
                title: "الهوية",
                description: "اسم النشاط ونبذة عنه والمؤسس وسنة التأسيس.",
                icon: IdCard,
            },
            {
                href: "/admin/seo/business/contact",
                title: "التواصل",
                description: "التليفون وواتساب والإيميل اللي بيوصلوا لجوجل.",
                icon: Phone,
            },
            {
                href: "/admin/seo/business/address",
                title: "العنوان ومنطقة الشغل",
                description: "المدينة والدولة والمناطق اللي بتخدمها ولغات التعامل.",
                icon: MapPin,
            },
            {
                href: "/admin/seo/business/hours",
                title: "المواعيد والأسعار",
                description: "مواعيد العمل ونطاق الأسعار.",
                icon: Clock,
            },
            {
                href: "/admin/seo/business/profiles",
                title: "حساباتك على مواقع تانية",
                description: "فيسبوك وإنستجرام و LinkedIn و Google Business… (sameAs).",
                icon: Globe,
            },
        ],
    },
];

/** The business facts Google (schema.org) and AI assistants read, split into small parts. */
export default function SeoBusinessHub() {
    return (
        <AdminPage
            title="بيانات النشاط التجاري"
            description="بيانات نشاطك اللي بتوصل لجوجل (schema.org) وللمساعدات الذكية. أي خانة فاضية بتاخد قيمتها من «إعدادات الموقع»."
            breadcrumbs={[{ label: "الـ SEO والظهور", href: "/admin/seo" }]}
        >
            <AdminHub groups={GROUPS} />
        </AdminPage>
    );
}
