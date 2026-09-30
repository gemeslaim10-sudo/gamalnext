// Server only — /llms.txt and /llms-full.txt: a plain Markdown summary of the business for AI
// assistants (who GTech is, services, prices, phone, projects, articles), following llmstxt.org.
// Built from the same cached dashboard data as the pages.
import { SITE_URL } from "@/lib/constants";
import { getProjects, getPublicArticles, projectImage } from "@/lib/content/server";
import { loadPricing } from "@/lib/pricing/server";
import { isListed } from "@/lib/pricing/utils";
import type { PricingItem } from "@/lib/pricing/types";
import { getSkillsData } from "@/components/sections/skills/data";
import { NAV_LINKS } from "@/config/navigation";
import { getCopy } from "@/lib/copy/server";
import { clean, getSiteSeo } from "./server";
import { splitList } from "./settings";

const oneLine = (text: unknown, max = 220) => {
    const flat = String(text ?? "").replace(/\s+/g, " ").trim();
    return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
};

const url = (path: string) => new URL(path, SITE_URL).toString();

export async function buildLlmsText({ full = false }: { full?: boolean } = {}) {
    const [site, pricingResult, skills, projects, articles, t] = await Promise.all([
        getSiteSeo(),
        loadPricing(),
        getSkillsData(),
        getProjects(),
        getPublicArticles(),
        getCopy(),
    ]);
    const { seo } = site;
    const business = seo.business;
    const pricing = pricingResult.status === "ok" ? pricingResult.content : null;
    const lines: string[] = [];
    const add = (...items: (string | false | null | undefined)[]) => lines.push(...items.filter((item): item is string => typeof item === "string"));

    // Title and summary
    add(`# ${site.businessName}`, "");
    const intro = site.fill(seo.ai.llmsIntro) || site.homeDescription;
    if (intro) add(`> ${oneLine(intro, 600)}`, "");
    const summary = site.fill(business.summary);
    if (summary && summary !== intro) add(summary, "");

    // Contact — the most important part for people asking an assistant how to reach the business
    add("## Contact", "");
    if (site.phoneDisplay) add(`- Phone and WhatsApp: ${site.phoneDisplay}${site.whatsapp ? ` (WhatsApp: https://wa.me/${site.whatsapp})` : ""}`);
    if (site.email) add(`- Email: ${site.email}`);
    const country = clean(business.country);
    const countryName = country && /^[A-Za-z]{2}$/.test(country) ? new Intl.DisplayNames(["en"], { type: "region" }).of(country.toUpperCase()) : country;
    const place = [clean(business.city), clean(business.region), countryName].filter(Boolean).join(", ");
    if (place) add(`- Location: ${place}`);
    const areas = splitList(business.areaServed);
    if (areas.length) add(`- Serves: ${areas.join(", ")}`);
    const languages = splitList(business.languages);
    if (languages.length) add(`- Languages: ${languages.join(", ")}`);
    if (clean(business.openingHours)) add(`- Opening hours: ${business.openingHours.trim()}`);
    add(`- Contact page (leave a name and phone number to be called back): ${url("/contact")}`);
    add(`- Website: ${SITE_URL}`, "");

    const facts = seo.ai.facts.map((fact) => site.fill(fact)).filter(Boolean);
    if (facts.length) add("## Key facts", "", ...facts.map((fact) => `- ${fact}`), "");

    // Services
    const services = (skills.mainSkills ?? []).filter((item) => clean(item.title));
    if (services.length) {
        add("## Services", "");
        for (const item of services) add(`- [${item.title.trim()}](${url("/skills")}): ${oneLine(item.description)}`);
        add("");
    }

    // Prices
    if (pricing) {
        const currency = pricing.labels.currency.trim() || "USD";
        const listed = (items: PricingItem[]) => items.filter(isListed);
        const describe = (item: PricingItem) => {
            const amount = item.price ? `${currency} ${item.price.toLocaleString("en-US")}` : "";
            const price = item.customQuote || !amount ? "custom quote" : item.priceFrom ? `from ${amount}` : amount;
            const details = full
                ? [item.description, item.pages, item.hosting, item.hostingCost].map((value) => oneLine(value, 160)).filter(Boolean).join("; ")
                : oneLine(item.description, 160);
            return `- ${item.name.trim()} — ${price}${details ? `: ${details}` : ""}`;
        };
        const packages = listed(pricing.packages);
        const custom = listed(pricing.services);
        if (packages.length || custom.length) {
            add("## Prices", "");
            if (packages.length) add(...packages.map(describe));
            if (custom.length) add(...custom.map(describe));
            const addons = pricing.addons.filter(isListed);
            if (full && addons.length) {
                add("", "Add-ons:");
                add(...addons.map((item) => `- ${item.name.trim()} — ${item.customQuote || !item.price ? "custom quote" : `${currency} ${item.price.toLocaleString("en-US")}`}${item.description ? `: ${oneLine(item.description, 160)}` : ""}`));
            }
            add(`- Full price list: ${url("/pricing")}`, "");
        }
        const faq = pricing.faq.filter((item) => item.visible && item.question.trim() && item.answer.trim());
        if (full && faq.length) {
            add("## Frequently asked questions", "");
            for (const item of faq) add(`### ${item.question.trim()}`, "", item.answer.trim(), "");
        }
    }

    // Founder
    add("## Founder", "");
    add(`- [${site.ownerName}](${url("/profile")})${site.ownerTitle ? ` — ${site.ownerTitle}` : ""}`);
    for (const link of [clean(site.settings?.githubUrl), clean(site.settings?.linkedinUrl), ...business.sameAs.map(clean)]) {
        if (link && /^https?:\/\//.test(link)) add(`- ${link}`);
    }
    add("");

    // Projects
    const titled = (projects ?? []).filter((project) => clean(project.title) || clean(project.name));
    if (titled.length) {
        add("## Projects", "");
        for (const project of titled) {
            const name = String(project.title || project.name).trim();
            const description = full ? String(project.description ?? "").trim() : oneLine(project.description, 200);
            add(`- [${name}](${url(`/projects/${project.urlSlug}`)})${description ? `: ${description}` : ""}`);
            if (full && project.tags) add(`  Technologies: ${String(project.tags)}`);
            if (full && typeof project.link === "string" && /^https?:\/\//.test(project.link)) add(`  Live site: ${project.link}`);
            if (full && projectImage(project)) add(`  Image: ${projectImage(project)}`);
        }
        add("");
    }

    // Articles
    if (articles?.length) {
        add("## Articles", "");
        for (const article of articles) {
            add(`- [${oneLine(article.title, 160)}](${url(`/articles/${article.id}`)})${article.summary ? `: ${oneLine(article.summary, 200)}` : ""}`);
        }
        add("");
        if (full) {
            for (const article of articles) {
                add(`### ${oneLine(article.title, 200)}`, "", `Source: ${url(`/articles/${article.id}`)}`, "", String(article.content ?? "").trim(), "");
            }
        }
    }

    // Pages
    add("## Pages", "");
    for (const link of NAV_LINKS.filter((item) => !item.external)) add(`- [${t(link.labelKey)}](${url(link.href)})`);
    add("");

    if (!full) add("## Optional", "", `- [Full text for AI assistants](${url("/llms-full.txt")})`, `- [Sitemap](${url("/sitemap.xml")})`, "");

    return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
