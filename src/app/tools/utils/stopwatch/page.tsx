'use client';

import { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RefreshCw, Flag } from 'lucide-react';
import { useToolHistory } from '@/hooks/useToolHistory';

export default function StopwatchPage() {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const { addToHistory } = useToolHistory();

    useEffect(() => {
        if (running) {
            timerRef.current = setInterval(() => {
                setTime(prev => prev + 10);
            }, 10);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current) };
    }, [running]);

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    };

    const handleLap = () => {
        setLaps([time, ...laps]);
    };

    const handleReset = () => {
        if (time > 0) {
            addToHistory('stopwatch', 'ساعة إيقاف', `Timer session: ${formatTime(time)}`);
        }
        setRunning(false);
        setTime(0);
        setLaps([]);
    };

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Timer className="text-lime-400" />
                ساعة إيقاف
            </h1>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-lime-500 to-green-500"></div>

                <div className="text-7xl font-mono font-bold text-white mb-12 tracking-wider tabular-nums">
                    {formatTime(time)}
                </div>

                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setRunning(!running)}
                        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${running ? 'bg-red-500 hover:bg-red-600' : 'bg-lime-500 hover:bg-lime-600'}`}
                    >
                        {running ? <Pause className="w-8 h-8 text-white fill-current" /> : <Play className="w-8 h-8 text-white fill-current" />}
                    </button>

                    <button
                        onClick={handleReset}
                        className="w-14 h-14 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
                        title="Reset"
                    >
                        <RefreshCw className="w-6 h-6" />
                    </button>

                    {running && (
                        <button
                            onClick={handleLap}
                            className="w-14 h-14 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
                            title="Lap"
                        >
                            <Flag className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {laps.length > 0 && (
                    <div className="max-h-60 overflow-y-auto custom-scrollbar border-t border-slate-800 pt-4">
                        {laps.map((lap, i) => (
                            <div key={i} className="flex justify-between items-center py-2 px-4 hover:bg-slate-800/50 rounded-lg">
                                <span className="text-slate-500">Lap {laps.length - i}</span>
                                <span className="font-mono font-bold text-white">{formatTime(lap)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
