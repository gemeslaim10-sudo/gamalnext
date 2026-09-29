import type { CopySection } from "@/lib/copy/types";

export const navigationCopy = {
    id: "nav",
    title: "Navigation (top bar & mobile menu)",
    fields: [
        { key: "home", label: "Link: Home", default: "Home" },
        { key: "profile", label: "Link: Profile", default: "Profile" },
        { key: "projects", label: "Link: Projects", default: "Projects" },
        { key: "skills", label: "Link: Skills", default: "Skills" },
        { key: "blog", label: "Link: Blog", default: "Blog" },
        { key: "pricing", label: "Link: Pricing", default: "Pricing" },
        { key: "contact", label: "Link: Contact", default: "Contact" },
        { key: "login", label: "Log in button (top bar)", default: "Log in" },
        { key: "loginMobile", label: "Log in button (mobile menu)", default: "Log in / Sign up" },
        { key: "logout", label: "Log out button", default: "Log out" },
        { key: "myProfile", label: "Account menu: my profile", default: "My profile" },
        { key: "writeArticle", label: "Account menu: write an article", default: "Write an article" },
        { key: "settings", label: "Account menu: settings", default: "Settings" },
        { key: "dashboard", label: "Account menu: dashboard (admins)", default: "Dashboard" },
        { key: "notifications", label: "Notifications menu title", default: "Notifications" },
        { key: "notificationsEmpty", label: "No notifications message", default: "No notifications yet" },
        { key: "notifyLike", label: "Notification: someone liked your article", default: "{name} liked your article", hint: "{name} = who liked it" },
        { key: "notifyComment", label: "Notification: someone commented", default: "{name} commented on your article", hint: "{name} = who commented" },
        { key: "notifyWelcome", label: "Notification: welcome", default: "Welcome {name} to our website!", hint: "{name} = the new member" },
        { key: "notifyReview", label: "Notification: article submitted for review (admins)", default: "{name} submitted an article for review", hint: "{name} = the author" },
        { key: "notifyApproved", label: "Notification: your article was approved", default: "Your article was approved and published!" },
        { key: "notifyDefault", label: "Notification: other", default: "New notification" },
    ],
} as const satisfies CopySection;

export const footerCopy = {
    id: "footer",
    title: "Footer",
    fields: [
        { key: "copyright", label: "Copyright line", default: "© {year} {siteName}", hint: "{year} = current year, {siteName} = site name from settings" },
    ],
} as const satisfies CopySection;
