import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import FeaturedProjects from "@/components/projects/FeaturedProjects";
import FeaturedTools from "@/components/sections/FeaturedTools";
import TrendingArticles from "@/components/articles/TrendingArticles";
import Reviews from "@/components/reviews/Reviews";
import Footer from "@/components/layout/Footer";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "الملف الشخصي | مطور باك اند وخدمات DevOps | Gamal Tech",
    description: "جمال عبد العاطي - مطور باك اند محترف، خبير في DevOps وخدمات الاستضافة وإدارة قواعد البيانات. استعرض أعماله ومهاراته التقنية.",
    keywords: [
        "مطور باك اند", "جمال تك", "جمال عبد العاطي", "خدمات باك اند",
        "Gamal Tech", "Gamal Abdelaty", "Backend Developer", "Portfolio"
    ],
    alternates: { canonical: 'https://gamaltech.info/profile' },
    openGraph: {
        title: "الملف الشخصي | جمال تك - مطور باك اند",
        description: "جمال عبد العاطي - مطور باك اند محترف وخبير DevOps واستضافة.",
        images: ["/og-image.png"],
        url: 'https://gamaltech.info/profile',
    },
};

export const revalidate = 0; // Revalidate immediately (dynamic)

export default function ProfilePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <FeaturedProjects />
      <FeaturedTools />
      <TrendingArticles />
      <Reviews />
      <Footer />
    </main>
  );
}
