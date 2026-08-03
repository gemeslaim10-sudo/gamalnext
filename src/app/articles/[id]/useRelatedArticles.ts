import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ArticleCard } from '@/types';

export type Article = ArticleCard;

export function useRelatedArticles(currentArticleId: string) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedArticles = async () => {
            try {
                const q = query(
                    collection(db, 'articles'),
                    orderBy('createdAt', 'desc'),
                    limit(4)
                );

                const snapshot = await getDocs(q);
                const allArticles = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as Article))
                    .filter(article => article.id !== currentArticleId); // Exclude current article

                setArticles(allArticles.slice(0, 3)); // Take only 3
            } catch (error) {
                console.error('Error fetching related articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedArticles();
    }, [currentArticleId]);

    return { articles, loading };
}
