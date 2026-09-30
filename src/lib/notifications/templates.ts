// Email bodies for the owner's notifications (Arabic, right to left). Emails can't use the site's
// CSS, so styles are inline; the colors below are the plain black/gray of the site on white paper.
import { SITE_URL } from "@/lib/constants";
import type { NotificationEvent } from "./settings";

export interface LeadPayload {
    name: string;
    phone: string;
    service?: string | null;
    message?: string | null;
    source: string;
    page?: string | null;
    /** false when the same number contacted again */
    isNew: boolean;
}

export interface SignupPayload {
    name: string;
    email?: string | null;
    method: string;
}

export interface ArticlePayload {
    title: string;
    authorName: string;
    summary?: string | null;
}

export interface PostPayload {
    authorName: string;
    content: string;
}

export interface ReviewPayload {
    name: string;
    rating?: number | null;
    text: string;
}

export type NotificationPayloads = {
    "lead.new": LeadPayload;
    "user.signup": SignupPayload;
    "article.pending": ArticlePayload;
    "post.pending": PostPayload;
    "review.pending": ReviewPayload;
};

export interface EmailContent {
    subject: string;
    html: string;
    text: string;
}

const SOURCE_LABELS: Record<string, string> = {
    popup: "نافذة الأرقام",
    contact: "صفحة التواصل",
    pricing: "صفحة الأسعار",
    services: "صفحة خدمة",
    chat: "الشات",
    other: "الموقع",
};

const escapeHtml = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const shorten = (value: string, max: number) => {
    const flat = value.replace(/\s+/g, " ").trim();
    return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
};

interface Row {
    label: string;
    value?: string | null;
}

interface ButtonLink {
    label: string;
    href: string;
}

function layout(title: string, intro: string, rows: Row[], buttons: ButtonLink[]): { html: string; text: string } {
    const shown = rows.filter((row) => row.value && row.value.trim());
    const rowsHtml = shown
        .map(
            (row) =>
                `<tr><td style="padding:8px 0;color:#6b6b6b;font-size:13px;white-space:nowrap;vertical-align:top;padding-left:16px">${escapeHtml(row.label)}</td>` +
                `<td style="padding:8px 0;color:#111111;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(String(row.value))}</td></tr>`
        )
        .join("");
    const buttonsHtml = buttons
        .map(
            (button) =>
                `<a href="${escapeHtml(button.href)}" style="display:inline-block;margin:0 0 8px 8px;padding:10px 16px;border-radius:8px;background:#111111;color:#ffffff;font-size:14px;text-decoration:none">${escapeHtml(button.label)}</a>`
        )
        .join("");

    const html =
        `<!doctype html><html lang="ar" dir="rtl"><body style="margin:0;padding:24px;background:#f4f4f4;font-family:Tahoma,Arial,sans-serif">` +
        `<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;border-radius:12px;padding:24px;text-align:right">` +
        `<h1 style="margin:0 0 8px;font-size:18px;color:#111111">${escapeHtml(title)}</h1>` +
        `<p style="margin:0 0 16px;font-size:14px;color:#525252;line-height:1.7">${escapeHtml(intro)}</p>` +
        (rowsHtml ? `<table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:16px">${rowsHtml}</table>` : "") +
        (buttonsHtml ? `<div>${buttonsHtml}</div>` : "") +
        `<p style="margin:16px 0 0;font-size:12px;color:#8a8a8a">إشعار تلقائي من موقعك. تقدر توقفه من لوحة التحكم ← الإشعارات.</p>` +
        `</div></body></html>`;

    const text = [title, intro, "", ...shown.map((row) => `${row.label}: ${row.value}`), "", ...buttons.map((button) => `${button.label}: ${button.href}`)].join("\n");
    return { html, text };
}

const admin = (path: string) => `${SITE_URL}/admin${path}`;

export function renderNotification<E extends NotificationEvent>(event: E, payload: NotificationPayloads[E]): EmailContent {
    switch (event) {
        case "lead.new": {
            const lead = payload as LeadPayload;
            const digits = lead.phone.replace(/\D/g, "");
            const title = lead.isNew ? "عميل محتمل جديد" : "عميل رجع يتواصل تاني";
            const content = layout(
                title,
                lead.isNew ? `${lead.name} ساب رقمه وعايز تتواصل معاه.` : `${lead.name} ساب رقمه تاني — غالبًا مستني ردّك.`,
                [
                    { label: "الاسم", value: lead.name },
                    { label: "التليفون", value: lead.phone },
                    { label: "الخدمة", value: lead.service },
                    { label: "الرسالة", value: lead.message },
                    { label: "المصدر", value: SOURCE_LABELS[lead.source] ?? lead.source },
                    { label: "الصفحة", value: lead.page },
                ],
                [
                    { label: "اتصل", href: `tel:+${digits}` },
                    { label: "واتساب", href: `https://wa.me/${digits}` },
                    { label: "افتح العملاء", href: admin("/leads") },
                ]
            );
            return { subject: `${lead.isNew ? "عميل جديد" : "عميل رجع تاني"}: ${shorten(lead.name, 40)} — ${lead.phone}`, ...content };
        }
        case "user.signup": {
            const user = payload as SignupPayload;
            const content = layout("عضو جديد سجّل على الموقع", `${user.name} عمل حساب جديد.`, [
                { label: "الاسم", value: user.name },
                { label: "الإيميل", value: user.email },
                { label: "طريقة التسجيل", value: user.method },
            ], [{ label: "افتح الأعضاء", href: admin("/users") }]);
            return { subject: `عضو جديد: ${shorten(user.name, 50)}`, ...content };
        }
        case "article.pending": {
            const article = payload as ArticlePayload;
            const content = layout("مقال مستني موافقتك", `${article.authorName} كتب مقال جديد ومستني المراجعة قبل النشر.`, [
                { label: "العنوان", value: article.title },
                { label: "الكاتب", value: article.authorName },
                { label: "الملخص", value: article.summary ? shorten(article.summary, 400) : null },
            ], [{ label: "راجع المقالات", href: admin("/articles") }]);
            return { subject: `مقال مستني المراجعة: ${shorten(article.title, 60)}`, ...content };
        }
        case "post.pending": {
            const post = payload as PostPayload;
            const content = layout("منشور مستني موافقتك", `${post.authorName} نشر بوست جديد ومستني المراجعة.`, [
                { label: "الكاتب", value: post.authorName },
                { label: "المنشور", value: shorten(post.content, 500) },
            ], [{ label: "راجع المنشورات", href: admin("/posts") }]);
            return { subject: `منشور مستني المراجعة من ${shorten(post.authorName, 40)}`, ...content };
        }
        case "review.pending": {
            const review = payload as ReviewPayload;
            const stars = review.rating ? "★".repeat(Math.max(0, Math.min(5, Math.round(review.rating)))) : null;
            const content = layout("تقييم جديد مستني موافقتك", `${review.name} كتب تقييم جديد.`, [
                { label: "الاسم", value: review.name },
                { label: "التقييم", value: stars },
                { label: "الكلام", value: shorten(review.text, 600) },
            ], [{ label: "راجع التقييمات", href: admin("/reviews") }]);
            return { subject: `تقييم جديد من ${shorten(review.name, 40)}`, ...content };
        }
        default:
            throw new Error(`Unknown notification event: ${String(event)}`);
    }
}

export function renderTestEmail(siteName: string): EmailContent {
    const content = layout(
        "الإشعارات شغالة",
        `ده إيميل تجريبي من ${siteName}. لو وصلك يبقى الإعداد سليم، وهتوصلك إيميلات الأحداث اللي مفعّلها.`,
        [],
        [{ label: "افتح إعدادات الإشعارات", href: admin("/notifications") }]
    );
    return { subject: `إيميل تجريبي من ${siteName}`, ...content };
}
