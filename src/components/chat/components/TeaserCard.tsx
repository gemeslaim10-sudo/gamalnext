import { Send, Loader2 } from 'lucide-react';
import ChatHeader from '../ChatHeader';

interface TeaserCardProps {
    welcomeMsg?: { text: string };
    input: string;
    setInput: (val: string) => void;
    handleTeaserSubmit: (e: React.FormEvent) => void;
    loading: boolean;
}

export function TeaserCard({ welcomeMsg, input, setInput, handleTeaserSubmit, loading }: TeaserCardProps) {
    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl overflow-hidden">
            <ChatHeader className="p-4 flex items-center justify-between" />

            <div className="px-4 pb-3">
                <div className="bg-slate-800/50 rounded-xl p-3 text-sm text-slate-300 leading-relaxed" dir="auto">
                    {welcomeMsg ? welcomeMsg.text : (
                        <div className="flex items-center gap-2 text-slate-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Loading...</span>
                        </div>
                    )}
                </div>
            </div>

            <form onSubmit={handleTeaserSubmit} className="px-4 pb-4">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your reply..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-4 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                        dir="auto"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:bg-slate-700"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
