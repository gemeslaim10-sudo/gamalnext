import Reveal from '../Reveal';

interface TechStackItem {
    name: string;
    val: string;
}

interface TechStackProgressProps {
    techStack: TechStackItem[];
}

export function TechStackProgress({ techStack }: TechStackProgressProps) {
    if (!techStack || techStack.length === 0) return null;

    return (
        <Reveal className="glass p-6 md:p-8 rounded-2xl border-slate-700">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-8 border-l-4 border-blue-500 pl-4">Tech Stack</h3>
            <div className="space-y-6">
                {techStack.map(item => (
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
    );
}
