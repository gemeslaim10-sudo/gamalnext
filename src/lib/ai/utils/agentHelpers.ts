import { FlowDefinition } from "../flows/types";
import { determineFlow } from "../flows/registry";
import { STRICT_INSTRUCTION } from "../instructions";
import type { ChatMessage } from "./failoverManager";
import type { UserContext } from "../types/agent";

export function buildInstruction(currentMessage: string, history: ChatMessage[], rag: string, ctx?: UserContext, precomputedFlow?: FlowDefinition): string {
    const flow = precomputedFlow || determineFlow(currentMessage, history, ctx?.name);
    const flowPrompt = flow.getPrompt(ctx?.name);
    const isGuest = !ctx?.name || ctx.name === 'Guest';

    let baseInstruction = "";
    
    if (flow.basePersona === 'INTIMATE') {
        baseInstruction = "[هويتك ودورك الأساسي]\nأنت المساعد الذكي لـ جمال عبد العاطي. لكن العميل الحالي هو صديق أو شخص مقرب جداً لجمال. إياك أن تتحدث كمندوب مبيعات أو تحاول بيع خدماته.\n\n";
    } else if (flow.basePersona === 'TROLL') {
        baseInstruction = "[هويتك ودورك الأساسي]\nأنت الآن في وضع (التحفيل). العميل داخل يتسلى أو بيهزر. ممنوع منعاً باتاً التحدث عن البيزنس أو الخدمات أو محاولة البيع.\n\n";
    } else {
        baseInstruction = STRICT_INSTRUCTION + "\n\n";
    }

    const contextInfo = !isGuest 
        ? `\n\n[CONTEXT]: بيانات العميل المسجلة في النظام:\nالاسم: ${ctx.name}\n${ctx?.phone ? `الهاتف: ${ctx.phone}\n` : ''}${ctx?.email ? `البريد: ${ctx.email}\n` : ''}`
        : "";

    return baseInstruction + flowPrompt + rag + contextInfo;
}

export function sanitizeHistory(history: ChatMessage[]) {
    const cleaned = history.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.parts?.[0]?.text || m.text || "" }]
    })).filter(m => m.parts[0].text);

    // Gemini requires strict user/model alternation — merge consecutive same-role messages
    const merged: typeof cleaned = [];
    for (const msg of cleaned) {
        const last = merged[merged.length - 1];
        if (last && last.role === msg.role) {
            last.parts[0].text += "\n" + msg.parts[0].text;
        } else {
            merged.push({ ...msg, parts: [{ text: msg.parts[0].text }] });
        }
    }

    // Gemini requires history to start with 'user' — strip leading 'model' messages
    while (merged.length > 0 && merged[0].role === 'model') {
        merged.shift();
    }

    return merged;
}
