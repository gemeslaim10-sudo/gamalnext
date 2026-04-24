import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useToolHistory } from '@/hooks/useToolHistory';
import QRCode from 'qrcode';
import type { ErrorCorrectionLevel } from './types';

export function useQrGenerator() {
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
                width: 1024,
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

    useEffect(() => {
        const timer = setTimeout(() => {
            generateQR();
        }, 300);
        return () => clearTimeout(timer);
    }, [generateQR]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
                setShowDownloadMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    return {
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
    };
}
