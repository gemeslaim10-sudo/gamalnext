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
    openRouterKey?: string,
    openaiKey?: string,
    huggingfaceKey?: string
) {
    const providers = [
        // Top-Tier Open Source Models (DeepSeek & Qwen)
        { url: "https://openrouter.ai/api/v1/chat/completions", key: openRouterKey, model: "deepseek/deepseek-chat" }, // DeepSeek V3
        { url: "https://openrouter.ai/api/v1/chat/completions", key: openRouterKey, model: "deepseek/deepseek-r1" }, // DeepSeek R1
        { url: "https://openrouter.ai/api/v1/chat/completions", key: openRouterKey, model: "qwen/qwen-2.5-72b-instruct" },
        
        // Google & Anthropic
        { url: "https://openrouter.ai/api/v1/chat/completions", key: openRouterKey, model: "google/gemini-2.5-flash" },
        { url: "https://openrouter.ai/api/v1/chat/completions", key: openRouterKey, model: "google/gemini-2.5-flash-lite" },
        { url: "https://openrouter.ai/api/v1/chat/completions", key: openRouterKey, model: "anthropic/claude-3-haiku" },
        
        // OpenAI
        { url: "https://api.openai.com/v1/chat/completions", key: openaiKey, model: "gpt-4o-mini" },
        { url: "https://api.openai.com/v1/chat/completions", key: openaiKey, model: "gpt-3.5-turbo" },
        
        // Llama & Mixtral (Groq for ultra-low latency)
        { url: "https://api.groq.com/openai/v1/chat/completions", key: groqKey, model: "llama-3.3-70b-versatile" },
        { url: "https://api.groq.com/openai/v1/chat/completions", key: groqKey, model: "mixtral-8x7b-32768" },
        { url: "https://openrouter.ai/api/v1/chat/completions", key: openRouterKey, model: "meta-llama/llama-3-8b-instruct:free" },
        { url: "https://api.groq.com/openai/v1/chat/completions", key: groqKey, model: "llama-3.1-8b-instant" }
    ];

    const strictLanguageInstruction = instruction + "\n\n[CRITICAL LANGUAGE RULE FOR LLM]: You MUST speak ONLY in Egyptian Arabic (العامية المصرية). NEVER use any English words (like 'Commercial' or 'directly'). NEVER use Spanish words (like 'cómo'). NEVER use Chinese characters (like '讨'). If you use any non-Arabic word, you will fail your core directive. Be natural, extremely Egyptian, and avoid robotic translations.";

    const fallbackMsgs = [
        { role: "system", content: strictLanguageInstruction },
        ...history.map(m => {
            const msgText = m.text || (m.parts && m.parts[0] ? m.parts[0].text : "");
            return { role: m.role === 'model' ? 'assistant' : 'user', content: msgText || "" };
        }),
        { role: "user", content: message }
    ];

    const activeProviders = providers.filter(p => p.key);
    const chunkSize = 3;

    for (let i = 0; i < activeProviders.length; i += chunkSize) {
        const chunk = activeProviders.slice(i, i + chunkSize);
        
        try {
            const result = await Promise.any(
                chunk.map(async (p) => {
                    const res = await fetch(p.url, {
                        method: "POST",
                        headers: { "Authorization": `Bearer ${p.key}`, "Content-Type": "application/json" },
                        body: JSON.stringify({ model: p.model, messages: fallbackMsgs })
                    });
                    if (!res.ok) throw new Error("Provider failed");
                    const data = await res.json();
                    if (!data.choices?.[0]?.message?.content) throw new Error("Invalid response");
                    return data.choices[0].message.content;
                })
            );
            return { response: result };
        } catch (e) {
            // AggregateError means all providers in this chunk failed.
            // Continue to the next chunk of providers.
            continue;
        }
    }

    return { error: "Extreme system failure across all AI providers." };
}
