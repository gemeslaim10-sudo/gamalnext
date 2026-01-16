'use client';

import { useState, useEffect } from 'react';
import { Ruler, ArrowRightLeft } from 'lucide-react';
import { useToolHistory } from '@/hooks/useToolHistory';

const CATEGORIES: Record<string, { name: string; units: Record<string, number> }> = {
    length: { name: 'الطول / المسافة', units: { m: 1, km: 1000, cm: 0.01, mm: 0.001, inch: 0.0254, ft: 0.3048, mile: 1609.34 } },
    weight: { name: 'الوزن / الكتلة', units: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 } },
    time: { name: 'الزمن', units: { s: 1, min: 60, h: 3600, d: 86400 } }
};

export default function UnitConverterPage() {
    const [category, setCategory] = useState<string>('length');
    const [amount, setAmount] = useState<number>(1);
    const [from, setFrom] = useState('m');
    const [to, setTo] = useState('km');
    const { addToHistory } = useToolHistory();

    const result = (amount * CATEGORIES[category].units[from]) / CATEGORIES[category].units[to];

    // Debounce history saving to avoid spamming while typing
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (amount > 0) {
                addToHistory('unit-converter', 'محول الوحدات', `Converted ${amount} ${from} to ${to}`);
            }
        }, 2000);
        return () => clearTimeout(timeout);
    }, [amount, from, to]);

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Ruler className="text-indigo-400" />
                محول الوحدات
            </h1>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                {/* Category Selector */}
                <div className="flex bg-slate-950 p-1 rounded-xl mb-8">
                    {Object.entries(CATEGORIES).map(([key, data]) => (
                        <button
                            key={key}
                            onClick={() => { setCategory(key as any); setFrom(Object.keys(data.units)[0]); setTo(Object.keys(data.units)[1]); }}
                            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${category === key ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {data.name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-end mb-6">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">من</label>
                        <select
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none"
                        >
                            {Object.keys(CATEGORIES[category].units).map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>

                    <div className="p-3 mb-1 text-slate-500"><ArrowRightLeft className="w-5 h-5" /></div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-2">إلى</label>
                        <select
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none"
                        >
                            {Object.keys(CATEGORIES[category].units).map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mb-8">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-2xl font-bold text-white outline-none focus:border-indigo-500"
                    />
                </div>

                <div className="bg-indigo-600/10 border border-indigo-600/20 rounded-xl p-6 text-center">
                    <div className="text-sm text-indigo-300 mb-2">النتيجة</div>
                    <div className="text-4xl font-bold text-white">
                        {result.toFixed(4)} <span className="text-xl text-indigo-400">{to}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
