'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { QrCode, Download, Link as LinkIcon, ShieldCheck, Palette, Maximize, FileImage, FileCode, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useToolHistory } from '@/hooks/useToolHistory';
import QRCode from 'qrcode';

// ─── Types ────────────────────────────────────────────────────────────────────
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

const ERROR_LEVELS: { value: ErrorCorrectionLevel; label: string; desc: string }[] = [
    { value: 'L', label: 'منخفض (L)', desc: '~7% استعادة – أصغر حجم' },
    { value: 'M', label: 'متوسط (M)', desc: '~15% استعادة – الافتراضي' },
    { value: 'Q', label: 'عالي (Q)', desc: '~25% استعادة – موصى للطباعة' },
    { value: 'H', label: 'أقصى (H)', desc: '~30% استعادة – أعلى حماية' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function QrGeneratorPage() {
    const [text, setText] = useState('');
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>('H');
    const [margin, setMargin] = useState(2);
    const [svgString, setSvgString] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);
    const downloadMenuRef = useRef<HTMLDivElement>(null);
    const { addToHistory } = useToolHistory();

    // ─── Generate SVG QR Code ─────────────────────────────────────────────────
    const generateQR = useCallback(async () => {
        if (!text.trim()) {
            setSvgString('');
            return;
        }

        setIsGenerating(true);
        try {
            const svg = await QRCode.toString(text, {
                type: 'svg',
                errorCorrectionLevel: errorLevel,
                margin: margin,
                color: {
                    dark: fgColor,
                    light: bgColor,
                },
                width: 1024, // Internal resolution – SVG scales infinitely
            });
            setSvgString(svg);
        } catch (err) {
            console.error('QR Generation Error:', err);
            toast.error('فشل في إنشاء الكود. تأكد من صحة البيانات.');
            setSvgString('');
        } finally {
            setIsGenerating(false);
        }
    }, [text, fgColor, bgColor, errorLevel, margin]);

    // ─── Auto-generate on input change (debounced) ────────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => {
            generateQR();
        }, 300);
        return () => clearTimeout(timer);
    }, [generateQR]);

    // ─── Close download menu on outside click ─────────────────────────────────
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
                setShowDownloadMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ─── Download as SVG (Vector – Infinite Quality) ──────────────────────────
    const downloadSVG = () => {
        if (!svgString) return;
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qrcode_${Date.now()}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('تم تحميل SVG بنجاح!');
        addToHistory('qr-generator', 'منشئ QR Code', `SVG: ${text.slice(0, 40)}...`);
        setShowDownloadMenu(false);
    };

    // ─── Download as High-Res PNG ─────────────────────────────────────────────
    const downloadPNG = async (resolution: number) => {
        if (!text.trim()) return;
        try {
            const canvas = document.createElement('canvas');
            canvas.width = resolution;
            canvas.height = resolution;

            await QRCode.toCanvas(canvas, text, {
                errorCorrectionLevel: errorLevel,
                margin: margin,
                width: resolution,
                color: {
                    dark: fgColor,
                    light: bgColor,
                },
            });

            canvas.toBlob((blob) => {
                if (!blob) {
                    toast.error('فشل في إنشاء الصورة');
                    return;
                }
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `qrcode_${resolution}px_${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                toast.success(`تم تحميل PNG (${resolution}×${resolution}px) بنجاح!`);
                addToHistory('qr-generator', 'منشئ QR Code', `PNG ${resolution}px: ${text.slice(0, 40)}...`);
            }, 'image/png', 1.0);
        } catch (err) {
            console.error('PNG Export Error:', err);
            toast.error('فشل في تصدير PNG');
        }
        setShowDownloadMenu(false);
    };

    // ─── UI ───────────────────────────────────────────────────────────────────
    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <QrCode className="text-gray-200" />
                منشئ رمز QR احترافي
            </h1>
            <p className="text-slate-400 mb-8 text-sm">
                إنشاء أكواد QR بصيغة SVG بجودة لا نهائية – مثالي للطباعة بأي حجم.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ── Controls Panel ──────────────────────────────────────── */}
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

                {/* ── Preview Panel ───────────────────────────────────────── */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[500px]">
                    {svgString && text.trim() ? (
                        <>
                            {/* SVG Preview */}
                            <div
                                ref={previewRef}
                                className="bg-white p-4 rounded-xl shadow-lg mb-6 w-full max-w-[320px] aspect-square flex items-center justify-center"
                                dangerouslySetInnerHTML={{ __html: svgString }}
                                style={{
                                    /* Make the SVG fill the container */
                                }}
                            />

                            {/* Info Badge */}
                            <div className="text-xs text-slate-500 mb-4 text-center space-y-1">
                                <p>SVG Vector — جودة لا نهائية عند الطباعة</p>
                                <p dir="ltr">Error Correction: {errorLevel} | Margin: {margin}</p>
                            </div>

                            {/* Download Button with Dropdown */}
                            <div className="relative" ref={downloadMenuRef}>
                                <button
                                    onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Download className="w-5 h-5" />
                                    تحميل الكود
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {showDownloadMenu && (
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden min-w-[260px] z-50 animate-in fade-in slide-in-from-bottom-2">
                                        {/* SVG Download */}
                                        <button
                                            onClick={downloadSVG}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-right"
                                        >
                                            <FileCode className="w-5 h-5 text-emerald-400 shrink-0" />
                                            <div>
                                                <span className="block text-sm text-white font-bold">SVG (Vector)</span>
                                                <span className="block text-xs text-emerald-400">⭐ الأفضل للطباعة – جودة لا نهائية</span>
                                            </div>
                                        </button>

                                        <div className="border-t border-slate-700/50" />

                                        {/* PNG Downloads */}
                                        <button
                                            onClick={() => downloadPNG(1024)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-right"
                                        >
                                            <FileImage className="w-5 h-5 text-blue-400 shrink-0" />
                                            <div>
                                                <span className="block text-sm text-white font-bold">PNG — 1024×1024</span>
                                                <span className="block text-xs text-slate-400">جودة عالية – للويب والسوشيال</span>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => downloadPNG(2048)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-right"
                                        >
                                            <FileImage className="w-5 h-5 text-blue-400 shrink-0" />
                                            <div>
                                                <span className="block text-sm text-white font-bold">PNG — 2048×2048</span>
                                                <span className="block text-xs text-slate-400">جودة عالية جداً – للطباعة الصغيرة</span>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => downloadPNG(4096)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-right"
                                        >
                                            <FileImage className="w-5 h-5 text-amber-400 shrink-0" />
                                            <div>
                                                <span className="block text-sm text-white font-bold">PNG — 4096×4096</span>
                                                <span className="block text-xs text-amber-400">⭐ أقصى جودة – للطباعة الكبيرة</span>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : isGenerating ? (
                        <div className="text-center text-slate-400">
                            <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                            <p>جاري الإنشاء...</p>
                        </div>
                    ) : (
                        <div className="text-center text-slate-500">
                            <QrCode className="w-20 h-20 mx-auto mb-4 opacity-20" />
                            <p className="text-lg mb-1">أدخل نصاً أو رابطاً</p>
                            <p className="text-sm opacity-70">الكود هيتولد تلقائياً</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Print Tips Section ──────────────────────────────────────── */}
            <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">📋 نصائح للطباعة بأعلى جودة</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-400">
                    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                        <h3 className="text-white font-bold mb-2">1. استخدم SVG دايماً</h3>
                        <p>صيغة SVG هي صيغة Vector – بتحافظ على الجودة مهما كبّرت الحجم. مثالية للبانرات والفلاير واللوحات الكبيرة.</p>
                    </div>
                    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                        <h3 className="text-white font-bold mb-2">2. مستوى التصحيح H</h3>
                        <p>مستوى H بيسمح باستعادة 30% من البيانات. يعني لو جزء من الكود اتقطع أو اتغطى، الماسح الضوئي هيقدر يقرأه.</p>
                    </div>
                    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                        <h3 className="text-white font-bold mb-2">3. كونتراست عالي</h3>
                        <p>خلي لون الرمز غامق والخلفية فاتحة. أقوى كونتراست = أسود على أبيض. ده بيضمن قراءة سريعة من أي جهاز.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
