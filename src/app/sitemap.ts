import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'
import { getProjects, getPublicArticles, projectImage } from '@/lib/content/server'
import { articlePath } from '@/lib/articles/paths'
import { hasPage, servicePath, servicesIndexPath } from '@/lib/services/content'
import { getServicesContent } from '@/lib/services/server'
import { getAdminUids } from '@/lib/firebase-admin'

// Built from the cached content, so it changes exactly when the content does (every dashboard save
// or "Clear cache" rebuilds it) and "last modified" stays meaningful.

/** Pages every visitor can reach from the menu. */
const MAIN_PAGES = ['/', '/profile', '/projects', '/skills', '/articles', '/pricing', '/contact'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [projects, articles, services] = await Promise.all([getProjects(), getPublicArticles(), getServicesContent()]);
    const builtAt = new Date();
    const latestArticle = articles?.[0] ? new Date(articles[0].updatedAt || articles[0].createdAt) : undefined;

    const mainRoutes: MetadataRoute.Sitemap = MAIN_PAGES.map((path) => ({
        url: `${SITE_URL}${path === '/' ? '' : path}`,
        lastModified: path === '/articles' && latestArticle ? latestArticle : builtAt,
    }));

    // Project pages at the same addresses the project cards use, with their pictures
    const seen = new Set<string>();
    const projectRoutes: MetadataRoute.Sitemap = (projects ?? []).flatMap((project) => {
        if (!project.urlSlug || seen.has(project.urlSlug)) return [];
        seen.add(project.urlSlug);
        const images = [projectImage(project), ...((project.gallery as string[] | undefined) ?? [])].filter(
            (url): url is string => typeof url === 'string' && /^https?:\/\//.test(url)
        );
        return [{ url: `${SITE_URL}/projects/${project.urlSlug}`, lastModified: builtAt, images: [...new Set(images)].slice(0, 10) }];
    });

    // Published articles only (articles waiting for review stay out)
    const articleRoutes: MetadataRoute.Sitemap = (articles ?? []).map((article) => {
        const cover = article.media?.find((item) => item.type === 'image' && item.url)?.url;
        return {
            url: `${SITE_URL}${articlePath(article)}`,
            lastModified: new Date(article.updatedAt || article.createdAt || builtAt),
            ...(cover ? { images: [cover] } : {}),
        };
    });

    // Member pages of people who published articles (empty profiles aren't worth indexing); the
    // owner's own page is left out, /profile is the page about them
    const owners = await getAdminUids().catch(() => new Set<string>());
    const authors = [...new Set((articles ?? []).map((article) => article.authorId).filter((id) => id && !owners.has(id)))];
    const authorRoutes: MetadataRoute.Sitemap = authors.map((id) => ({ url: `${SITE_URL}/users/${id}` }));

    // Service pages, in English and (where written) Arabic, each listing its other language
    const withLanguages = (paths: { en?: string; ar?: string }): MetadataRoute.Sitemap => {
        const languages = Object.fromEntries(Object.entries(paths).filter(([, path]) => path).map(([lang, path]) => [lang, `${SITE_URL}${path}`]));
        const alternates = Object.keys(languages).length > 1 ? { alternates: { languages } } : {};
        return Object.values(languages).map((url) => ({ url, lastModified: builtAt, ...alternates }));
    };
    const english = services.items.filter((item) => hasPage(item, 'en'));
    const arabic = services.items.filter((item) => hasPage(item, 'ar'));
    const serviceRoutes: MetadataRoute.Sitemap = [
        ...(english.length || arabic.length
            ? withLanguages({ en: english.length ? servicesIndexPath('en') : undefined, ar: arabic.length ? servicesIndexPath('ar') : undefined })
            : []),
        ...services.items.flatMap((item) =>
            withLanguages({
                en: hasPage(item, 'en') ? servicePath(item.slug, 'en') : undefined,
                ar: hasPage(item, 'ar') ? servicePath(item.slug, 'ar') : undefined,
            })
        ),
    ];

    return [...mainRoutes, ...serviceRoutes, ...projectRoutes, ...articleRoutes, ...authorRoutes];
}
