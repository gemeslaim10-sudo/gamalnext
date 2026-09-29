import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { ButtonLink, Section } from "@/components/ui";
import { getCopy } from "@/lib/copy/server";
import { cn } from "@/lib/utils";
import { ArticleCard, hasAnyCover } from "./ArticleCard";
import type { ArticleSerialized, ArticleRaw } from "@/types";
import { getTimestampMs } from "@/types";

export const revalidate = 3600; // Revalidate every hour

/** Phones show the first few cards; the rest appear from the 2-column breakpoint up. */
const PHONE_LIMIT = 3;

async function getTrendingArticles(): Promise<ArticleSerialized[]> {
    try {
        const q = query(
            collection(db, "articles"),
            orderBy("createdAt", "desc"),
            limit(6)
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => {
            const data = d.data() as Omit<ArticleRaw, 'id'>;
            return {
                id: d.id,
                ...data,
                // Serialize all timestamps
                createdAt: getTimestampMs(data.createdAt) || Date.now(),
                updatedAt: getTimestampMs(data.updatedAt) || null
            };
        });
    } catch (e) {
        console.error("Error fetching trending articles:", e);
        return [];
    }
}

/** "Latest articles" on the profile page. Title and link text: /admin/copy → Profile page. */
export default async function TrendingArticles() {
    const [articles, t] = await Promise.all([getTrendingArticles(), getCopy()]);
    if (articles.length === 0) return null;

    const showCovers = hasAnyCover(articles);
    const viewAll = t("profile.articlesViewAll").trim();

    return (
        <Section
            id="articles"
            title={t("profile.articlesTitle")}
            action={
                viewAll && (
                    <ButtonLink href="/articles" variant="ghost">
                        {viewAll}
                        <ArrowRight />
                    </ButtonLink>
                )
            }
        >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article, index) => (
                    <ArticleCard
                        key={article.id}
                        article={article}
                        showCover={showCovers}
                        className={cn(index >= PHONE_LIMIT && "hidden sm:flex")}
                    />
                ))}
            </div>
        </Section>
    );
}
