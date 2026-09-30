import type { Metadata } from "next";
import { ServicePage, serviceMetadata, serviceStaticParams } from "@/components/services/servicePages";

type Props = { params: Promise<{ slug: string }> };

/** Every service page is built ahead of time; a new one is built on its first visit. */
export async function generateStaticParams() {
    return serviceStaticParams("en");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    return serviceMetadata(slug, "en");
}

export default async function ServiceDetailsPage({ params }: Props) {
    const { slug } = await params;
    return <ServicePage slug={slug} lang="en" />;
}
