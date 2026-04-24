import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useToolHistory } from '@/hooks/useToolHistory';

export function useTableGenerator() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [format, setFormat] = useState('html');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const { addToHistory } = useToolHistory();

    const handleGenerate = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/ai-table', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: input, type: format }),
            });
            const data = await res.json();
            if (res.ok) {
                setOutput(data.data);
                addToHistory('table-generator', 'صانع الجداول', `Generated ${format.toUpperCase()} table from text`);
            } else {
                toast.error("Failed to generate table");
            }
        } catch (e) {
            toast.error("Error generating table");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        toast.success("تم النسخ!");
        setTimeout(() => setCopied(false), 2000);
    };

    return {
        input,
        setInput,
        output,
        format,
        setFormat,
        loading,
        copied,
        handleGenerate,
        copyToClipboard
    };
}
