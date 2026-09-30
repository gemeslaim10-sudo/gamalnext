import type { Metadata } from "next";
import { ServicePage, serviceMetadata, serviceStaticParams } from "@/components/services/servicePages";

type Props = { params: Promise<{ slug: string }> };

/** The Arabic version of each service page (only services that have Arabic texts). */
export async function generateStaticParams() {
    return serviceStaticParams("ar");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    return serviceMetadata(slug, "ar");
}

export default async function ArabicServiceDetailsPage({ params }: Props) {
    const { slug } = await params;
    return <ServicePage slug={slug} lang="ar" />;
}
