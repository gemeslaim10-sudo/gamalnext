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
    heroTitle: "Gamal Abdelaty",
    heroSubtitle: "Web Developer, E-commerce, and WhatsApp API",
    heroDescription: "Specializing in creating scalable websites, premium e-commerce stores, and intelligent WhatsApp API solutions. I transform complex ideas into elegant digital experiences that drive real business growth.",
    whatsappNumber: "201024531452",
    resumeLink: "#projects",
    avatarImage: ""
};

export const STATS = [
    { label: "Completed Projects", value: 120, suffix: "+", icon: Briefcase },
    { label: "Happy Clients", value: 98, suffix: "%", icon: Star },
    { label: "Technologies", value: 30, suffix: "+", icon: Code2 },
    { label: "Years Exp.", value: 5, suffix: "+", icon: TrendingUp },
];
