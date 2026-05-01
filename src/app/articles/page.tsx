import { getCollection } from "@/lib/server-utils";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import type { ArticleRaw, ArticleSerialized } from "@/types";
import { getTimestampMs } from "@/types";

import { Metadata } from "next";

// SEO Metadata
export const metadata: Metadata = {
    title: "المقالات التقنية | جمال عبد العاطي",
    description: "مقالات حصرية في إنشاء مواقع الويب وتطوير المتاجر الإلكترونية.",
    alternates: {
        canonical: './',
    },
};

export const revalidate = 0; // Helper for dynamic

export default async function ArticlesPage() {
    // Fetch articles on server
    let articles: ArticleSerialized[] = [];
    try {
        const rawArticles = await getCollection<ArticleRaw>("articles");
        // Sort by createdAt desc
        articles = rawArticles.sort((a, b) => {
            const dateA = getTimestampMs(a.createdAt);
            const dateB = getTimestampMs(b.createdAt);
            return dateB - dateA;
        }).map((article) => ({
            ...article,
            // Serialize timestamps to numbers to pass to Client Component
            createdAt: getTimestampMs(article.createdAt) || 0,
            updatedAt: getTimestampMs(article.updatedAt) || null
        }));
    } catch (e) {
        console.error("Failed to fetch articles server side", e);
    }

    return (
        <div className="min-h-screen">
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
        </div>
    );
}

// Separate Client Component for Data Fetching
import ArticlesList from "./ArticlesList";
