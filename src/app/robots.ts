import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // Dashboard, API and signed-in-only pages (writing, editing, account settings)
            disallow: ['/admin', '/api', '/write', '/settings', '/edit/', '/articles/*/edit'],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    }
}
