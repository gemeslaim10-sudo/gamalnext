import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useToolHistory } from '@/hooks/useToolHistory';

export function useVideoToAudio() {
    const [file, setFile] = useState<File | null>(null);
    const [converting, setConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const { addToHistory } = useToolHistory();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setAudioUrl(null);
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
            setAudioUrl("#");
            toast.success("Conversion Complete!");

            // Save to History
            addToHistory('video-to-audio', 'تحويل فيديو لصوت', `Converted ${file.name} to MP3`);

        } catch {
            toast.error("Conversion Failed");
        } finally {
            setConverting(false);
        }
    };

    return {
        file,
        setFile,
        converting,
        progress,
        audioUrl,
        handleFileChange,
        convertVideo
    };
}
