import { QrCode, Download, ChevronDown } from 'lucide-react';
import type { ErrorCorrectionLevel } from '../types';
import { RefObject } from 'react';
import { QrDownloadMenu } from './QrDownloadMenu';

interface QrPreviewProps {
    text: string;
    svgString: string;
    isGenerating: boolean;
    errorLevel: ErrorCorrectionLevel;
    margin: number;
    showDownloadMenu: boolean;
    setShowDownloadMenu: (show: boolean) => void;
    previewRef: RefObject<HTMLDivElement | null>;
    downloadMenuRef: RefObject<HTMLDivElement | null>;
    downloadSVG: () => void;
    downloadPNG: (resolution: number) => void;
}

export function QrPreview({
    text,
    svgString,
    isGenerating,
    errorLevel,
    margin,
    showDownloadMenu,
    setShowDownloadMenu,
    previewRef,
    downloadMenuRef,
    downloadSVG,
    downloadPNG
}: QrPreviewProps) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[500px]">
            {svgString && text.trim() ? (
                <>
                    {/* SVG Preview */}
                    <div
                        ref={previewRef}
                        className="bg-white p-4 rounded-xl shadow-lg mb-6 w-full max-w-[320px] aspect-square flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: svgString }}
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
                            <QrDownloadMenu downloadSVG={downloadSVG} downloadPNG={downloadPNG} />
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
    );
}
