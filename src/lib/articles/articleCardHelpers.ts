import type { FirebaseTimestamp } from '@/types';
import { getTimestampMs, formatTimestamp } from '@/types';
import { markdownExcerpt } from './plainText';

export type ArticleBase = {
    id: string;
    title: string;
    summary?: string;
    content?: string;
    media: { url: string; type: 'image' | 'video' }[];
    createdAt: FirebaseTimestamp;
};

export const getArticleSummary = (article: { summary?: string; content?: string }, maxLength: number = 100) => {
    if (article.summary) return article.summary;
    // The text is Markdown: show it without its marks
    return article.content ? markdownExcerpt(article.content, maxLength) : "";
};

export const formatArticleDateEn = (timestamp: FirebaseTimestamp) => {
    return formatTimestamp(timestamp, 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatArticleDateAr = (ca: FirebaseTimestamp) => {
    const ms = getTimestampMs(ca);
    if (!ms) return 'الان';
    return new Date(ms).toLocaleDateString('ar-EG');
};
