'use client';
import { Code, Search, BarChart3, Database, LineChart } from 'lucide-react';
import Reveal from './Reveal';
import { useContent } from '@/hooks/useContent';

const iconMap: Record<string, React.ElementType> = {
    Code, Search, BarChart3, Database, LineChart
};

interface SkillItem {
    title: string;
    description: string;
    tags: string;
    icon: string;
}

interface TechStackItem {
    name: string;
    val: string;
}

interface SoftwareItem {
    name: string;
    level: string;
    color: string;
}

interface SkillsData {
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

                {/* Main Skills Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8 mb-16 md:mb-20">
                    {skills.mainSkills?.map((skill: SkillItem, idx: number) => {
                        const Icon = iconMap[skill.icon] || Code;
                        const tags = skill.tags.split(',').map((t: string) => t.trim());
                        return (
                            <Reveal key={idx} className={`stagger-${(idx % 4) + 1} glass-card p-6 md:p-8 rounded-2xl group relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10">
                                    <div className="bg-slate-800/50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300 border border-slate-700 group-hover:border-blue-500/30">
                                        <Icon className="w-7 h-7 text-blue-400 group-hover:text-blue-300" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">{skill.title}</h3>
                                    <p className="text-slate-400 mb-6 text-sm md:text-base leading-relaxed">{skill.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag: string) => (
                                            <span key={tag} className="px-3 py-1 bg-slate-800/50 text-slate-300 rounded-full text-xs font-semibold border border-slate-700 group-hover:border-blue-500/20 group-hover:bg-blue-500/10 group-hover:text-blue-200 transition-all">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>

                {/* Progress Bars & Tools */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {/* Tech Stack Progress */}
                    <Reveal className="glass p-6 md:p-8 rounded-2xl border-slate-700">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-8 border-l-4 border-blue-500 pl-4">Tech Stack</h3>
                        <div className="space-y-6">
                            {skills.techStack?.map((item: TechStackItem) => (
                                <div key={item.name}>
                                    <div className="flex justify-between mb-2 text-sm md:text-base">
                                        <span className="text-slate-300 font-medium">{item.name}</span>
                                        <span className="text-blue-400">{item.val}</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="progress-bar h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000 ease-out" style={{ width: '100%', maxWidth: item.val }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    {/* Software Levels */}
                    <div className="space-y-6 md:space-y-8">
                        <Reveal className="glass p-6 md:p-8 rounded-2xl border-slate-700">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-purple-500 pl-4">Software Proficiency</h3>
                            <div className="flex flex-wrap gap-3">
                                {skills.software?.map((tool: SoftwareItem) => (
                                    <div key={tool.name} className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex-grow text-center">
                                        <h4 className="text-white text-sm font-bold">{tool.name}</h4>
                                        <span className={`${tool.color} text-xs`}>{tool.level}</span>
                                    </div>
                                ))}
                            </div>
                        </Reveal>

                        {/* Static Chart for Visual Balance */}
                        <Reveal className="glass p-6 md:p-8 rounded-2xl border-slate-700">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 border-l-4 border-cyan-500 pl-4">Daily Productivity Tools</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">GeminiPro</span>
                                        <span className="text-blue-400 font-mono">60%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2">
                                        <div className="bg-[#3b82f6] h-2 rounded-full" style={{ width: "60%" }}></div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
