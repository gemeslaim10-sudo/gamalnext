"use client";

import { useState } from "react";
import { Check, ChevronDown, Copy, Pin } from "lucide-react";
import { Alert, Badge, Button, Card } from "@/components/ui";
import type { TestMessage } from "../useAssistantTest";

const PROVIDERS: Record<string, string> = { gemini: "Gemini", groq: "Groq", openrouter: "OpenRouter", openai: "OpenAI" };

function Block({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2 border-t border-border px-4 py-3 first:border-t-0">
            <h3 className="text-xs font-medium text-subtle">{title}</h3>
            {children}
        </div>
    );
}

/** What happened behind one reply: model used, knowledge cards, lead details, the full prompt. */
export function DebugPanel({ message }: { message: TestMessage | null }) {
    const [copied, setCopied] = useState(false);
    const debug = message?.debug;

    if (!message) {
        return (
            <Card className="text-sm text-muted">
                ابعت رسالة، وهنا هتظهر تفاصيل الرد: الموديل اللي رد، بطاقات المعرفة اللي استخدمها، وبيانات العميل لو اتسجلت.
            </Card>
        );
    }

    const attempts = debug?.attempts ?? [];
    const knowledge = debug?.knowledge;
    const lead = debug?.lead;

    return (
        <Card padding="none" className="overflow-hidden">
            {debug?.model ? (
                <Block title="الرد جه من">
                    <p className="text-sm text-foreground">
                        <span dir="ltr" className="font-mono">
                            {PROVIDERS[debug.provider || ""] || debug.provider} · {debug.model}
                        </span>
                    </p>
                    <p className="text-xs text-subtle">
                        <span dir="ltr">{((debug.ms || 0) / 1000).toFixed(1)}s</span>
                        {debug.toolCalls ? ` · استدعى أداة حفظ العميل ${debug.toolCalls === 1 ? "مرة" : `${debug.toolCalls} مرات`}` : ""}
                    </p>
                    {debug.settingsFromDatabase === false && (
                        <Alert variant="warning">تعذّرت قراءة الإعدادات من قاعدة البيانات، فالرد استخدم الإعدادات الافتراضية.</Alert>
                    )}
                </Block>
            ) : (
                <Block title="النتيجة">
                    <p className="text-sm text-danger">الطلب فشل — التفاصيل تحت.</p>
                </Block>
            )}

            {attempts.length > 0 && (
                <Block title={`موديلات اتجربت قبله وفشلت (${attempts.length})`}>
                    <ul className="space-y-2">
                        {attempts.map((a, i) => (
                            <li key={i} className="text-xs">
                                <p dir="ltr" className="text-start font-mono text-foreground">
                                    {PROVIDERS[a.provider] || a.provider} · {a.model} <span className="text-subtle">({(a.ms / 1000).toFixed(1)}s)</span>
                                </p>
                                <p dir="ltr" className="break-words text-start text-muted">
                                    {a.error}
                                </p>
                            </li>
                        ))}
                    </ul>
                </Block>
            )}

            {knowledge && (
                <Block title={`بطاقات المعرفة (${knowledge.used.length} من ${knowledge.activeCount})`}>
                    <p className="text-xs text-muted">
                        {knowledge.mode === "all" ? "كل البطاقات المفعّلة اتبعتت." : "القاعدة كبيرة: اتبعتت البطاقات المثبّتة + الأكثر صلة بالرسالة."}{" "}
                        <span dir="ltr">{knowledge.usedChars.toLocaleString("en-US")}</span> حرف.
                    </p>
                    {knowledge.used.length > 0 && (
                        <ul className="flex flex-wrap gap-1.5">
                            {knowledge.used.map((c) => (
                                <li key={c.id}>
                                    <Badge variant="outline" dir="auto">
                                        {c.pinned && <Pin aria-label="مثبّتة" />}
                                        {c.title}
                                        {c.score !== undefined && <span className="text-subtle">· {c.score}</span>}
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Block>
            )}

            {lead && (
                <Block title="بيانات عميل">
                    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                        <dt className="text-subtle">الاسم</dt>
                        <dd dir="auto" className="break-words text-foreground">{lead.name}</dd>
                        <dt className="text-subtle">الرقم</dt>
                        <dd className="text-foreground">
                            <span dir="ltr">{lead.phone || "—"}</span>
                        </dd>
                        {lead.service && (
                            <>
                                <dt className="text-subtle">الخدمة</dt>
                                <dd dir="auto" className="break-words text-foreground">{lead.service}</dd>
                            </>
                        )}
                        {lead.message && (
                            <>
                                <dt className="text-subtle">الطلب</dt>
                                <dd dir="auto" className="break-words text-foreground">{lead.message}</dd>
                            </>
                        )}
                    </dl>
                    {lead.errors ? (
                        <p className="text-xs text-danger">
                            البيانات مش مكتملة: <span dir="auto">{Object.values(lead.errors).join(" · ")}</span>
                        </p>
                    ) : (
                        <p className="text-xs text-success">البيانات سليمة — في الموقع الحقيقي كانت هتتسجل في العملاء المحتملين (هنا في وضع التجربة مش بتتحفظ).</p>
                    )}
                </Block>
            )}

            {debug?.systemPrompt && (
                <details className="group border-t border-border">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-xs font-medium text-subtle transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
                        <span>
                            التعليمات الكاملة اللي وصلت للموديل (<span dir="ltr">{(debug.promptChars || 0).toLocaleString("en-US")}</span> حرف)
                        </span>
                        <ChevronDown aria-hidden className="size-4 transition-transform duration-(--motion-base) ease-out group-open:rotate-180" />
                    </summary>
                    <div className="space-y-2 px-4 pb-4">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={async () => {
                                try {
                                    await navigator.clipboard.writeText(debug.systemPrompt || "");
                                    setCopied(true);
                                    window.setTimeout(() => setCopied(false), 2000);
                                } catch {
                                    setCopied(false);
                                }
                            }}
                        >
                            {copied ? <Check /> : <Copy />} {copied ? "اتنسخت" : "نسخ"}
                        </Button>
                        <pre dir="auto" className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-control border border-border bg-background p-3 text-xs leading-relaxed text-muted">
                            {debug.systemPrompt}
                        </pre>
                    </div>
                </details>
            )}
        </Card>
    );
}
