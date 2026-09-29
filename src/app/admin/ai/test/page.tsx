"use client";

import { useEffect, useRef } from "react";
import { RotateCcw, Send, Settings } from "lucide-react";
import { Alert, Button, ButtonLink, Card, Field, Input, PageHeader, Select, Spinner } from "@/components/ui";
import ChatMessage from "@/components/chat/ChatMessage";
import { GEMINI_MODEL_OPTIONS } from "@/lib/ai/assistant/shared";
import { cn } from "@/lib/utils";
import { useAssistantTest } from "./useAssistantTest";
import { DebugPanel } from "./components/DebugPanel";

export default function AssistantTestPage() {
    const {
        profile,
        profileError,
        welcome,
        messages,
        input,
        setInput,
        loading,
        visitorName,
        setVisitorName,
        model,
        setModel,
        selected,
        setSelectedId,
        send,
        reset,
    } = useAssistantTest();
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, loading]);

    const savedModel = profile?.modelName;

    return (
        <>
            <PageHeader
                title="تجربة المساعد"
                description="اتكلم مع المساعد بنفس التعليمات والمعرفة اللي على الموقع. في وضع التجربة مفيش عملاء بيتسجلوا ولا محادثات بتتحفظ."
                actions={
                    <ButtonLink href="/admin/ai" variant="secondary" className="flex-1 sm:flex-none">
                        <Settings /> الإعدادات
                    </ButtonLink>
                }
            />

            {profileError && (
                <Alert variant="warning" className="mb-4">
                    تعذّرت قراءة الإعدادات لعرض رسالة الترحيب، لكن التجربة شغالة.
                </Alert>
            )}

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
                {/* Conversation */}
                <Card padding="none" className="flex h-[70dvh] min-h-[26rem] flex-col overflow-hidden lg:h-[calc(100dvh-12rem)]">
                    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
                        <p className="text-sm font-semibold text-foreground">
                            {profile?.assistantName || "المساعد"} <span className="font-normal text-subtle">— تجربة</span>
                        </p>
                        <Button variant="ghost" size="sm" onClick={reset} disabled={loading || messages.length === 0}>
                            <RotateCcw /> محادثة جديدة
                        </Button>
                    </div>

                    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
                        {welcome && <ChatMessage role="model" text={welcome} />}
                        {messages.map((m) =>
                            m.role === "model" ? (
                                <div key={m.id}>
                                    <ChatMessage role="model" text={m.text} isError={m.isError} />
                                    {/* Picks which reply the panel on the side explains */}
                                    <button
                                        type="button"
                                        onClick={() => setSelectedId(m.id)}
                                        aria-pressed={selected?.id === m.id}
                                        title="اعرض تفاصيل الرد ده"
                                        className={cn(
                                            "-mb-2 inline-flex h-10 items-center px-1 text-xs transition-colors",
                                            selected?.id === m.id ? "text-foreground" : "text-subtle hover:text-muted"
                                        )}
                                    >
                                        {m.debug?.model ? (
                                            <span dir="ltr">{`${m.debug.model} · ${((m.debug.ms || 0) / 1000).toFixed(1)}s`}</span>
                                        ) : (
                                            "التفاصيل"
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <ChatMessage key={m.id} role="user" text={m.text} />
                            )
                        )}
                        {loading && (
                            <div className="flex justify-start" role="status" aria-label="جاري الرد">
                                <div className="rounded-card bg-surface-hover px-3.5 py-2.5">
                                    <Spinner className="size-4" />
                                </div>
                            </div>
                        )}
                        <div ref={endRef} />
                    </div>

                    <form onSubmit={send} className="flex shrink-0 items-center gap-2 border-t border-border p-3">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={profile?.inputPlaceholder || ""}
                            aria-label="الرسالة"
                            dir="auto"
                            maxLength={2000}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={!input.trim() || loading} aria-label="إرسال">
                            <Send />
                        </Button>
                    </form>
                </Card>

                {/* Test options + what happened behind the selected reply */}
                <div className="space-y-4">
                    <Card padding="sm" className="space-y-3">
                        <Field label="اسم الزائر (اختياري)" htmlFor="test-visitor" hint="جرّب كأن الزائر مسجّل دخول بالاسم ده.">
                            <Input id="test-visitor" dir="auto" value={visitorName} onChange={(e) => setVisitorName(e.target.value)} />
                        </Field>
                        <Field label="الموديل" htmlFor="test-model" hint="جرّب موديل تاني قبل ما تحفظه في الإعدادات.">
                            <Select id="test-model" dir="ltr" value={model} onChange={(e) => setModel(e.target.value)}>
                                <option value="">{savedModel ? `Saved model (${savedModel})` : "Saved model"}</option>
                                {GEMINI_MODEL_OPTIONS.filter((m) => m.id !== savedModel).map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.label}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                    </Card>

                    <DebugPanel message={selected} />
                </div>
            </div>
        </>
    );
}
