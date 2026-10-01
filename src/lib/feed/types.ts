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
    /** The month the project was done, "YYYY-MM" (dashboard) */
    date?: string;
    createdAt?: string;
    [key: string]: unknown;
}

export interface FeedItem {
    id: string;
    type: "article" | "post" | "project";
    title: string;
    description: string;
    fullContent?: string;
    imageUrl: string | null;
    gallery?: string[] | null;
    mediaType: string;
    videoUrl?: string | null;
    link: string;
    /** When it was published (articles, posts) or done (projects, to the month); undated projects have none */
    createdAt?: string;
    /** What the feed ranks it by: the date, or for an undated project its place in the dashboard order */
    rankAt: string;
    author?: string;
    authorPhoto?: string | null;
    byOwner?: boolean;
    userId?: string;
}
