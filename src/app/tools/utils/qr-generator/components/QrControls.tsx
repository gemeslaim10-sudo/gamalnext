import { Link as LinkIcon, ShieldCheck, Palette, Maximize } from 'lucide-react';
import { ERROR_LEVELS, type ErrorCorrectionLevel } from '../types';

interface QrControlsProps {
    text: string;
    setText: (t: string) => void;
    errorLevel: ErrorCorrectionLevel;
    setErrorLevel: (level: ErrorCorrectionLevel) => void;
    fgColor: string;
    setFgColor: (c: string) => void;
    bgColor: string;
    setBgColor: (c: string) => void;
    margin: number;
    setMargin: (m: number) => void;
}

export function QrControls({
    text,
    setText,
    errorLevel,
    setErrorLevel,
    fgColor,
    setFgColor,
    bgColor,
    setBgColor,
    margin,
    setMargin
}: QrControlsProps) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            {/* Text Input */}
            <div>
                <label className="block text-sm text-slate-400 mb-2 font-bold flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    النص أو الرابط
                </label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="أدخل رابط، نص، رقم تليفون، أو أي بيانات..."
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none resize-none transition-colors"
                    dir="auto"
                />
                <p className="text-xs text-slate-600 mt-1 text-left" dir="ltr">
                    {text.length > 0 ? `${new TextEncoder().encode(text).length} bytes` : ''}
                </p>
            </div>

            {/* Error Correction Level */}
            <div>
                <label className="block text-sm text-slate-400 mb-2 font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    مستوى تصحيح الأخطاء
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {ERROR_LEVELS.map((level) => (
                        <button
                            key={level.value}
                            onClick={() => setErrorLevel(level.value)}
                            className={`p-3 rounded-xl border text-right transition-all ${
                                errorLevel === level.value
                                    ? 'border-blue-500 bg-blue-500/10 text-white'
                                    : 'border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600'
                            }`}
                        >
                            <span className="block text-sm font-bold">{level.label}</span>
                            <span className="block text-xs opacity-70 mt-0.5">{level.desc}</span>
                        </button>
                    ))}
                </div>
                <p className="text-xs text-amber-400/80 mt-2">
                    💡 للطباعة: استخدم Q أو H عشان الكود يفضل شغال حتى لو اتأذى جزء منه.
                </p>
            </div>

            {/* Colors */}
            <div>
                <label className="block text-sm text-slate-400 mb-2 font-bold flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    الألوان
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="block text-xs text-slate-500 mb-1">لون الرمز</span>
                        <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl p-2.5">
                            <input
                                type="color"
                                value={fgColor}
                                onChange={(e) => setFgColor(e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-none shrink-0"
                            />
                            <input
                                type="text"
                                value={fgColor}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setFgColor(v);
                                }}
                                className="bg-transparent text-xs text-slate-400 w-full outline-none font-mono"
                                dir="ltr"
                            />
                        </div>
                    </div>
                    <div>
                        <span className="block text-xs text-slate-500 mb-1">لون الخلفية</span>
                        <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl p-2.5">
                            <input
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-none shrink-0"
                            />
                            <input
                                type="text"
                                value={bgColor}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setBgColor(v);
                                }}
                                className="bg-transparent text-xs text-slate-400 w-full outline-none font-mono"
                                dir="ltr"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Margin */}
            <div>
                <label className="block text-sm text-slate-400 mb-2 font-bold flex items-center gap-2">
                    <Maximize className="w-4 h-4" />
                    الهامش: {margin} وحدات
                </label>
                <input
                    type="range"
                    min="0"
                    max="8"
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>0 (بدون)</span>
                    <span>8 (أقصى)</span>
                </div>
            </div>
        </div>
    );
}
