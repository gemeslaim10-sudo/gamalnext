import { Fingerprint, Link2, Phone, UserRound } from "lucide-react";
import { AdminHub, AdminPage, type HubGroup } from "@/components/admin/kit";

const GROUPS: HubGroup[] = [
    {
        items: [
            { href: "/admin/settings/identity", title: "الهوية", description: "اسم الموقع وصورتك ووصف الموقع", icon: Fingerprint },
            { href: "/admin/settings/profile", title: "الصفحة الشخصية", description: "اسمك ومسمّاك الوظيفي ونبذة عنك والشارات", icon: UserRound },
            { href: "/admin/settings/contact", title: "التواصل", description: "رقم الواتساب والتليفون والإيميل", icon: Phone },
            { href: "/admin/settings/links", title: "الروابط", description: "حساباتك على GitHub وLinkedIn", icon: Link2 },
        ],
    },
];

/** Start screen of the site settings: one card per part, nothing is read from the database here. */
export default function SettingsHubPage() {
    return (
        <AdminPage title="إعدادات الموقع" description="هوية الموقع وبياناتك وطرق التواصل معاك. كل جزء في صفحة لوحده.">
            <AdminHub groups={GROUPS} />
        </AdminPage>
    );
}
