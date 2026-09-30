import { Code, FileText, FolderOpen, House, Phone, Tag, User, type LucideIcon } from "lucide-react";
import { AdminHub, AdminPage } from "@/components/admin/kit";
import { SEO_PAGE_IDS, type SeoPageId } from "@/lib/seo/settings";
import { SEO_PAGE_META, SITE_HOST } from "../seoEditor";

const ICONS: Record<SeoPageId, LucideIcon> = {
    home: House,
    profile: User,
    projects: FolderOpen,
    skills: Code,
    articles: FileText,
    pricing: Tag,
    contact: Phone,
};

/** One card per main page, each opening that page's title, description and Google preview. */
export default function SeoPagesHub() {
    const items = SEO_PAGE_IDS.map((id) => ({
        href: `/admin/seo/pages/${id}`,
        title: SEO_PAGE_META[id].label,
        description: id === "home" ? "من غير عنوان خاص بتاخد «عنوان الموقع» من الأساسيات." : "العنوان والوصف والكلمات المفتاحية.",
        icon: ICONS[id],
        meta: (
            <bdi dir="ltr">
                {SITE_HOST}
                {id === "home" ? "" : SEO_PAGE_META[id].path}
            </bdi>
        ),
    }));

    return (
        <AdminPage
            title="الصفحات"
            description="عنوان ووصف كل صفحة في نتايج البحث، مع معاينة لشكلها في جوجل."
            breadcrumbs={[{ label: "الـ SEO والظهور", href: "/admin/seo" }]}
        >
            <AdminHub groups={[{ items }]} />
        </AdminPage>
    );
}
