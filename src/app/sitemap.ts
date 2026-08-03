import { MetadataRoute } from 'next'
import { getCollection } from '@/lib/server-utils'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { slugify } from '@/lib/utils'

export const revalidate = 3600; // Revalidate every hour

interface Article {
    id: string;
    updatedAt?: { seconds: number };
    createdAt?: { seconds: number };
    status?: string;
}

interface ProjectItem {
    id?: string;
    slug?: string;
    title?: string;
    name?: string;
    updatedAt?: { seconds: number };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://gamaltech.info';

    // ── Static Routes ──────────────────────────────────────────────────────────
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/profile`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.95,
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
            url: `${baseUrl}/skills`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        // ── Tools ──────────────────────────────────────────────────────────────
        {
            url: `${baseUrl}/tools`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        { url: `${baseUrl}/tools/media/video-to-audio`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/tools/audio/text-to-speech`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/tools/translation/ai-translator`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/tools/finance/currency`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/tools/data/table-generator`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/tools/utils/qr-generator`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/tools/security/password-generator`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/tools/data/text-analyzer`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/tools/media/image-compressor`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/tools/media/youtube-thumbnail`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/tools/data/json-formatter`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/tools/utils/unit-converter`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/tools/utils/age-calculator`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/tools/utils/stopwatch`,              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ];

    // ── Dynamic: Articles (approved only) ─────────────────────────────────────
    let articleRoutes: MetadataRoute.Sitemap = [];
    try {
        const articles = await getCollection<Article>('articles');
        articleRoutes = articles
            .filter(a => !a.status || a.status === 'approved')
            .map((article) => ({
                url: `${baseUrl}/articles/${article.id}`,
                lastModified: new Date(
                    (article.updatedAt?.seconds || article.createdAt?.seconds || Date.now() / 1000) * 1000
                ),
                changeFrequency: 'weekly' as const,
                priority: 0.75,
            }));
    } catch { /* Graceful fallback */ }

    // ── Dynamic: Projects ──────────────────────────────────────────────────────
    let projectRoutes: MetadataRoute.Sitemap = [];
    try {
        const snap = await getDoc(doc(db, "site_content", "projects"));
        if (snap.exists()) {
            const projects: ProjectItem[] = snap.data()?.items || [];
            projectRoutes = projects
                .filter(p => p.title || p.name)
                .map((p, idx) => {
                    const slug = p.slug || slugify(p.title || p.name || '') || `proj-${idx}`;
                    return {
                        url: `${baseUrl}/projects/${slug}`,
                        lastModified: new Date(
                            (p.updatedAt?.seconds || Date.now() / 1000) * 1000
                        ),
                        changeFrequency: 'monthly' as const,
                        priority: 0.8,
                    };
                });
        }
    } catch { /* Graceful fallback */ }

    // ── Dynamic: Users (Public Profiles) ──────────────────────────────────────
    let userRoutes: MetadataRoute.Sitemap = [];
    try {
        const users = await getCollection<{ id: string }>('users');
        userRoutes = users.map((user) => ({
            url: `${baseUrl}/users/${user.id}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        }));
    } catch { /* Graceful fallback */ }

    return [
        ...staticRoutes,
        ...articleRoutes,
        ...projectRoutes,
        ...userRoutes,
    ];
}
