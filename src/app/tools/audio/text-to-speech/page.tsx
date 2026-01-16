'use client';

import { useState, useEffect } from 'react';
import { Mic, Play, Pause, Download, Volume2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useToolHistory } from '@/hooks/useToolHistory';

export default function TextToSpeechPage() {
    const [text, setText] = useState('');
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string>('');
    const [speaking, setSpeaking] = useState(false);
    const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
    const { addToHistory } = useToolHistory();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const synthesis = window.speechSynthesis;
            setSynth(synthesis);

            const updateVoices = () => {
                const availableVoices = synthesis.getVoices();
                setVoices(availableVoices);
                // Try to find an Arabic voice by default, or English
                const defaultVoice = availableVoices.find(v => v.lang.includes('ar')) || availableVoices.find(v => v.lang.includes('en'));
                if (defaultVoice) setSelectedVoice(defaultVoice.name);
            };

            updateVoices();
            if (synthesis.onvoiceschanged !== undefined) {
                synthesis.onvoiceschanged = updateVoices;
            }
        }
    }, []);

    const handleSpeak = () => {
        if (!synth || !text) return;

        if (synth.speaking) {
            if (synth.paused) {
                synth.resume();
                setSpeaking(true);
            } else {
                synth.pause();
                setSpeaking(false);
            }
        } else {
            const utterance = new SpeechSynthesisUtterance(text);
            const voice = voices.find(v => v.name === selectedVoice);
            if (voice) utterance.voice = voice;

            utterance.onend = () => setSpeaking(false);

            synth.speak(utterance);
            setSpeaking(true);
            addToHistory('text-to-speech', 'تحويل النص لصوت', `Spoke text: ${text.slice(0, 30)}...`);
        }
    };

    const handleStop = () => {
        if (!synth) return;
        synth.cancel();
        setSpeaking(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Mic className="text-purple-400" />
                تحويل النص إلى صوت
            </h1>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="mb-6">
                    <label className="block text-sm text-slate-400 mb-2 font-bold">اختر المعلق الصوتي (Google & System Voices)</label>
                    <div className="relative">
                        <select
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white appearance-none outline-none focus:border-purple-500"
                        >
                            {voices.map(v => (
                                <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                            ))}
                        </select>
                        <Volume2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none" />
                    </div>
                </div>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="اكتب النص الذي تريد تحويله إلى صوت هنا..."
                    className="w-full h-64 bg-slate-950 border border-slate-700 rounded-xl p-6 text-lg text-slate-200 resize-none outline-none focus:border-purple-500 transition-colors mb-6 leading-relaxed"
                />

                <div className="flex gap-4">
                    <button
                        onClick={handleSpeak}
                        disabled={!text}
                        className={`flex-1 py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${speaking ? 'bg-orange-500 hover:bg-orange-600' : 'bg-purple-600 hover:bg-purple-700'}`}
                    >
                        {speaking ? <Pause className="fill-current" /> : <Play className="fill-current" />}
                        {speaking ? "إيقاف مؤقت" : "تشغيل الصوت"}
                    </button>

                    {speaking && (
                        <button
                            onClick={handleStop}
                            className="px-6 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 font-bold"
                        >
                            إيقاف
                        </button>
                    )}
                </div>

                <div className="mt-6 p-4 bg-blue-900/10 rounded-xl border border-blue-900/20 text-sm text-blue-300">
                    <p><strong>ملاحظة:</strong> هذه الأداة تستخدم محركات الصوت المدمجة في متصفحك (مثل Google Voices). لتحميل الملف كـ MP3، سنقوم قريباً بإضافة ميزة التسجيل السحابي AI.</p>
                </div>
            </div>
        </div>
    );
}
