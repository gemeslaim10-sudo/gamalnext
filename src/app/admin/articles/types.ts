export type MediaItem = {
    url: string;
    type: 'image' | 'video';
}

export type Article = {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    media: MediaItem[];
    status?: 'published' | 'pending';
    authorName?: string;
    authorId?: string;
    createdAt: any;
}

export const initialForm = {
    title: "",
    slug: "",
    summary: "",
    content: "",
    media: [] as MediaItem[]
};
