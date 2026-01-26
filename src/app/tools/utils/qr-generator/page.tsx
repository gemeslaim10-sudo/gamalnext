'use client';

import { useState } from 'react';
import { QrCode, Download, Link as LinkIcon, Type } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useToolHistory } from '@/hooks/useToolHistory';

export default function QrGeneratorPage() {
    const [text, setText] = useState('');
    const [size, setSize] = useState(250);
    const [color, setColor] = useState('000000');
    const [bg, setBg] = useState('ffffff');
    const { addToHistory } = useToolHistory();

    // Using goqr.me public API for lightweight generation without heavy client-side libs
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=${color}&bgcolor=${bg}&margin=10`;

    const handleDownload = async () => {
        if (!text) return;
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qrcode_${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Done downloading!");
            addToHistory('qr-generator', 'منشئ QR Code', `Created QR Code for: ${text.slice(0, 30)}...`);
        } catch (e) {
            toast.error("Failed to download");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <QrCode className="text-gray-200" />
                منشئ رمز الاستجابة السريعة (QR Code)
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2 font-bold">النص أو الرابط</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="https://gamaltech.info"
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pr-10 pl-4 text-white focus:border-blue-500 outline-none"
                            />
                            <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2 font-bold">لون الرمز</label>
                            <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl p-2">
                                <input
                                    type="color"
                                    value={`#${color}`}
                                    onChange={(e) => setColor(e.target.value.replace('#', ''))}
                                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                                />
                                <span className="text-xs text-slate-500">#{color}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2 font-bold">لون الخلفية</label>
                            <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl p-2">
                                <input
                                    type="color"
                                    value={`#${bg}`}
                                    onChange={(e) => setBg(e.target.value.replace('#', ''))}
                                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                                />
                                <span className="text-xs text-slate-500">#{bg}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-2 font-bold">الحجم: {size}px</label>
                        <input
                            type="range"
                            min="100"
                            max="800"
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Preview */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[400px]">
                    {text ? (
                        <>
                            <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={qrUrl} alt="QR Code" className="max-w-full h-auto" />
                            </div>
                            <button
                                onClick={handleDownload}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                            >
                                <Download className="w-5 h-5" /> تحميل الصورة
                            </button>
                        </>
                    ) : (
                        <div className="text-center text-slate-500">
                            <QrCode className="w-20 h-20 mx-auto mb-4 opacity-20" />
                            <p>أدخل نصاً أو رابطاً لعرض الكود</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
