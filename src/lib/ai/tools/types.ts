export interface AIProject {
    title?: string;
    description?: string;
    tags?: string;
    category?: string;
}

export interface AIArticle {
    title?: string;
    description?: string;
    slug?: string;
}

export interface AISkill {
    title?: string;
    description?: string;
}

export interface CollectLeadArgs {
    name: string;
    phone: string;
    field?: string;
    service?: string;
}
