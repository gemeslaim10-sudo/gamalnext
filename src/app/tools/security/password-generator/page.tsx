'use client';

import { useState } from 'react';
import { Lock, RefreshCw, Copy, Check, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useToolHistory } from '@/hooks/useToolHistory';

export default function PasswordGeneratorPage() {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [copied, setCopied] = useState(false);
    const { addToHistory } = useToolHistory();

    const generatePassword = () => {
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let chars = lower;
        if (includeUppercase) chars += upper;
        if (includeNumbers) chars += numbers;
        if (includeSymbols) chars += symbols;

        let generated = '';
        for (let i = 0; i < length; i++) {
            generated += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(generated);
        setCopied(false);
        // We log the action, but NOT the password itself for security
        addToHistory('password-generator', 'مولد كلمات المرور', `Generated a ${length}-char password`);
    };

    const copyToClipboard = () => {
        if (!password) return;
        navigator.clipboard.writeText(password);
        setCopied(true);
        toast.success("تم النسخ!");
        setTimeout(() => setCopied(false), 2000);
    };

    // Auto generate on first load
    useState(() => {
        generatePassword();
    });

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Lock className="text-red-400" />
                مولد كلمات مرور قوية
            </h1>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                {/* Display */}
                <div className="relative mb-8">
                    <div className="bg-slate-950 border border-slate-700 rounded-xl p-6 text-center">
                        <span className="text-2xl md:text-3xl font-mono font-bold tracking-wider text-white break-all">
                            {password}
                        </span>
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 hover:text-white transition-colors"
                        title="Copy"
                    >
                        {copied ? <Check className="w-6 h-6 text-green-400" /> : <Copy className="w-6 h-6" />}
                    </button>
                </div>

                {/* Strength Meter */}
                <div className="flex gap-1 mb-8">
                    <div className={`h-2 flex-1 rounded-full ${length > 8 ? 'bg-red-500' : 'bg-slate-700'}`}></div>
                    <div className={`h-2 flex-1 rounded-full ${length > 10 ? 'bg-orange-500' : 'bg-slate-700'}`}></div>
                    <div className={`h-2 flex-1 rounded-full ${length > 12 ? 'bg-yellow-500' : 'bg-slate-700'}`}></div>
                    <div className={`h-2 flex-1 rounded-full ${length >= 14 && includeSymbols ? 'bg-green-500' : 'bg-slate-700'}`}></div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-sm text-slate-400 mb-2">
                            <span>طول كلمة المرور</span>
                            <span>{length} حرف</span>
                        </div>
                        <input
                            type="range"
                            min="8"
                            max="64"
                            value={length}
                            onChange={(e) => setLength(Number(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="flex items-center gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 cursor-pointer hover:border-blue-500 transition-colors">
                            <input type="checkbox" checked={includeUppercase} onChange={e => setIncludeUppercase(e.target.checked)} className="w-5 h-5 rounded accent-blue-500" />
                            <span className="text-slate-300">حروف كبيرة (A-Z)</span>
                        </label>
                        <label className="flex items-center gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 cursor-pointer hover:border-blue-500 transition-colors">
                            <input type="checkbox" checked={includeNumbers} onChange={e => setIncludeNumbers(e.target.checked)} className="w-5 h-5 rounded accent-blue-500" />
                            <span className="text-slate-300">أرقام (0-9)</span>
                        </label>
                        <label className="flex items-center gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 cursor-pointer hover:border-blue-500 transition-colors">
                            <input type="checkbox" checked={includeSymbols} onChange={e => setIncludeSymbols(e.target.checked)} className="w-5 h-5 rounded accent-blue-500" />
                            <span className="text-slate-300">رموز (!@#$)</span>
                        </label>
                    </div>

                    <button
                        onClick={generatePassword}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" /> توليد كلمة مرور جديدة
                    </button>

                    <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        يتم التوليد محلياً في المتصفح. لا يتم إرسال أي بيانات للسيرفر.
                    </div>
                </div>
            </div>
        </div>
    );
}
