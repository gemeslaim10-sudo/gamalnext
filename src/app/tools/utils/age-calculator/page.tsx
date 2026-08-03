'use client';

import { useState } from 'react';
import { Calendar, Cake } from 'lucide-react';
import { useToolHistory } from '@/hooks/useToolHistory';

export default function AgeCalculatorPage() {
    const [birthdate, setBirthdate] = useState('');
    const [age, setAge] = useState<{ years: number, months: number, days: number } | null>(null);
    const { addToHistory } = useToolHistory();

    const calculateAge = () => {
        if (!birthdate) return;
        const birth = new Date(birthdate);
        const now = new Date();

        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        let days = now.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        setAge({ years, months, days });
        addToHistory('age-calculator', 'حاسبة العمر', `Calculated age for date: ${birthdate}`);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Calendar className="text-cyan-400" />
                حاسبة العمر الدقيقة
            </h1>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                <div className="mb-6">
                    <label className="block text-slate-400 mb-2 font-bold text-lg">أدخل تاريخ ميلادك</label>
                    <input
                        type="date"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-white text-xl rounded-xl px-6 py-4 outline-none focus:border-cyan-500 w-full max-w-xs text-center"
                    />
                </div>

                <button
                    onClick={calculateAge}
                    disabled={!birthdate}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105"
                >
                    احسب عمري
                </button>

                {age && (
                    <div className="mt-8 animate-in zoom-in duration-300">
                        <div className="flex justify-center items-end gap-4 mb-6">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-white mb-1">{age.years}</div>
                                <div className="text-sm text-slate-500 uppercase">سنة</div>
                            </div>
                            <div className="text-center pb-2">
                                <div className="text-3xl font-bold text-cyan-400 mb-1">{age.months}</div>
                                <div className="text-xs text-slate-500 uppercase">شهر</div>
                            </div>
                            <div className="text-center pb-2">
                                <div className="text-3xl font-bold text-cyan-400 mb-1">{age.days}</div>
                                <div className="text-xs text-slate-500 uppercase">يوم</div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 inline-flex items-center gap-3 text-slate-300">
                            <Cake className="text-pink-400" />
                            <span>عيد ميلادك القادم بعد <b>{12 - age.months}</b> شهر تقريباً</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
