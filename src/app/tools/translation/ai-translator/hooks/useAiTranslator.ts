import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useToolHistory } from '@/hooks/useToolHistory';

export function useAiTranslator() {
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('auto');
    const [targetLang, setTargetLang] = useState('en');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const { addToHistory } = useToolHistory();

    const handleTranslate = async () => {
        if (!text.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/ai-translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, sourceLang, targetLang }),
            });

            const data = await res.json();
            if (res.ok) {
                setTranslatedText(data.translation);
                addToHistory('ai-translator', 'مترجم AI', `Translated ${text.slice(0, 20)}... from ${sourceLang} to ${targetLang}`);
            } else {
                toast.error(data.error || "Translation failed");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(translatedText);
        setCopied(true);
        toast.success("تم النسخ!");
        setTimeout(() => setCopied(false), 2000);
    };

    const swapLanguages = () => {
        if (sourceLang === 'auto') {
            toast.error("لا يمكن التبديل مع 'Auto Detect'");
            return;
        }
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setText(translatedText);
        setTranslatedText(text);
    };

    return {
        text,
        setText,
        translatedText,
        setTranslatedText,
        sourceLang,
        setSourceLang,
        targetLang,
        setTargetLang,
        loading,
        copied,
        handleTranslate,
        copyToClipboard,
        swapLanguages
    };
}
