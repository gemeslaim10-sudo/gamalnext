import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'
import { getSeoSettings } from '@/lib/seo/server'

// Dashboard, API and signed-in-only pages (writing, editing, account settings)
const PRIVATE_PATHS = ['/admin', '/api', '/write', '/settings', '/edit/', '/articles/*/edit'];

/**
 * AI assistants and their crawlers — both the ones that fetch pages to answer and cite (ChatGPT
 * search, Perplexity, Claude, Copilot…) and the ones that collect training data. Used only when the
 * owner turns AI access off in /admin/seo; otherwise the rule for everyone below lets them in.
 */
const AI_CRAWLERS = [
    'OAI-SearchBot', 'ChatGPT-User', 'GPTBot',
    'Claude-SearchBot', 'Claude-User', 'ClaudeBot', 'anthropic-ai',
    'PerplexityBot', 'Perplexity-User',
    'Google-Extended', 'Applebot-Extended',
    'CCBot', 'Meta-ExternalAgent', 'Meta-ExternalFetcher', 'Amazonbot', 'Bytespider',
    'DuckAssistBot', 'MistralAI-User', 'cohere-ai',
];

export default async function robots(): Promise<MetadataRoute.Robots> {
    const seo = await getSeoSettings();
    const rules: MetadataRoute.Robots['rules'] = [{ userAgent: '*', allow: '/', disallow: PRIVATE_PATHS }];
    if (!seo.ai.allowAiCrawlers) {
        rules.push({ userAgent: AI_CRAWLERS, disallow: '/' });
    }
    return { rules, sitemap: `${SITE_URL}/sitemap.xml` };
}
