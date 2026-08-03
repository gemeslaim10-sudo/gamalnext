import { createPortal } from 'react-dom';
import { Loader2 } from 'lucide-react';
import ChatMessage from '../ChatMessage';
import ChatInput from '../ChatInput';
import ChatHeader from '../ChatHeader';

interface FullscreenChatOverlayProps {
    messages: { role: 'model' | 'user'; text: string; isError?: boolean }[];
    loading: boolean;
    input: string;
    setInput: (val: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    clearChat: () => void;
    handleCopyChat: () => void;
    onClose: () => void;
    chatContainerRef: React.RefObject<HTMLDivElement | null>;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function FullscreenChatOverlay({
    messages,
    loading,
    input,
    setInput,
    handleSubmit,
    clearChat,
    handleCopyChat,
    onClose,
    chatContainerRef,
    messagesEndRef
}: FullscreenChatOverlayProps) {
    return createPortal(
        <div className="fixed inset-0 z-[200] bg-[#030712] flex flex-col animate-in slide-in-from-bottom duration-300">
            <ChatHeader 
                onBack={onClose} 
                onCopyChat={handleCopyChat}
                onClearChat={clearChat}
            />

            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <ChatMessage key={idx} role={msg.role} text={msg.text} isError={msg.isError} />
                ))}

                {loading && messages.length > 0 && (
                    <div className="flex items-center gap-2 text-slate-500 text-sm p-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Typing...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <ChatInput
                input={input}
                setInput={setInput}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>,
        document.body
    );
}
