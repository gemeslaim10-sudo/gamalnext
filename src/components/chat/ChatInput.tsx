"use client";

import type { FormEvent } from "react";
import { Send } from "lucide-react";
import { Button, Input } from "@/components/ui";

interface ChatInputProps {
    input: string;
    setInput: (val: string) => void;
    onSubmit: (e: FormEvent) => void;
    loading: boolean;
    placeholder: string;
}

export default function ChatInput({ input, setInput, onSubmit, loading, placeholder }: ChatInputProps) {
    return (
        <form onSubmit={onSubmit} className="flex shrink-0 items-center gap-2 border-t border-border p-3">
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                aria-label="Message"
                dir="auto"
                maxLength={2000}
                className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || loading} aria-label="Send">
                <Send />
            </Button>
        </form>
    );
}
