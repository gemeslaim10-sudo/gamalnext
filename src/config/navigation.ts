// Single source of truth for site navigation.
// The desktop navbar and the mobile menu both read this list, so a link is
// added or removed in exactly one place. Labels are editable texts (/admin/copy → Navigation).
import type { CopyKey } from "@/config/copy";

export interface NavLink {
    labelKey: CopyKey;
    href: string;
    external?: boolean;
}

export const NAV_LINKS: NavLink[] = [
    { labelKey: "nav.home", href: "/" },
    { labelKey: "nav.services", href: "/services" },
    { labelKey: "nav.profile", href: "/profile" },
    { labelKey: "nav.projects", href: "/projects" },
    { labelKey: "nav.skills", href: "/skills" },
    { labelKey: "nav.blog", href: "/articles" },
    { labelKey: "nav.pricing", href: "/pricing" },
    { labelKey: "nav.contact", href: "/contact" },
];

/** Links in the signed-in account menu (desktop dropdown and mobile menu). */
export function getAccountLinks(uid: string, isAdmin: boolean): NavLink[] {
    const links: NavLink[] = [
        { labelKey: "nav.myProfile", href: `/users/${uid}` },
        { labelKey: "nav.writeArticle", href: "/write" },
        { labelKey: "nav.settings", href: "/settings" },
    ];
    if (isAdmin) links.push({ labelKey: "nav.dashboard", href: "/admin" });
    return links;
}

/** Pages that render without the site navbar, footer and chat button. */
export const CHROMELESS_PREFIXES = ["/admin", "/gamal-cv"];

export function isActivePath(pathname: string, href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
}
