import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgePercent } from "lucide-react";
import { Alert, Card, Page, PageHeader, Section } from "@/components/ui";
import { loadPricing } from "@/lib/pricing/server";
import { isListed, phoneLinks } from "@/lib/pricing/utils";
import { getSiteOpenGraph } from "@/lib/seo/server";
import { AddonList } from "./components/AddonList";
import { ContactBlock } from "./components/ContactBlock";
import { FaqList } from "./components/FaqList";
import { PricingItemCard } from "./components/PricingItemCard";

// Prices change often: always render from the latest saved content
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
    const result = await loadPricing();
    if (result.status === "missing") return {};

    const { seo } = result.content;
    // Empty fields fall back to the site-wide metadata from the root layout
    const title = seo.title.trim() || undefined;
    const description = seo.description.trim() || undefined;
    const keywords = seo.keywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean);

    return {
        title: title ? { absolute: title } : undefined,
        description,
        keywords: keywords.length > 0 ? keywords : undefined,
        alternates: { canonical: "./" },
        // Shared links take the title and description above
        openGraph: await getSiteOpenGraph(),
    };
}

export default async function PricingPage() {
    const result = await loadPricing();
    // No saved document means the page was never set up (the dashboard creates it on first save)
    if (result.status === "missing") notFound();

    const { header, offer, labels, sections, contact, ...content } = result.content;
    const packages = content.packages.filter(isListed);
    const addons = content.addons.filter(isListed);
    const services = content.services.filter(isListed);
    const infoCards = content.infoCards.filter((card) => card.visible && (card.title.trim() || card.text.trim()));
    const faq = content.faq.filter((item) => item.visible && item.question.trim() && item.answer.trim());
    const hasContact =
        contact.email.trim() !== "" || contact.numbers.some((entry) => phoneLinks(entry.number, contact.countryCode));

    return (
        <Page>
            {header.eyebrow && <p className="mb-2 text-sm font-medium text-subtle">{header.eyebrow}</p>}
            {(header.title || header.description) && (
                <PageHeader title={header.title} description={header.description || undefined} />
            )}

            {offer.enabled && offer.text.trim() && (
                <Alert className="mb-8 flex items-start gap-2.5 text-foreground sm:mb-10">
                    <BadgePercent aria-hidden className="mt-0.5 size-4 shrink-0 text-muted" />
                    <span dir="auto">{offer.text}</span>
                </Alert>
            )}

            {/* The first section sits right under the header and the last one above the footer */}
            <div className="[&>section:first-child]:pt-0 [&>section:last-child]:pb-0">
                {packages.length > 0 && (
                    <Section id="packages" title={sections.packages.title} description={sections.packages.description}>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {packages.map((item) => (
                                <PricingItemCard key={item.id} item={item} labels={labels} />
                            ))}
                        </div>
                    </Section>
                )}

                {addons.length > 0 && (
                    <Section id="add-ons" title={sections.addons.title} description={sections.addons.description}>
                        <AddonList addons={addons} labels={labels} />
                    </Section>
                )}

                {services.length > 0 && (
                    <Section id="services" title={sections.services.title} description={sections.services.description}>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((item) => (
                                <PricingItemCard key={item.id} item={item} labels={labels} showQuoteLabel={false} />
                            ))}
                        </div>
                    </Section>
                )}

                {infoCards.length > 0 && (
                    <Section id="good-to-know" title={sections.info.title} description={sections.info.description}>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {infoCards.map((card) => (
                                <Card key={card.id} className="reveal">
                                    {card.title && (
                                        <h3 dir="auto" className="text-base font-semibold text-foreground">
                                            {card.title}
                                        </h3>
                                    )}
                                    {card.text && (
                                        <p dir="auto" className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted first:mt-0">
                                            {card.text}
                                        </p>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </Section>
                )}

                {faq.length > 0 && (
                    <Section id="faq" title={sections.faq.title} description={sections.faq.description}>
                        <FaqList items={faq} />
                    </Section>
                )}

                {hasContact && (
                    <Section id="contact" title={sections.contact.title} description={sections.contact.description}>
                        <ContactBlock contact={contact} labels={labels} />
                    </Section>
                )}
            </div>
        </Page>
    );
}
