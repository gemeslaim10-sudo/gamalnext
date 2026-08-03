import Reveal from '../Reveal';

interface SoftwareItem {
    name: string;
    level: string;
    color: string;
}

interface SoftwareLevelsProps {
    software: SoftwareItem[];
}

export function SoftwareLevels({ software }: SoftwareLevelsProps) {
    if (!software || software.length === 0) return null;

    return (
        <Reveal className="glass p-6 md:p-8 rounded-2xl border-slate-700">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-purple-500 pl-4">Software Proficiency</h3>
            <div className="flex flex-wrap gap-3">
                {software.map(tool => (
                    <div key={tool.name} className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex-grow text-center">
                        <h4 className="text-white text-sm font-bold">{tool.name}</h4>
                        <span className={`${tool.color} text-xs`}>{tool.level}</span>
                    </div>
                ))}
            </div>
        </Reveal>
    );
}
