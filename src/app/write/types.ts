export interface WriteFormData {
    title: string;
    content: string;
    summary: string;
    tags: string;
    media: { url: string; type: 'image' | 'video' }[];
}
