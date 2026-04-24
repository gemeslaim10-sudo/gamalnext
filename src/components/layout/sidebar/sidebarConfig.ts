import { Home, Sparkles, FolderOpen, Newspaper, Wrench, Phone, Briefcase, Settings, FileText, BookOpen } from "lucide-react";

// ─── Admin Emails ─────────────────────────────────────────────────────────────
export const ADMIN_EMAILS = ["montasrrm@gmail.com", "gemeslaim10@gmail.com"];

// ─── Types ────────────────────────────────────────────────────────────────────
export type SidebarArticle = { id: string; title: string };
export type SidebarProject = { id: string; title: string; imageUrl?: string; slug?: string };
export type SidebarTool = { name: string; href: string; icon: string };

// ─── Static Tools Data ────────────────────────────────────────────────────────
export const ALL_TOOLS: SidebarTool[] = [
    { name: "QR Code Generator", href: "/tools/utils/qr-generator", icon: "📱" },
    { name: "Unit Converter", href: "/tools/utils/unit-converter", icon: "📐" },
    { name: "Age Calculator", href: "/tools/utils/age-calculator", icon: "📅" },
    { name: "Stopwatch", href: "/tools/utils/stopwatch", icon: "⏱️" },
    { name: "Password Generator", href: "/tools/security/password-generator", icon: "🔐" },
];

// ─── Shuffle Helper ───────────────────────────────────────────────────────────
export function shuffleAndPick<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// ─── Excluded Paths (pages that have their own sidebar) ───────────────────────
export const EXCLUDED_PREFIXES = ['/admin', '/tools'];

// ─── Context Info Mapper ──────────────────────────────────────────────────────
export function getContextInfo(pathname: string) {
    if (pathname === '/') return { title: 'Home', icon: Home };
    if (pathname.startsWith('/articles')) return { title: 'Blog', icon: Newspaper };
    if (pathname.startsWith('/projects')) return { title: 'Portfolio', icon: FolderOpen };
    if (pathname.startsWith('/skills')) return { title: 'Skills', icon: Sparkles };
    if (pathname.startsWith('/contact')) return { title: 'Contact', icon: Phone };
    if (pathname.startsWith('/experience')) return { title: 'Experience', icon: Briefcase };
    if (pathname.startsWith('/settings')) return { title: 'Settings', icon: Settings };
    if (pathname.startsWith('/write')) return { title: 'Write', icon: FileText };
    return { title: 'Explore', icon: BookOpen };
}

// ─── Nav Items ────────────────────────────────────────────────────────────────
export const NAV_ITEMS = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore Feed', href: '/explore', icon: Sparkles },
    { name: 'Portfolio', href: '/projects', icon: FolderOpen },
    { name: 'Blog', href: '/articles', icon: Newspaper },
    { name: 'Tools', href: '/tools', icon: Wrench },
    { name: 'Contact', href: '/contact', icon: Phone },
];
