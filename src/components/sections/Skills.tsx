'use client';
import Reveal from './Reveal';
import { useContent } from '@/hooks/useContent';

import { MainSkillsGrid } from './skills/MainSkillsGrid';
import { TechStackProgress } from './skills/TechStackProgress';
import { SoftwareLevels } from './skills/SoftwareLevels';
import { ProductivityChart } from './skills/ProductivityChart';

export interface SkillItem {
    title: string;
    description: string;
    tags: string;
    icon: string;
}

export interface TechStackItem {
    name: string;
    val: string;
}

export interface SoftwareItem {
    name: string;
    level: string;
    color: string;
}

export interface SkillsData {
    mainSkills?: SkillItem[];
    techStack?: TechStackItem[];
    software?: SoftwareItem[];
}

const defaultSkillsData = {
    mainSkills: [
        { title: "Websites Development", description: "Building modern, responsive websites that meet all needs and provide an exceptional user experience.", tags: "Web Development, Frontend, Backend", icon: "Code" },
        { title: "E-commerce Stores", description: "Developing integrated e-commerce stores with payment gateways and product management at the highest quality standards.", tags: "E-commerce, Online Store, Payment Integration", icon: "Database" },
        { title: "WordPress & Shopify", description: "Professionally building and managing WordPress sites and Shopify stores to facilitate your business and grow your sales.", tags: "WordPress, Shopify, CMS", icon: "BarChart3" },
        { title: "WhatsApp API Integration", description: "Connecting and integrating WhatsApp API services to automate messaging and improve communication with your customers effectively.", tags: "WhatsApp API, Chatbots, Integration", icon: "LineChart" }
    ],
    techStack: [
        { name: 'React.js', val: '95%' },
        { name: 'Supabase', val: '90%' },
        { name: 'Firebase', val: '85%' },
        { name: 'Next.js', val: '85%' },
        { name: 'MySQL', val: '80%' },
        { name: 'Laravel', val: '70%' },
    ],
    software: [
        { name: 'Shopify', level: 'Advanced', color: 'text-green-500' },
        { name: 'WordPress', level: 'Advanced', color: 'text-blue-500' },
        { name: 'VS Code', level: 'Advanced', color: 'text-blue-400' },
        { name: 'WhatsApp API', level: 'Advanced', color: 'text-green-400' },
        { name: 'Postman', level: 'Intermediate', color: 'text-orange-400' },
    ]
};

export default function Skills({ initialData }: { initialData?: SkillsData }) {
    const { data } = useContent("site_content", "skills", defaultSkillsData);
    const skills = initialData || data || defaultSkillsData;

    return (
        <section id="skills" className="py-16 md:py-20 bg-slate-900 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Technical <span className="text-blue-500">Expertise</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
                        Specialized in web development, e-commerce stores, and WhatsApp API solutions
                    </p>
                </Reveal>

                <MainSkillsGrid skills={skills.mainSkills || []} />

                {/* Progress Bars & Tools */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    <TechStackProgress techStack={skills.techStack || []} />

                    <div className="space-y-6 md:space-y-8">
                        <SoftwareLevels software={skills.software || []} />
                        <ProductivityChart />
                    </div>
                </div>
            </div>
        </section>
    );
}
