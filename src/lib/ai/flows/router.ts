import type { ChatMessage } from "../utils/failoverManager";
import * as kw from "./keywords";

export type FlowState = 'GREETING' | 'PORTFOLIO' | 'CONTACT' | 'CONSULTATION' | 'TROLL' | 'JOKER' | 'FREQUENT_VISITOR' | 'SUPPORT' | 'INTIMATE' | 'PRICING' | 'COMPETITOR' | 'TECHNICAL_GEEK' | 'URGENT' | 'ANGRY_CLIENT' | 'HIRING_SEEKER' | 'STUDENT_MENTORSHIP' | 'SCAMMER' | 'WHATSAPP_AUTOMATION' | 'ECOMMERCE' | 'REFUND_CANCELLATION' | 'INTERNATIONAL_CLIENT' | 'DISCOUNT_SEEKER' | 'AGENCY_PARTNERSHIP' | 'PREVIOUS_CLIENT_SUPPORT' | 'UI_UX_SPECIFIC' | 'SEO_SPECIFIC' | 'PERFORMANCE_SPECIFIC' | 'SECURITY_SPECIFIC' | 'HOSTING_DOMAIN' | 'APP_DEVELOPMENT' | 'AI_INTEGRATION' | 'COMPLIANCE_LEGAL' | 'MAINTENANCE_CONTRACT' | 'LANGUAGE_SUPPORT' | 'CUSTOM_DASHBOARD' | 'DATA_MIGRATION' | 'PAYMENT_GATEWAY' | 'ANALYTICS_TRACKING' | 'STARTUP_PITCH' | 'SKEPTICAL_CLIENT';

function normalizeArabic(text: string): string {
    return text.toLowerCase()
        .replace(/(.)\1{2,}/g, '$1') // Collapse 3+ repeated chars
        .replace(/[أإآ]/g, 'ا') // Normalize Alef
        .replace(/ة/g, 'ه') // Normalize Teh Marbuta
        .replace(/ى/g, 'ي') // Normalize Alef Maksura
        .replace(/[\u064B-\u065F]/g, ''); // Remove diacritics
}

export function determineFlowState(message: string, history: ChatMessage[], userName?: string): FlowState {
    const rawQ = message.toLowerCase();
    const q = normalizeArabic(rawQ) + " " + rawQ;
    const historyText = history.map(h => normalizeArabic(h.parts?.[0]?.text ?? h.text ?? "")).join(' ');
    
    const isGibberish = (q.length > 20 && !q.includes(' ') && !q.includes('ا')) || (q.length <= 2 && !['ها', 'اه', 'لا', 'ام'].includes(q));
    if (isGibberish || kw.trollKeywords.some(k => q.includes(k) || rawQ.includes(k))) return 'TROLL';
    
    if (kw.intimateKeywords.some(k => q.includes(k) || historyText.includes(k))) return 'INTIMATE';
    if (kw.angryKeywords.some(k => q.includes(k))) return 'ANGRY_CLIENT';
    if (kw.refundKeywords.some(k => q.includes(k))) return 'REFUND_CANCELLATION';
    if (kw.scammerKeywords.some(k => q.includes(k)) && (q.includes('خدمات') || q.includes('اقدملك') || q.includes('شركة'))) return 'SCAMMER';
    if (kw.urgentKeywords.some(k => q.includes(k))) return 'URGENT';
    if (kw.competitorKeywords.some(k => q.includes(k))) return 'COMPETITOR';
    if (kw.skepticalKeywords.some(k => q.includes(k))) return 'SKEPTICAL_CLIENT';
    if (kw.startupKeywords.some(k => q.includes(k))) return 'STARTUP_PITCH';
    if (kw.discountKeywords.some(k => q.includes(k))) return 'DISCOUNT_SEEKER';
    if (kw.pricingKeywords.some(k => q.includes(k))) return 'PRICING';
    if (kw.internationalKeywords.some(k => q.includes(k))) return 'INTERNATIONAL_CLIENT';
    if (kw.agencyKeywords.some(k => q.includes(k))) return 'AGENCY_PARTNERSHIP';
    if (kw.previousClientKeywords.some(k => q.includes(k)) && history.length > 5) return 'PREVIOUS_CLIENT_SUPPORT';
    if (kw.uiuxKeywords.some(k => q.includes(k))) return 'UI_UX_SPECIFIC';
    if (kw.seoKeywords.some(k => q.includes(k)) && !q.includes('تسويق')) return 'SEO_SPECIFIC';
    if (kw.performanceKeywords.some(k => q.includes(k))) return 'PERFORMANCE_SPECIFIC';
    if (kw.securityKeywords.some(k => q.includes(k))) return 'SECURITY_SPECIFIC';
    if (kw.hostingKeywords.some(k => q.includes(k))) return 'HOSTING_DOMAIN';
    if (kw.appKeywords.some(k => q.includes(k))) return 'APP_DEVELOPMENT';
    if (kw.aiKeywords.some(k => q.includes(k))) return 'AI_INTEGRATION';
    if (kw.legalKeywords.some(k => q.includes(k))) return 'COMPLIANCE_LEGAL';
    if (kw.maintenanceKeywords.some(k => q.includes(k))) return 'MAINTENANCE_CONTRACT';
    if (kw.languageKeywords.some(k => q.includes(k))) return 'LANGUAGE_SUPPORT';
    if (kw.dashboardKeywords.some(k => q.includes(k))) return 'CUSTOM_DASHBOARD';
    if (kw.migrationKeywords.some(k => q.includes(k))) return 'DATA_MIGRATION';
    if (kw.paymentKeywords.some(k => q.includes(k))) return 'PAYMENT_GATEWAY';
    if (kw.analyticsKeywords.some(k => q.includes(k))) return 'ANALYTICS_TRACKING';
    if (kw.hiringKeywords.some(k => q.includes(k)) && (q.includes('عايز') || q.includes('ابعت') || q.includes('ممكن'))) return 'HIRING_SEEKER';
    if (kw.studentKeywords.some(k => q.includes(k))) return 'STUDENT_MENTORSHIP';
    if (kw.techKeywords.some(k => q.includes(k))) return 'TECHNICAL_GEEK';
    if (kw.whatsappKeywords.some(k => q.includes(k))) return 'WHATSAPP_AUTOMATION';
    if (kw.ecommerceKeywords.some(k => q.includes(k))) return 'ECOMMERCE';
    if (kw.jokerKeywords.some(k => q.includes(k))) return 'JOKER';
    if (kw.consultationKeywords.some(k => q.includes(k))) return 'CONSULTATION';

    if (q.includes('رقم') || q.includes('تواصل') || q.includes('تليفون') || q.includes('اتصل') || q.includes('اكلمك')) return 'CONTACT';
    if (q.includes('اعمال') || q.includes('موقع') || q.includes('خدمات') || q.includes('شغل') || q.includes('تفاصيل') || q.includes('مشاريع')) return 'PORTFOLIO';

    const isKnownUser = (userName && userName.toLowerCase() !== 'guest' && userName !== 'زائر');
    if (history.length > 10 && isKnownUser) {
        if (q.includes('اهلا') || q.includes('ازيك') || q.includes('عامل ايه')) return 'FREQUENT_VISITOR';
    }

    if (history.length <= 2) return 'GREETING';

    return 'SUPPORT';
}
