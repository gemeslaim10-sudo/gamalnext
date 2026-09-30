import { SITE_URL } from "@/lib/constants";
import { getCopy } from "@/lib/copy/server";
import { getPublicArticles } from "@/lib/content/server";
import { markdownExcerpt } from "@/lib/articles/plainText";
import { getSiteSeo } from "@/lib/seo/server";

// Cached with the site content: rebuilt when an article is published, edited or deleted
export const dynamic = "force-static";

const escapeXml = (text: string) =>
    text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** RSS feed of the published articles (feed readers, news aggregators and AI tools discover new posts here). */
export async function GET() {
    const [articles, site, t] = await Promise.all([getPublicArticles(), getSiteSeo(), getCopy()]);
    const items = (articles ?? []).slice(0, 50).map((article) => {
        const link = `${SITE_URL}/articles/${article.id}`;
        const cover = article.media?.find((item) => item.type === "image" && item.url)?.url;
        return [
            "<item>",
            `<title>${escapeXml(article.title || "")}</title>`,
            `<link>${link}</link>`,
            `<guid isPermaLink="true">${link}</guid>`,
            `<pubDate>${new Date(article.createdAt || Date.now()).toUTCString()}</pubDate>`,
            `<description>${escapeXml(article.summary?.trim() || markdownExcerpt(article.content || "", 300))}</description>`,
            article.authorName ? `<dc:creator>${escapeXml(article.authorName)}</dc:creator>` : "",
            ...(article.tags ?? []).map((tag) => `<category>${escapeXml(tag)}</category>`),
            cover ? `<enclosure url="${escapeXml(cover)}" type="image/jpeg" length="0" />` : "",
            "</item>",
        ]
            .filter(Boolean)
            .join("");
    });

    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
        "<channel>",
        `<title>${escapeXml(`${t("blog.title")} | ${site.siteName}`)}</title>`,
        `<link>${SITE_URL}/articles</link>`,
        `<description>${escapeXml(site.fill(site.seo.pages.articles.description) || site.description || site.siteName)}</description>`,
        "<language>en</language>",
        `<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
        ...items,
        "</channel>",
        "</rss>",
    ].join("\n");

    return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
