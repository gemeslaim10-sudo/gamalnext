export type ArticleBase = {
    id: string;
    title: string;
    summary?: string;
    content?: string;
    media: { url: string; type: 'image' | 'video' }[];
    createdAt: any;
};

export const getArticleSummary = (article: { summary?: string; content?: string }, maxLength: number = 100) => {
    if (article.summary) return article.summary;
    if (!article.content) return "";
    return article.content.substring(0, maxLength) + "...";
};

export const formatArticleDateEn = (timestamp: any) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatArticleDateAr = (ca: any) => {
    if (!ca) return 'الان';
    if (ca instanceof Date) {
        return ca.toLocaleDateString('ar-EG');
    }
    if (typeof ca === 'string') {
        return new Date(ca).toLocaleDateString('ar-EG');
    }
    if (typeof ca === 'object') {
        if ('toDate' in ca && typeof ca.toDate === 'function') {
            return ca.toDate().toLocaleDateString('ar-EG');
        }
        if ('seconds' in ca && typeof ca.seconds === 'number') {
            return new Date(ca.seconds * 1000).toLocaleDateString('ar-EG');
        }
    }
    return 'الان';
};
