import type { FirebaseTimestamp } from '@/types';
import { getTimestampMs, formatTimestamp } from '@/types';

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
    if (!article.content) return "";
    return article.content.substring(0, maxLength) + "...";
};

export const formatArticleDateEn = (timestamp: FirebaseTimestamp) => {
    return formatTimestamp(timestamp, 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatArticleDateAr = (ca: FirebaseTimestamp) => {
    const ms = getTimestampMs(ca);
    if (!ms) return 'الان';
    return new Date(ms).toLocaleDateString('ar-EG');
};
