import type { AiSettingsData } from "../useAiSettings";

interface AiKeysFormProps {
    formData: AiSettingsData;
    setFormData: React.Dispatch<React.SetStateAction<AiSettingsData>>;
}

export function AiKeysForm({ formData, setFormData }: AiKeysFormProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 ml-2 uppercase">Google Gemini (Primary)</label>
                <input 
                    type="password" 
                    value={formData.geminiKey} 
                    onChange={e => setFormData(prev => ({ ...prev, geminiKey: e.target.value }))} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none shadow-sm" 
                    placeholder="AIzaSy..." 
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 ml-2 uppercase">Groq Cloud (Fallback)</label>
                <input 
                    type="password" 
                    value={formData.groqKey} 
                    onChange={e => setFormData(prev => ({ ...prev, groqKey: e.target.value }))} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-orange-500 outline-none shadow-sm" 
                    placeholder="gsk_..." 
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 ml-2 uppercase">OpenRouter (Global)</label>
                <input 
                    type="password" 
                    value={formData.openRouterKey} 
                    onChange={e => setFormData(prev => ({ ...prev, openRouterKey: e.target.value }))} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none shadow-sm" 
                    placeholder="sk-or-v1-..." 
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 ml-2 uppercase">OpenAI (Legacy)</label>
                <input 
                    type="password" 
                    value={formData.openaiKey} 
                    onChange={e => setFormData(prev => ({ ...prev, openaiKey: e.target.value }))} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-white/20 outline-none shadow-sm" 
                    placeholder="sk-..." 
                />
            </div>
        </div>
    );
}
