// Server only — everything the English (/services/…) and Arabic (/ar/services/…) routes share:
// metadata with hreflang, the page itself and its structured data.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Page } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceView } from "@/components/services/ServiceView";
import { absoluteUrl, getSiteOpenGraph, getSiteSeo } from "@/lib/seo/server";
import { ORGANIZATION_ID, breadcrumbs, faqPage, itemList, offerPrice, pageGraph, webPage } from "@/lib/seo/structured-data";
import { splitList } from "@/lib/seo/settings";
import { hasPage, servicePath, servicesIndexPath } from "@/lib/services/content";
import {
    getServicePage,
    getServicePages,
    getServicesContent,
    relatedArticles,
    relatedProjects,
    servicePrices,
} from "@/lib/services/server";
import type { ServiceItem, ServiceLang } from "@/lib/services/types";

const OG_LOCALE: Record<ServiceLang, string> = { en: "en_US", ar: "ar_EG" };

/** hreflang links: every language this service (or the list) has a page in; English is the default. */
function languageAlternates(paths: Partial<Record<ServiceLang, string>>) {
    const languages: Record<string, string> = {};
    if (paths.en) languages.en = paths.en;
    if (paths.ar) languages.ar = paths.ar;
    const fallback = paths.en ?? paths.ar;
    if (fallback) languages["x-default"] = fallback;
    return languages;
}

function servicePaths(item: ServiceItem) {
    return {
        en: hasPage(item, "en") ? servicePath(item.slug, "en") : undefined,
        ar: hasPage(item, "ar") ? servicePath(item.slug, "ar") : undefined,
    };
}

// ── One service ───────────────────────────────────────────────────────────────

export async function serviceStaticParams(lang: ServiceLang) {
    return (await getServicePages(lang)).map((item) => ({ slug: item.slug }));
}

export async function serviceMetadata(slug: string, lang: ServiceLang): Promise<Metadata> {
    const [item, openGraph, content] = await Promise.all([getServicePage(slug, lang), getSiteOpenGraph(), getServicesContent()]);
    if (!item) return { title: content.labels[lang].services, robots: { index: false, follow: true } };
    const copy = item[lang];
    const path = servicePath(item.slug, lang);
    return {
        title: copy.seoTitle.trim() || copy.name,
        description: copy.seoDescription.trim() || copy.summary,
        alternates: { canonical: path, languages: languageAlternates(servicePaths(item)) },
        openGraph: { ...openGraph, url: path, locale: OG_LOCALE[lang], type: "website" },
    };
}

export async function ServicePage({ slug, lang }: { slug: string; lang: ServiceLang }) {
    const [item, content, site] = await Promise.all([getServicePage(slug, lang), getServicesContent(), getSiteSeo()]);
    if (!item) notFound();

    const copy = item[lang];
    const labels = content.labels[lang];
    const path = servicePath(item.slug, lang);
    const otherLang: ServiceLang = lang === "ar" ? "en" : "ar";
    const [prices, projects, articles] = await Promise.all([servicePrices(item), relatedProjects(item), relatedArticles(item.articleKeywords)]);
    const others = (await getServicePages(lang))
        .filter((other) => other.slug !== item.slug)
        .map((other) => ({ name: other[lang].name, summary: other[lang].summary, href: servicePath(other.slug, lang) }));

    const serviceId = `${absoluteUrl(path)}#service`;
    const jsonLd = pageGraph(
        webPage("WebPage", path, copy.seoTitle.trim() || copy.name, copy.seoDescription.trim() || copy.summary, {
            inLanguage: lang,
            about: { "@id": serviceId },
            mainEntity: { "@id": serviceId },
        }),
        {
            "@type": "Service",
            "@id": serviceId,
            name: copy.name,
            // The same service in both languages shares its English name as the type
            serviceType: item.en.name || copy.name,
            description: copy.seoDescription.trim() || copy.summary,
            url: absoluteUrl(path),
            provider: { "@id": ORGANIZATION_ID },
            areaServed: splitList(site.seo.business.areaServed),
            offers: prices.map((price) => ({
                "@type": "Offer",
                name: price.name,
                ...offerPrice(price.price, /^[A-Z]{3}$/.test(price.currency) ? price.currency : "USD", price.from),
                url: absoluteUrl("/pricing"),
            })),
        },
        faqPage(path, copy.faqs),
        breadcrumbs([
            { name: labels.home, path: "/" },
            { name: labels.services, path: servicesIndexPath(lang) },
            { name: copy.name, path },
        ])
    );

    return (
        <>
            <JsonLd data={jsonLd} />
            <ServiceView
                lang={lang}
                copy={copy}
                labels={labels}
                homeHref="/"
                servicesHref={servicesIndexPath(lang)}
                otherLanguageHref={hasPage(item, otherLang) ? servicePath(item.slug, otherLang) : undefined}
                prices={prices}
                projects={projects}
                articles={articles}
                others={others}
            />
        </>
    );
}

// ── The list of services ──────────────────────────────────────────────────────

export async function servicesIndexMetadata(lang: ServiceLang): Promise<Metadata> {
    const [content, openGraph, pages, otherPages] = await Promise.all([
        getServicesContent(),
        getSiteOpenGraph(),
        getServicePages(lang),
        getServicePages(lang === "ar" ? "en" : "ar"),
    ]);
    const copy = content.index[lang];
    const paths = { [lang]: servicesIndexPath(lang), ...(otherPages.length > 0 ? { [lang === "ar" ? "en" : "ar"]: servicesIndexPath(lang === "ar" ? "en" : "ar") } : {}) };
    return {
        title: copy.seoTitle.trim() || copy.h1,
        description: copy.seoDescription.trim() || copy.intro,
        alternates: { canonical: servicesIndexPath(lang), languages: languageAlternates(paths) },
        openGraph: { ...openGraph, url: servicesIndexPath(lang), locale: OG_LOCALE[lang], type: "website" },
        // An Arabic list with no Arabic pages would be empty
        ...(pages.length === 0 ? { robots: { index: false, follow: true } } : {}),
    };
}

export async function ServicesIndexPage({ lang }: { lang: ServiceLang }) {
    const [content, pages, otherPages] = await Promise.all([getServicesContent(), getServicePages(lang), getServicePages(lang === "ar" ? "en" : "ar")]);
    if (pages.length === 0) notFound();
    const copy = content.index[lang];
    const labels = content.labels[lang];
    const rtl = lang === "ar";
    const path = servicesIndexPath(lang);
    const otherLang: ServiceLang = rtl ? "en" : "ar";

    const jsonLd = pageGraph(
        webPage("CollectionPage", path, copy.seoTitle.trim() || copy.h1, copy.seoDescription.trim() || copy.intro, {
            inLanguage: lang,
            mainEntity: itemList(
                pages.map((item) => ({ name: item[lang].name, url: servicePath(item.slug, lang), description: item[lang].summary })),
                "Service"
            ),
        }),
        breadcrumbs([
            { name: labels.home, path: "/" },
            { name: labels.services, path },
        ])
    );

    return (
        <Page>
            <JsonLd data={jsonLd} />
            <div dir={rtl ? "rtl" : "ltr"} lang={rtl ? "ar" : undefined}>
                <header className="mb-10 max-w-content">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{copy.h1}</h1>
                    {copy.intro && <p className="mt-3 leading-relaxed text-muted sm:text-lg">{copy.intro}</p>}
                    {otherPages.length > 0 && (
                        <Link href={servicesIndexPath(otherLang)} hrefLang={otherLang} className="mt-4 inline-block text-sm text-muted underline-offset-4 hover:text-foreground hover:underline">
                            {labels.otherLanguage}
                        </Link>
                    )}
                </header>

                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pages.map((item) => (
                        <li key={item.slug}>
                            <Link
                                href={servicePath(item.slug, lang)}
                                className="group flex h-full flex-col rounded-card border border-border bg-surface p-5 transition-colors hover:border-border-strong hover:bg-surface-hover"
                            >
                                <h2 className="text-base font-semibold text-foreground">{item[lang].name}</h2>
                                {item[lang].summary && <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item[lang].summary}</p>}
                                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                                    {labels.learnMore}
                                    <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </Page>
    );
}
