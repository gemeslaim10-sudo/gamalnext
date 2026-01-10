import { MetadataRoute } from 'next'
import { getCollection } from '@/lib/server-utils'

export const revalidate = 3600; // Revalidate every hour

interface Article {
    id: string;
    updatedAt?: { seconds: number };
    createdAt?: { seconds: number };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://gamaltech.info';

    // Static Routes
    const routes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/skills`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/experience`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/articles`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    // Dynamic Articles
    const articles = await getCollection<Article>('articles');
    const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
        url: `${baseUrl}/articles/${article.id}`,
        lastModified: new Date((article.updatedAt?.seconds || article.createdAt?.seconds || Date.now() / 1000) * 1000),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    return [...routes, ...articleRoutes];
}
