import {
    Bell,
    BookOpen,
    Bot,
    Code,
    FileText,
    FlaskConical,
    FolderOpen,
    LayoutDashboard,
    MessageSquarePlus,
    MessagesSquare,
    PanelTop,
    SearchCheck,
    Settings,
    Star,
    Tag,
    Type,
    UserPlus,
    Users,
    type LucideIcon,
} from "lucide-react";

/** Counters shown next to menu items (read once per visit, see useAdminCounts). */
export type AdminBadge = "newLeads" | "pendingArticles" | "pendingPosts" | "pendingReviews";

export interface AdminNavItem {
    href: string;
    label: string;
    /** One line shown on hub cards and the dashboard home */
    description: string;
    icon: LucideIcon;
    badge?: AdminBadge;
}

export interface AdminNavSection {
    id: string;
    label: string;
    items: AdminNavItem[];
}

/**
 * The dashboard menu, grouped by what the owner is doing. The sidebar, the dashboard home and the
 * breadcrumbs all read this list, so a page is added or renamed in one place.
 */
export const ADMIN_NAV: AdminNavSection[] = [
    {
        id: "overview",
        label: "نظرة عامة",
        items: [{ href: "/admin", label: "الرئيسية", description: "ملخص سريع وأهم الاختصارات", icon: LayoutDashboard }],
    },
    {
        id: "sales",
        label: "العملاء والمبيعات",
        items: [
            { href: "/admin/leads", label: "العملاء المحتملين", description: "الأرقام اللي اتسجلت من الموقع والشات", icon: UserPlus, badge: "newLeads" },
            { href: "/admin/leads/capture", label: "نافذة جمع الأرقام", description: "نصوص النافذة وفورم صفحة التواصل", icon: MessageSquarePlus },
            { href: "/admin/pricing", label: "الأسعار والباقات", description: "الباقات والخدمات والعروض وبيانات التواصل", icon: Tag },
            { href: "/admin/notifications", label: "الإشعارات", description: "إيميل لما يحصل حدث مهم على الموقع", icon: Bell },
        ],
    },
    {
        id: "content",
        label: "محتوى الموقع",
        items: [
            { href: "/admin/content", label: "الواجهة", description: "العنوان والوصف والصورة في صفحة البروفايل", icon: PanelTop },
            { href: "/admin/skills", label: "الخدمات والمهارات", description: "الخدمات والتقنيات والأدوات", icon: Code },
            { href: "/admin/projects", label: "المشاريع", description: "معرض الأعمال", icon: FolderOpen },
            { href: "/admin/copy", label: "نصوص الموقع", description: "كل الكلام اللي بيظهر للزوار، مقسّم حسب الصفحة", icon: Type },
        ],
    },
    {
        id: "community",
        label: "المدونة والأعضاء",
        items: [
            { href: "/admin/articles", label: "المقالات", description: "مراجعة ونشر وتعديل المقالات", icon: FileText, badge: "pendingArticles" },
            { href: "/admin/posts", label: "المنشورات", description: "منشورات الأعضاء في الصفحة الرئيسية", icon: MessagesSquare, badge: "pendingPosts" },
            { href: "/admin/reviews", label: "آراء العملاء", description: "الموافقة على التقييمات أو إخفاؤها", icon: Star, badge: "pendingReviews" },
            { href: "/admin/users", label: "الأعضاء", description: "الحسابات المسجلة على الموقع", icon: Users },
        ],
    },
    {
        id: "ai",
        label: "المساعد الذكي",
        items: [
            { href: "/admin/ai", label: "إعدادات المساعد", description: "الشخصية والتعليمات والموديل والمفاتيح", icon: Bot },
            { href: "/admin/ai/knowledge", label: "قاعدة المعرفة", description: "المعلومات اللي المساعد بيرد منها", icon: BookOpen },
            { href: "/admin/ai/test", label: "تجربة المساعد", description: "جرّب الردود من غير ما حاجة تتسجل", icon: FlaskConical },
        ],
    },
    {
        id: "site",
        label: "الموقع",
        items: [
            { href: "/admin/seo", label: "الـ SEO والظهور", description: "جوجل ومحركات الذكاء الاصطناعي", icon: SearchCheck },
            { href: "/admin/settings", label: "إعدادات الموقع", description: "الهوية وبيانات التواصل والصفحة الشخصية", icon: Settings },
        ],
    },
];

export const ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV.flatMap((section) => section.items);

/** The menu item a dashboard path belongs to (the most specific match wins). */
export function findAdminNavItem(pathname: string): AdminNavItem | undefined {
    return ADMIN_NAV_ITEMS.filter((item) =>
        item.href === "/admin" ? pathname === "/admin" : pathname === item.href || pathname.startsWith(`${item.href}/`)
    ).sort((a, b) => b.href.length - a.href.length)[0];
}
