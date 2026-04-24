'use client';

import { Image as ImageIcon, Upload, Download, Sliders } from 'lucide-react';
import { useImageCompressor } from './hooks/useImageCompressor';

export default function ImageCompressorPage() {
    const {
        originalImage,
        compressedPreview,
        quality,
        compressedSize,
        handleImageUpload,
        handleQualityChange
    } = useImageCompressor();

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <ImageIcon className="text-rose-400" />
                ضاغط الصور الذكي
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload & Controls */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center border-dashed border-2 border-slate-700 hover:border-rose-500 hover:bg-slate-800/50 transition-all cursor-pointer relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center">
                            <Upload className="w-12 h-12 text-slate-500 mb-4" />
                            <h3 className="text-lg font-bold text-white mb-1">اضغط لرفع صورة</h3>
                            <p className="text-sm text-slate-500">JPG, PNG, WEBP (Max 5MB)</p>
                        </div>
                    </div>

                    {originalImage && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Sliders className="w-4 h-4 text-rose-400" />
                                إعدادات الضغط
                            </h3>

                            <div className="mb-4">
                                <div className="flex justify-between text-sm text-slate-400 mb-2">
                                    <span>الجودة</span>
                                    <span>{Math.round(quality * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1.0"
                                    step="0.1"
                                    value={quality}
                                    onChange={handleQualityChange}
                                    className="w-full accent-rose-500"
                                />
                            </div>

                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-sm">
                                <div>
                                    <div className="text-slate-500">الحجم الأصلي</div>
                                    <div className="font-bold text-white">{(originalImage.size / 1024).toFixed(1)} KB</div>
                                </div>
                                <div className="text-2xl text-slate-700">→</div>
                                <div>
                                    <div className="text-slate-500">الحجم الجديد</div>
                                    <div className={`font-bold ${compressedSize < originalImage.size ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {(compressedSize / 1024).toFixed(1)} KB
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Preview */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center min-h-[400px]">
                    {compressedPreview ? (
                        <>
                            <div className="relative w-full h-[300px] mb-6 bg-[url('/transparent-bg.png')] rounded-xl overflow-hidden border border-slate-700">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={compressedPreview} alt="Preview" className="w-full h-full object-contain" />
                            </div>
                            <a
                                href={compressedPreview}
                                download={`compressed_${originalImage?.name}`}
                                className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2"
                            >
                                <Download className="w-5 h-5" /> تحميل الصورة المضغوطة
                            </a>
                        </>
                    ) : (
                        <div className="text-center text-slate-500">
                            <ImageIcon className="w-20 h-20 mx-auto mb-4 opacity-20" />
                            <p>معاينة الصورة ستظهر هنا</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
