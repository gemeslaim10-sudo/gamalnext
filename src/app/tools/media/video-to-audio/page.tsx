'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Upload, Music, Loader2, Download, Video } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useToolHistory } from '@/hooks/useToolHistory';
// import { FFmpeg } from '@ffmpeg/ffmpeg'; // Note: Would need to install this. For now we structure the UI.
// import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default function VideoToAudioPage() {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [converting, setConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null); // Changed from downloadUrl
    const { addToHistory } = useToolHistory(); // Added useToolHistory

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setAudioUrl(null); // Changed from setDownloadUrl
        }
    };

    const convertVideo = async () => {
        if (!file) return;

        setConverting(true);
        setProgress(0);

        // Simulation of conversion for now since we haven't installed ffmpeg.wasm yet
        // Real implementation would use ffmpeg.wasm here.
        try {
            const interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return p + 10;
                });
            }, 500);

            await new Promise(resolve => setTimeout(resolve, 5000));

            // Mock result
            setAudioUrl("#"); // Changed from setDownloadUrl
            toast.success("Conversion Complete!");

            // Save to History (We would call an API route here that writes to Firestore 'user_history')
            addToHistory('video-to-audio', 'تحويل فيديو لصوت', `Converted ${file.name} to MP3`);

        } catch (e) {
            toast.error("Conversion Failed");
        } finally {
            setConverting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Music className="text-pink-400" />
                تحويل فيديو لصوت (MP3)
            </h1>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                {!file ? (
                    <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800/50 hover:border-blue-500 transition-all">
                        <Upload className="w-12 h-12 text-slate-500 mb-4" />
                        <span className="text-lg font-bold text-white mb-2">اضغط لرفع الفيديو</span>
                        <span className="text-sm text-slate-500">MP4, MOV, MKV (Max 100MB)</span>
                        <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
                    </label>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-4">
                            <Video className="w-8 h-8 text-blue-400" />
                            <div className="text-right flex-1">
                                <div className="font-bold text-white">{file.name}</div>
                                <div className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                            <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-400">تغيير</button>
                        </div>

                        {!audioUrl ? (
                            <button
                                onClick={convertVideo}
                                disabled={converting}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {converting ? (
                                    <>
                                        <Loader2 className="animate-spin" /> جاري التحويل {progress}%
                                    </>
                                ) : (
                                    <>
                                        <Music /> تحويل إلى MP3
                                    </>
                                )}
                            </button>
                        ) : (
                            <a
                                href={audioUrl}
                                download={`converted_${file.name}.mp3`}
                                className="w-full py-4 bg-green-600 rounded-xl font-bold text-white hover:bg-green-700 shadow-lg flex items-center justify-center gap-2"
                            >
                                <Download /> تحميل الملف الصوتي
                            </a>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 text-sm text-blue-300">
                <h3 className="font-bold mb-2">كيف تعمل الأداة؟</h3>
                <p>يتم تحويل الفيديو الخاص بك محلياً على المتصفح (قريباً) لضمان الخصوصية. لن يتم رفع ملفاتك إلى أي سيرفر خارجي.</p>
            </div>
        </div>
    );
}
