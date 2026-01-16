import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import FeaturedTools from "@/components/FeaturedTools";
import TrendingArticles from "@/components/TrendingArticles";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
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
