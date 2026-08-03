import Reveal from '../Reveal';

export function ProductivityChart() {
    return (
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
    );
}
