import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { getCollection } from "@/lib/server-utils";
import Link from "next/link";
import { MoveRight, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

// SEO Metadata
export const metadata = {
    title: "المقالات التقنية | Gamal Selim",
    description: "مقالات حصرية في تطوير الويب، الذكاء الاصطناعي، وتحليل البيانات.",
};

export const revalidate = 60; // Helper for ISG

export default async function ArticlesPage() {
    // Fetch articles on server
    let articles: any[] = [];
    try {
        const rawArticles = await getCollection("articles");
        // Sort by createdAt desc
        articles = rawArticles.sort((a: any, b: any) => {
            const dateA = a.createdAt?.seconds || 0;
            const dateB = b.createdAt?.seconds || 0;
            return dateB - dateA;
        }).map((article: any) => ({
            ...article,
            // Serialize timestamps to numbers to pass to Client Component
            createdAt: article.createdAt?.seconds ? article.createdAt.seconds * 1000 : Date.now(),
            updatedAt: article.updatedAt?.seconds ? article.updatedAt.seconds * 1000 : null
        }));
    } catch (e) {
        console.error("Failed to fetch articles server side", e);
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <Navbar />

            <section className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            المقالات <span className="text-blue-500">التقنية</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-8">
                            أحدث ما توصلت إليه في مجالات البرمجة والذكاء الاصطناعي
                        </p>
                        <Link href="/write" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
                            <span className="text-xl">✍️</span> شارك بمقالك
                        </Link>
                    </div>

                    <ArticlesList initialArticles={articles} />
                </div>
            </section>

            <Footer />
            <Toaster />
        </main>
    );
}

// Separate Client Component for Data Fetching
import ArticlesList from "./ArticlesList";
