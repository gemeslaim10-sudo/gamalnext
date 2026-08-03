import { Sparkles, Printer } from "lucide-react";

export function CvBuilderHeader({ onPrint }: { onPrint: () => void }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-white">AI CV Builder &amp; Generator</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Craft professional, ATS-friendly resumes dynamically in seconds</p>
                </div>
            </div>
            <button
                onClick={onPrint}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20"
            >
                <Printer className="w-4 h-4" /> Print / Export PDF
            </button>
        </div>
    );
}
