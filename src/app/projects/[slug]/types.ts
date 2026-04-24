export interface ProjectData {
    id?: string;
    title?: string;
    name?: string;
    slug?: string;
    description?: string;
    category?: string;
    tags?: string;
    image?: string;
    gallery?: string[];
    link?: string;
    videoUrl?: string;
    embedCode?: string;
    [key: string]: unknown;
}
