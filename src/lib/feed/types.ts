export interface ProjectItem {
    id?: string;
    slug?: string;
    title?: string;
    name?: string;
    summary?: string;
    description?: string;
    image?: string;
    imageUrl?: string;
    gallery?: string[];
    videoUrl?: string;
    createdAt?: string;
    [key: string]: unknown;
}

export interface FeedItem {
    id: string;
    type: string;
    title: string;
    description: string;
    fullContent?: string;
    imageUrl: string | null;
    gallery?: string[] | null;
    mediaType: string;
    videoUrl?: string | null;
    link: string;
    createdAt: string;
    author?: string;
    userId?: string;
}
