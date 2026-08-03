"use client";

import { QrCode } from 'lucide-react';
import { useQrGenerator } from './useQrGenerator';
import { QrControls } from './components/QrControls';
import { QrPreview } from './components/QrPreview';
import { QrPrintTips } from './components/QrPrintTips';

export default function QrGeneratorPage() {
    const {
        text, setText,
        fgColor, setFgColor,
        bgColor, setBgColor,
        errorLevel, setErrorLevel,
        margin, setMargin,
        svgString,
        isGenerating,
        showDownloadMenu, setShowDownloadMenu,
        previewRef,
        downloadMenuRef,
        downloadSVG,
        downloadPNG
    } = useQrGenerator();

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
                <QrControls
                    text={text}
                    setText={setText}
                    errorLevel={errorLevel}
                    setErrorLevel={setErrorLevel}
                    fgColor={fgColor}
                    setFgColor={setFgColor}
                    bgColor={bgColor}
                    setBgColor={setBgColor}
                    margin={margin}
                    setMargin={setMargin}
                />

                <QrPreview
                    text={text}
                    svgString={svgString}
                    isGenerating={isGenerating}
                    errorLevel={errorLevel}
                    margin={margin}
                    showDownloadMenu={showDownloadMenu}
                    setShowDownloadMenu={setShowDownloadMenu}
                    previewRef={previewRef}
                    downloadMenuRef={downloadMenuRef}
                    downloadSVG={downloadSVG}
                    downloadPNG={downloadPNG}
                />
            </div>

            <QrPrintTips />
        </div>
    );
}
