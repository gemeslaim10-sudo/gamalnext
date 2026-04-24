import { useState } from 'react';
import { useToolHistory } from '@/hooks/useToolHistory';

export function useImageCompressor() {
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [originalPreview, setOriginalPreview] = useState<string | null>(null);
    const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
    const [quality, setQuality] = useState(0.8);
    const [processing, setProcessing] = useState(false);
    const [compressedSize, setCompressedSize] = useState(0);
    const { addToHistory } = useToolHistory();

    const compressImage = (file: File, q: number) => {
        setProcessing(true);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        setCompressedPreview(URL.createObjectURL(blob));
                        setCompressedSize(blob.size);
                        setProcessing(false);
                        addToHistory('image-compressor', 'ضغط الصور', `Compressed ${file.name} to ${(blob.size / 1024).toFixed(1)}KB`);
                    }
                }, file.type, q);
            };
        };
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setOriginalImage(file);
            setOriginalPreview(URL.createObjectURL(file));
            setCompressedPreview(null);
            setTimeout(() => compressImage(file, quality), 100);
        }
    };

    const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuality = parseFloat(e.target.value);
        setQuality(newQuality);
        if (originalImage) {
            compressImage(originalImage, newQuality);
        }
    };

    return {
        originalImage,
        originalPreview,
        compressedPreview,
        quality,
        processing,
        compressedSize,
        handleImageUpload,
        handleQualityChange
    };
}
