import Skills from "@/components/sections/Skills";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getDocument } from "@/lib/server-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "مهاراتي | جمال عبد العاطي - جمال ويب",
    description: "تعرف على الأدوات والتقنيات (جمال ويب) التي أتقنها في تطوير المهارات والـ SEO، من الويبسايت إلى تحليل البيانات.",
    keywords: ["جمال عبد العاطي", "جمال تك", "مهارات ويب", "جمال ويب", "تحليل بيانات", "مقالات seo"],
    alternates: {
        canonical: './',
    },
    openGraph: {
        title: "مهاراتي | جمال عبد العاطي - جمال ويب",
        description: "تعرف على الأدوات والتقنيات التي أتقنها في تطوير المواقع والتطبيقات.",
        images: ["/og-image.png"],
        url: 'https://gamaltech.info/skills',
    },
};

export const revalidate = 3600; // Revalidate every hour

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
                            "name": "الرئيسية",
                            "item": "https://gamaltech.info"
                        }, {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "مهاراتي",
                            "item": "https://gamaltech.info/skills"
                        }]
                    })
                }}
            />
        </main>
    );
}
