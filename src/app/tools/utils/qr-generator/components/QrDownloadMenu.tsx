import { FileCode, FileImage } from 'lucide-react';

interface QrDownloadMenuProps {
    downloadSVG: () => void;
    downloadPNG: (resolution: number) => void;
}

export function QrDownloadMenu({ downloadSVG, downloadPNG }: QrDownloadMenuProps) {
    return (
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
    );
}
