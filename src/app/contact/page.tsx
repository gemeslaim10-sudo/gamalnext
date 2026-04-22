import Contact from "@/components/sections/Contact";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Me | Gamal Abdelaty - Web Services",
    description: "Contact me to discuss your next project, build a website, a Shopify store, or for any technical inquiries.",
    keywords: ["Gamal Abdelaty", "Gamal Tech", "Web Services", "How to create a website", "Contact Me", "Web Developer"],
    alternates: {
        canonical: './',
    },
    openGraph: {
        title: "Contact Me | Gamal Abdelaty - Gamal Web",
        description: "Contact me to discuss your next project, web development and e-commerce services, or any technical inquiries.",
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
