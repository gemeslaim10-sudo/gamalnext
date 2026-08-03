'use client';

import { useState } from 'react';
import { Coins, RefreshCw, ArrowRightLeft } from 'lucide-react';
import { useToolHistory } from '@/hooks/useToolHistory';

const CURRENCIES = [
    { code: 'EGP', name: 'جنيه مصري', flag: '🇪🇬' },
    { code: 'USD', name: 'دولار أمريكي', flag: '🇺🇸' },
    { code: 'SAR', name: 'ريال سعودي', flag: '🇸🇦' },
    { code: 'AED', name: 'درهم إماراتي', flag: '🇦🇪' },
    { code: 'KWD', name: 'دينار كويتي', flag: '🇰🇼' },
    { code: 'GBP', name: 'جنيه إسترليني', flag: '🇬🇧' },
    { code: 'EUR', name: 'يورو', flag: '🇪🇺' },
];

export default function CurrencyPage() {
    const [amount, setAmount] = useState<number>(1);
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('EGP');
    const [result, setResult] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addToHistory } = useToolHistory();

    const handleConvert = async () => {
        setLoading(true);
        setError(null);
        try {
            // Using a free open API (ExchangeRate-API)
            const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
            if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json();
            const rate = data.rates[to];

            if (rate) {
                setResult(amount * rate);
                addToHistory('currency-converter', 'محول العملات', `Converted ${amount} ${from} to ${to}`);
            } else {
                setError("Conversion rate not found");
            }
        } catch (e) {
            console.error(e);
            setError("Failed to fetch live rates. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Coins className="text-green-400" />
                محول العملات اللحظي
            </h1>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-end mb-6">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">من</label>
                        <select
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                        >
                            {CURRENCIES.map(c => (
                                <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => { setFrom(to); setTo(from); }}
                        className="p-3 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors mb-1"
                    >
                        <ArrowRightLeft className="w-5 h-5 text-white" />
                    </button>

                    <div>
                        <label className="block text-sm text-slate-400 mb-2">إلى</label>
                        <select
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                        >
                            {CURRENCIES.map(c => (
                                <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-sm text-slate-400 mb-2">المبلغ</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-2xl font-bold text-white focus:border-green-500 outline-none"
                    />
                </div>

                <button
                    onClick={handleConvert}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-white text-lg shadow-lg flex items-center justify-center gap-2"
                >
                    {loading ? <RefreshCw className="animate-spin" /> : "تحويل العملة"}
                </button>

                {error && (
                    <div className="mt-4 text-center text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        {error}
                    </div>
                )}

                {result !== null && !error && (
                    <div className="mt-8 pt-8 border-t border-slate-800 text-center animate-in fade-in slide-in-from-bottom-4">
                        <div className="text-sm text-slate-500 mb-2">النتيجة (أسعار حقيقية)</div>
                        <div className="text-4xl font-bold text-white">
                            {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-green-400 text-2xl">{to}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
