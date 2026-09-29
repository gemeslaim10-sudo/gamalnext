import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'
import { getCollection, getDocument } from '@/lib/server-utils'
import { slugify } from '@/lib/utils'

export const revalidate = 3600; // Revalidate every hour

interface Article {
    id: string;
    status?: string;
    updatedAt?: { seconds: number };
    createdAt?: { seconds: number };
}

interface ProjectsDoc {
    items?: { title?: string; name?: string }[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE_URL;

    // Static Routes
    const routes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/profile`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/skills`,
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
            url: `${baseUrl}/pricing`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    const [articles, projectsDoc, users] = await Promise.all([
        getCollection<Article>('articles'),
        getDocument<ProjectsDoc>('site_content', 'projects'),
        getCollection<{ id: string }>('users'),
    ]);

    // Project pages, with the same links the Projects page uses
    const projectSlugs = new Set(
        (projectsDoc?.items ?? []).map((project) => slugify(project.title || project.name || '')).filter(Boolean)
    );
    const projectRoutes: MetadataRoute.Sitemap = [...projectSlugs].map((slug) => ({
        url: `${baseUrl}/projects/${slug}`,
        changeFrequency: 'monthly',
        priority: 0.8,
    }));

    // Published articles (articles waiting for review stay out; no status = published before moderation existed)
    const articleRoutes: MetadataRoute.Sitemap = articles
        .filter((article) => article.status !== 'pending')
        .map((article) => ({
            url: `${baseUrl}/articles/${article.id}`,
            lastModified: new Date((article.updatedAt?.seconds || article.createdAt?.seconds || Date.now() / 1000) * 1000),
            changeFrequency: 'weekly',
            priority: 0.7,
        }));

    // Dynamic Users (Public Profiles)
    const userRoutes: MetadataRoute.Sitemap = users.map((user) => ({
        url: `${baseUrl}/users/${user.id}`,
        lastModified: new Date(Date.now()), // Users might not have updatedAt, default to now
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    return [...routes, ...projectRoutes, ...articleRoutes, ...userRoutes];
}
