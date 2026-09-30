import type { Metadata } from "next";
import { ServicesIndexPage, servicesIndexMetadata } from "@/components/services/servicePages";

// Texts: /admin/services → the services list
export async function generateMetadata(): Promise<Metadata> {
    return servicesIndexMetadata("en");
}

export default function ServicesPage() {
    return <ServicesIndexPage lang="en" />;
}
