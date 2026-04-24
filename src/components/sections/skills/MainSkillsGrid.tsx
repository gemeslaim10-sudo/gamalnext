import { Code, Search, BarChart3, Database, LineChart } from 'lucide-react';
import Reveal from '../Reveal';

const iconMap: Record<string, React.ElementType> = {
    Code, Search, BarChart3, Database, LineChart
};

interface SkillItem {
    title: string;
    description: string;
    tags: string;
    icon: string;
}

interface MainSkillsGridProps {
    skills: SkillItem[];
}

export function MainSkillsGrid({ skills }: MainSkillsGridProps) {
    if (!skills || skills.length === 0) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8 mb-16 md:mb-20">
            {skills.map((skill, idx) => {
                const Icon = iconMap[skill.icon] || Code;
                const tags = skill.tags.split(',').map(t => t.trim());
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
                                {tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-slate-800/50 text-slate-300 rounded-full text-xs font-semibold border border-slate-700 group-hover:border-blue-500/20 group-hover:bg-blue-500/10 group-hover:text-blue-200 transition-all">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                );
            })}
        </div>
    );
}
