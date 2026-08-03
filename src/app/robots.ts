import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://gamaltech.info';

    return {
        rules: [
            {
                // Allow all crawlers full access
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin',
                    '/admin/',
                    '/api/',
                    '/write',
                    '/write/',
                    '/settings',
                    '/settings/',
                    '/edit/',
                    '/_next/',
                    '/gamal-cv', // Internal tool, not for public indexing
                ],
            },
            {
                // Explicitly allow Googlebot full access
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/admin', '/admin/',
                    '/api/', '/write/', '/settings/', '/edit/', '/_next/', '/gamal-cv',
                ],
            },
            {
                // Explicitly allow Google Image Bot
                userAgent: 'Googlebot-Image',
                allow: '/',
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    }
}
