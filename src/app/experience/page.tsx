import Experience from "@/components/sections/Experience";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getDocument } from "@/lib/server-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "خبراتي | جمال سليم - جمال ويب",
    description: "ملخص لمسيرتي المهنية (جمال سليم) والخبرات التي اكتسبتها في مجال جمال تحليل بيانات والـ SEO.",
    keywords: ["جمال عبد العاطي", "جمال سليم", "جمال تك", "خبرة ويب", "جمال تحليل بيانات", "جمال seo"],
    alternates: {
        canonical: './',
    },
    openGraph: {
        title: "خبراتي | جمال سليم - جمال ويب",
        description: "ملخص لمسيرتي المهنية والخبرات التي اكتسبتها في مجال تطوير الويب والتحصيل الرقمي.",
        images: ["/og-image.png"],
        url: 'https://gamaltech.info/experience',
    },
};

export const revalidate = 0; // Revalidate immediately (dynamic)

export default async function ExperiencePage() {
    const experienceData = await getDocument("site_content", "experience");

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />
            <div className="pt-20">
                <Experience initialData={experienceData} />
            </div>
            <Footer />
        </main>
    );
}
