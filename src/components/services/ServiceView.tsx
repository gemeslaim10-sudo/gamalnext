import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Card, Page, buttonVariants } from "@/components/ui";
import { ArticleCard, hasAnyCover } from "@/components/articles/ArticleCard";
import ProjectCard from "@/components/projects/ProjectCard";
import { RequestButton } from "@/app/pricing/components/RequestButton";
import { formatPrice } from "@/lib/pricing/utils";
import { cn } from "@/lib/utils";
import type { RelatedArticle, RelatedProject, ServiceLink, ServicePrice } from "@/lib/services/server";
import type { ServiceCopy, ServiceLabels, ServiceLang } from "@/lib/services/types";

interface ServiceViewProps {
    lang: ServiceLang;
    copy: ServiceCopy;
    labels: ServiceLabels;
    /** Breadcrumb targets */
    homeHref: string;
    servicesHref: string;
    /** The same page in the other language, when it exists */
    otherLanguageHref?: string;
    prices: ServicePrice[];
    projects: RelatedProject[];
    articles: RelatedArticle[];
    others: ServiceLink[];
}

/** Paragraphs are separated by a blank line in the dashboard. */
const paragraphs = (text: string) =>
    text
        .split(/\n\s*\n/)
        .map((part) => part.trim())
        .filter(Boolean);

const H2 = "text-xl font-semibold tracking-tight text-foreground";

/**
 * A service page: what it is (answer first), who it's for, the problems it solves, what's included,
 * the process and the questions people ask; prices and a request button on the side; related
 * projects, articles and services underneath. Works left-to-right and right-to-left.
 */
export function ServiceView({ lang, copy, labels, homeHref, servicesHref, otherLanguageHref, prices, projects, articles, others }: ServiceViewProps) {
    const rtl = lang === "ar";
    const intro = paragraphs(copy.intro);
    const arrow = <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />;
    const request = (className?: string, variant: "primary" | "secondary" = "primary") => (
        <RequestButton service={copy.name} label={labels.ctaButton} variant={variant} source="services" className={className} />
    );

    return (
        <Page>
            <div dir={rtl ? "rtl" : "ltr"} lang={rtl ? "ar" : undefined}>
                <nav aria-label={labels.services} className="mb-6 text-sm text-subtle">
                    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <li>
                            <Link href={homeHref} className="transition-colors hover:text-foreground">
                                {labels.home}
                            </Link>
                        </li>
                        <li aria-hidden>/</li>
                        <li>
                            <Link href={servicesHref} className="transition-colors hover:text-foreground">
                                {labels.services}
                            </Link>
                        </li>
                        <li aria-hidden>/</li>
                        <li aria-current="page" className="text-muted">
                            {copy.name}
                        </li>
                    </ol>
                </nav>

                <header className="max-w-content">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{copy.h1}</h1>
                    {intro.map((text, index) => (
                        <p key={index} className={cn("mt-4 leading-relaxed", index === 0 ? "text-base text-foreground/90 sm:text-lg" : "text-muted")}>
                            {text}
                        </p>
                    ))}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        {request()}
                        {otherLanguageHref && (
                            <Link href={otherLanguageHref} className={buttonVariants({ variant: "ghost" })} hrefLang={rtl ? "en" : "ar"}>
                                {labels.otherLanguage}
                            </Link>
                        )}
                    </div>
                </header>

                <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-12">
                    <div className="min-w-0 space-y-12 lg:col-span-2">
                        {copy.audience.length > 0 && (
                            <section>
                                <h2 className={H2}>{copy.audienceTitle}</h2>
                                <ul className="mt-4 space-y-2 text-muted">
                                    {copy.audience.map((line) => (
                                        <li key={line} className="flex gap-3 leading-relaxed">
                                            <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-subtle" />
                                            <span>{line}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {copy.problems.length > 0 && (
                            <section>
                                <h2 className={H2}>{copy.problemsTitle}</h2>
                                <ul className="mt-4 space-y-2 text-muted">
                                    {copy.problems.map((line) => (
                                        <li key={line} className="flex gap-3 leading-relaxed">
                                            <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-subtle" />
                                            <span>{line}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {copy.includes.length > 0 && (
                            <section>
                                <h2 className={H2}>{copy.includesTitle}</h2>
                                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {copy.includes.map((line) => (
                                        <li key={line} className="flex gap-3 rounded-card border border-border bg-surface p-4 text-sm leading-relaxed text-foreground/90">
                                            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-muted" />
                                            <span>{line}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {copy.process.length > 0 && (
                            <section>
                                <h2 className={H2}>{copy.processTitle}</h2>
                                <ol className="mt-4 space-y-4">
                                    {copy.process.map((step, index) => (
                                        <li key={`${step.title}-${index}`} className="flex gap-4">
                                            <span
                                                aria-hidden
                                                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-sm font-medium tabular-nums text-muted"
                                            >
                                                {index + 1}
                                            </span>
                                            <div className="min-w-0 pt-1">
                                                <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                                                {step.text && <p className="mt-1 text-sm leading-relaxed text-muted">{step.text}</p>}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </section>
                        )}

                        {copy.faqs.length > 0 && (
                            <section>
                                <h2 className={H2}>{copy.faqTitle}</h2>
                                <div className="mt-4 divide-y divide-border rounded-card border border-border bg-surface">
                                    {copy.faqs.map((faq) => (
                                        <div key={faq.question} className="p-4 sm:p-5">
                                            <h3 className="text-base font-semibold text-foreground">{faq.question}</h3>
                                            <p className="mt-2 text-sm leading-relaxed text-muted">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="lg:sticky lg:top-20 lg:self-start">
                        <Card padding="lg" className="space-y-4">
                            {prices.length > 0 && (
                                <>
                                    <h2 className="text-base font-semibold text-foreground">{labels.startingFrom}</h2>
                                    <ul className="divide-y divide-border text-sm">
                                        {prices.map((price) => (
                                            <li key={price.id} className="flex items-baseline justify-between gap-4 py-2">
                                                <span className="min-w-0 text-muted">{price.name}</span>
                                                <span dir="ltr" className="shrink-0 font-medium tabular-nums text-foreground">
                                                    {price.from && <span className="me-1 font-normal text-subtle">{labels.priceFrom}</span>}
                                                    {formatPrice(price.price, price.currency)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href="/pricing" className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline hover:underline-offset-4">
                                        {labels.allPrices} {arrow}
                                    </Link>
                                </>
                            )}
                            {request("w-full")}
                            <Link href="/contact" className="block text-center text-sm text-muted transition-colors hover:text-foreground">
                                {labels.contactLink}
                            </Link>
                        </Card>
                    </aside>
                </div>

                {projects.length > 0 && (
                    <section className="mt-16">
                        <h2 className={H2}>{labels.relatedProjects}</h2>
                        <div dir="ltr" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project) => (
                                <ProjectCard key={project.href} project={{ title: project.title, image: project.image }} />
                            ))}
                        </div>
                    </section>
                )}

                {articles.length > 0 && (
                    <section className="mt-16">
                        <h2 className={H2}>{labels.relatedArticles}</h2>
                        <div dir="ltr" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {articles.map((article) => (
                                <ArticleCard key={article.id} article={article} showCover={hasAnyCover(articles)} />
                            ))}
                        </div>
                    </section>
                )}

                <section className="mt-16">
                    <Card padding="lg" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <h2 className={H2}>{copy.ctaTitle}</h2>
                            {copy.ctaText && <p className="mt-2 max-w-2xl leading-relaxed text-muted">{copy.ctaText}</p>}
                        </div>
                        {request("shrink-0")}
                    </Card>
                </section>

                {others.length > 0 && (
                    <section className="mt-16">
                        <h2 className={H2}>{labels.otherServices}</h2>
                        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {others.map((service) => (
                                <li key={service.href}>
                                    <Link
                                        href={service.href}
                                        className="group block h-full rounded-card border border-border bg-surface p-4 transition-colors hover:border-border-strong hover:bg-surface-hover"
                                    >
                                        <span className="flex items-center justify-between gap-3 font-medium text-foreground">
                                            {service.name}
                                            <ArrowRight aria-hidden className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                                        </span>
                                        {service.summary && <span className="mt-1 block text-sm leading-relaxed text-muted">{service.summary}</span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </Page>
    );
}
