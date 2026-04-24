import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import FeaturedProjects from "@/components/projects/FeaturedProjects";
import FeaturedTools from "@/components/sections/FeaturedTools";
import TrendingArticles from "@/components/articles/TrendingArticles";
import Reviews from "@/components/reviews/Reviews";
import Footer from "@/components/layout/Footer";

export const revalidate = 0; // Revalidate immediately (dynamic)

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedProjects />
      <FeaturedTools />
      <TrendingArticles />
      <Reviews />
      <Footer />
    </div>
  );
}
