'use client';
import { Code, Search, BarChart3, Database, LineChart } from 'lucide-react';
import Reveal from './Reveal';
import { useContent } from '@/hooks/useContent';

const iconMap: any = {
    Code, Search, BarChart3, Database, LineChart
};

const defaultSkillsData = {
    mainSkills: [
        { title: "Full Stack Web Development", description: "بناء وتطوير Web Applications باستخدام أطر عمل حديثة (Next.js, React)، مع التركيز على Performance و Scalability.", tags: "Next.js, React, Performance", icon: "Code" },
        { title: "Search Engine Optimization (SEO)", description: "تطبيق معايير Technical SEO و On-Page Optimization لضمان فهرسة صحيحة وظهور متقدم في نتائج البحث (SERPs).", tags: "Technical SEO, On-page, SERPs", icon: "Search" },
        { title: "Vibe Engineering & UX", description: "ضبط الطابع العام للمنتج الرقمي وتصميم تدفق تجربة المستخدم (User Flow) باستخدام مبادئ Vibe Engineering لخلق أثر ملموس.", tags: "Vibe Eng, User Flow, UX", icon: "LineChart" },
        { title: "Data Analytics & Tools", description: "رصد الأداء وتحليل سلوك المستخدمين عبر Google Analytics و Google Search Console لاتخاذ قرارات مبنية على البيانات.", tags: "Google Analytics, GSC, Data Insights", icon: "Database" }
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
        { name: 'Google Search Console', level: 'مستوى متقدم', color: 'text-orange-500' },
        { name: 'Google Analytics', level: 'مستوى متقدم', color: 'text-yellow-500' },
        { name: 'VS Code', level: 'مستوى متقدم', color: 'text-blue-400' },
        { name: 'Excel/Sheets', level: 'مستوى متقدم', color: 'text-green-400' },
        { name: 'WordPress', level: 'مستوى ممارس', color: 'text-white' },
    ]
};

export default function Skills({ initialData }: { initialData?: any }) {
    const { data } = useContent("site_content", "skills", defaultSkillsData);
    const skills = initialData || data || defaultSkillsData;

    return (
        <section id="skills" className="py-16 md:py-20 bg-slate-900 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        الخبرات <span className="text-blue-500">والكفاءات التقنية</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
                        تخصص دقيق في بناء الويب واستراتيجيات التصدر في محركات البحث
                    </p>
                </Reveal>

                {/* Main Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-20">
                    {skills.mainSkills?.map((skill: any, idx: number) => {
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
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-8 border-r-4 border-blue-500 pr-4">حزمة التقنيات البرمجية</h3>
                        <div className="space-y-6">
                            {skills.techStack?.map((item: any) => (
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
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 border-r-4 border-purple-500 pr-4">إتقان البرمجيات التطبيقية</h3>
                            <div className="flex flex-wrap gap-3">
                                {skills.software?.map((tool: any) => (
                                    <div key={tool.name} className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex-grow text-center">
                                        <h4 className="text-white text-sm font-bold">{tool.name}</h4>
                                        <span className={`${tool.color} text-xs`}>{tool.level}</span>
                                    </div>
                                ))}
                            </div>
                        </Reveal>

                        {/* Static Chart for Visual Balance */}
                        <Reveal className="glass p-6 md:p-8 rounded-2xl border-slate-700">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 border-r-4 border-cyan-500 pr-4">أدوات الإنتاجية اليومية</h3>
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
