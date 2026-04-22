import Skills from "@/components/sections/Skills";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getDocument } from "@/lib/server-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Skills | Gamal Abdelaty - Gamal Web",
    description: "Learn about the tools and technologies I master in building websites, e-commerce stores, Shopify, and WordPress.",
    keywords: ["Gamal Abdelaty", "Gamal Tech", "Web Skills", "Gamal Web", "Building Websites", "Shopify Stores", "WhatsApp API"],
    alternates: {
        canonical: './',
    },
    openGraph: {
        title: "My Skills | Gamal Abdelaty - Gamal Web",
        description: "Learn about the tools and technologies I master in developing websites and applications.",
        images: ["/og-image.png"],
        url: 'https://gamaltech.info/skills',
    },
};

export const revalidate = 0; // Revalidate immediately (dynamic)

export default async function SkillsPage() {
    const skillsData = await getDocument("site_content", "skills");

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />
            <div className="pt-20">
                <Skills initialData={skillsData} />
            </div>
            <Footer />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [{
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://gamaltech.info"
                        }, {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "My Skills",
                            "item": "https://gamaltech.info/skills"
                        }]
                    })
                }}
            />
        </main>
    );
}
