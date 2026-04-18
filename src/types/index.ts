/**
 * Core Domain Types
 * Centrally defined to ensure scalability and cross-component consistency.
 */

export type Category = 'design' | 'video' | 'software';

export interface Project {
    id?: string;
    title: string;
    description: string;
    image: string;
    category: Category;
    tags: string;
    link?: string;
    videoUrl?: string;
    embedCode?: string;
    featured?: boolean;
    createdAt?: string;
}

export interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
    description: string;
    image?: string;
    category?: string;
    tags?: string[];
    createdAt: string;
}

export interface Skill {
    id: string;
    title: string;
    level: number;
    category: string;
    description?: string;
    icon?: string;
}

export interface Review {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar?: string;
}

export interface Lead {
    id?: string;
    name: string;
    phone: string;
    field?: string;
    service?: string;
    capturedAt: any;
    source: string;
    userId?: string;
}

export interface AiSettings {
    systemRole: string;
    prompt: string;
    stylePrompt: string;
    welcomeMessage: string;
    geminiKey?: string;
    groqKey?: string;
    openRouterKey?: string;
    modelName: string;
}
