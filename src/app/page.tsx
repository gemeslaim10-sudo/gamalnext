import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrendingArticles from "@/components/TrendingArticles";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <Hero />
      <TrendingArticles />
      <Reviews />
      <Footer />
    </main>
  );
}
