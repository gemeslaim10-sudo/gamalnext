import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "اتصل بي | جمال عبد العاطي - خدمات مواقع",
    description: "تواصل معي لمناقشة مشروعك القادم، خدمات الـ SEO، أو لأي استفسارات تقنية حول كيفية عمل ويبسايت.",
    keywords: ["جمال عبد العاطي", "جمال تك", "خدمات مواقع", "ازاي اعمل ويبسايت", "اتصل بي", "مطور ويب"],
    openGraph: {
        title: "اتصل بي | جمال عبد العاطي - جمال ويب",
        description: "تواصل معي لمناقشة مشروعك القادم، خدمات الـ SEO، أو لأي استفسارات تقنية.",
        images: ["/og-image.png"],
        url: 'https://gamaltech.info/contact',
    },
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />
            <div className="pt-20">
                <Contact />
            </div>
            <Footer />
        </main>
    );
}
