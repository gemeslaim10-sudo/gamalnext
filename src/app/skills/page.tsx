import Skills from "@/components/Skills";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDocument } from "@/lib/server-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "مهاراتي | جمال عبد العاطي - جمال ويب",
    description: "تعرف على الأدوات والتقنيات (جمال ويب) التي أتقنها في تطوير المهارات والـ SEO، من الويبسايت إلى تحليل البيانات.",
    keywords: ["جمال عبد العاطي", "جمال تك", "مهارات ويب", "جمال ويب", "تحليل بيانات", "مقالات seo"],
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
        </main>
    );
}
