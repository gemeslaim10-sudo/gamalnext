export type UserProfile = {
    uid: string;
    name: string;
    photoURL?: string;
    bio?: string;
    location?: string;
    jobTitle?: string;
    socialStatus?: string;
    createdAt?: { seconds: number; nanoseconds: number } | null;
};

export type UserArticle = {
    id: string;
    title: string;
    summary: string;
    media: { url: string; type: 'image' | 'video' }[];
    createdAt: { seconds: number; nanoseconds: number } | null;
    likesCount?: number;
};
