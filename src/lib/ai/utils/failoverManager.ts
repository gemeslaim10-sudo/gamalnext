export interface ChatMessage {
    role: string;
    text?: string;
    parts?: Array<{ text?: string }>;
    content?: string;
}

export async function runFailover(
    message: string, 
    history: ChatMessage[], 
    instruction: string, 
    groqKey?: string, 
    openRouterKey?: string
) {
    const providers = [
        { url: "https://api.groq.com/openai/v1/chat/completions", key: groqKey, model: "llama-3.3-70b-versatile" },
        { url: "https://openrouter.ai/api/v1/chat/completions", key: openRouterKey, model: "google/gemini-2.0-flash-exp:free" }
    ];

    const fallbackMsgs = [
        { role: "system", content: instruction },
        ...history.map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.text || "" })),
        { role: "user", content: message }
    ];

    for (const p of providers) {
        if (!p.key) continue;
        try {
            const res = await fetch(p.url, {
                method: "POST",
                headers: { "Authorization": `Bearer ${p.key}`, "Content-Type": "application/json" },
                body: JSON.stringify({ model: p.model, messages: fallbackMsgs })
            });
            if (res.ok) {
                const data = await res.json();
                return { response: data.choices[0]?.message?.content || "Backup logic failed." };
            }
        } catch {}
    }
    return { error: "Extreme system failure across all AI providers." };
}
