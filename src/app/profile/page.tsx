import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import FeaturedProjects from "@/components/projects/FeaturedProjects";
import FeaturedTools from "@/components/sections/FeaturedTools";
import TrendingArticles from "@/components/articles/TrendingArticles";
import Reviews from "@/components/reviews/Reviews";
import Footer from "@/components/layout/Footer";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile",
    description: "Welcome to my personal portfolio and professional profile.",
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
