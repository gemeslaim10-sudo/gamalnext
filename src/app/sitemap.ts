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
        // Tools Routes
        {
            url: `${baseUrl}/tools`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        { url: `${baseUrl}/tools/media/video-to-audio`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/tools/audio/text-to-speech`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/tools/translation/ai-translator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/tools/finance/currency`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/tools/data/table-generator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/tools/utils/qr-generator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/tools/security/password-generator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/tools/data/text-analyzer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/tools/media/image-compressor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/tools/media/youtube-thumbnail`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/tools/data/json-formatter`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/tools/utils/unit-converter`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/tools/utils/age-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/tools/utils/stopwatch`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ];

    // Dynamic Articles
    const articles = await getCollection<Article>('articles');
    const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
        url: `${baseUrl}/articles/${article.id}`,
        lastModified: new Date((article.updatedAt?.seconds || article.createdAt?.seconds || Date.now() / 1000) * 1000),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    // Dynamic Users (Public Profiles)
    const users = await getCollection<any>('users');
    const userRoutes: MetadataRoute.Sitemap = users.map((user) => ({
        url: `${baseUrl}/users/${user.id}`,
        lastModified: new Date(Date.now()), // Users might not have updatedAt, default to now
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    return [...routes, ...articleRoutes, ...userRoutes];
}
