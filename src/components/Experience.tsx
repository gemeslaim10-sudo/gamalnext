'use client';
import { Building2 } from 'lucide-react';
import Reveal from './Reveal';
import { useContent } from '@/hooks/useContent';

const defaultExperienceData = {
    items: [
        { title: "مطور ومصمم مواقع ويب", period: "شهران", description: "تطوير مواقع كاملة مع لوحات تحكم ديناميكية.", active: true },
        { title: "محلل بيانات", period: "شهر واحد", description: "تحليل الحملات الإعلانية وتقديم تقارير الأداء.", active: false },
        { title: "مدخل بيانات", period: "3 أشهر", description: "إدارة وتنظيم البيانات بدقة عالية.", active: false }
    ]
};

export default function Experience({ initialData }: { initialData?: any }) {
    const { data } = useContent("site_content", "experience", defaultExperienceData);
    const experience = initialData || data || defaultExperienceData;

    return (
        <section id="experience" className="py-20 bg-slate-950">
            <div className="max-w-4xl mx-auto px-4">
                <Reveal className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">الخبرات السابقة</h2>
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
                        <Building2 className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-300 text-sm font-medium">تدرج وظيفي داخل وكالة إعلانات</span>
                    </div>
                </Reveal>

                <Reveal className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-transparent opacity-80"></div>
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>

                    <div className="relative border-r-2 border-slate-800 mr-2 md:mr-4 space-y-12">
                        {experience.items?.map((item: any, idx: number) => (
                            <div key={idx} className="relative pr-8 md:pr-12 group">
                                <div className={`absolute -right-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-950 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 group-hover:scale-125 ${item.active ? 'bg-blue-500 box-shadow-glow' : 'bg-slate-700'}`}></div>

                                <div className="flex flex-col sm:flex-row justify-between gap-3 mb-3">
                                    <h4 className={`text-xl font-bold transition-colors ${item.active ? 'text-blue-400 text-gradient' : 'text-slate-200 group-hover:text-white'}`}>{item.title}</h4>
                                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700 w-fit group-hover:border-blue-500/30 transition-colors">{item.period}</span>
                                </div>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed group-hover:text-slate-300 transition-colors">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
