import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://gamaltech.info';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/api', '/write'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
