import { Briefcase, Star, Code2, TrendingUp } from 'lucide-react';

export interface HeroData {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    whatsappNumber: string;
    resumeLink: string;
    avatarImage: string;
}

export const defaultHeroData: HeroData = {
    heroTitle: "Gamal Tech",
    heroSubtitle: "مطور باك اند - خدمات DevOps، استضافة، وإدارة قواعد البيانات",
    heroDescription: "جمال تك متقدم في عمل باك اند وإنشاء خوادم فائقة الأداء، تقديم خدمات باك اند متكاملة مع DevOps، خدمات استضافة سريعة وآمنة، مع إدارة وحماية قواعد البيانات من الاختراق لضمان استقرار موقعك.",
    whatsappNumber: "201024531452",
    resumeLink: "#projects",
    avatarImage: ""
};

export const STATS = [
    { label: "مشاريع باك اند", value: 120, suffix: "+", icon: Briefcase },
    { label: "خدمات DevOps", value: 98, suffix: "%", icon: Star },
    { label: "قواعد البيانات", value: 30, suffix: "+", icon: Code2 },
    { label: "سنوات الخبرة", value: 5, suffix: "+", icon: TrendingUp },
];
