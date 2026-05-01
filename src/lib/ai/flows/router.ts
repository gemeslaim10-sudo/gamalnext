import type { ChatMessage } from "../utils/failoverManager";

export type FlowState = 'GREETING' | 'PORTFOLIO' | 'CONTACT' | 'CONSULTATION' | 'TROLL' | 'JOKER' | 'FREQUENT_VISITOR' | 'SUPPORT' | 'INTIMATE' | 'PRICING' | 'COMPETITOR' | 'TECHNICAL_GEEK' | 'URGENT' | 'ANGRY_CLIENT' | 'HIRING_SEEKER' | 'STUDENT_MENTORSHIP' | 'SCAMMER' | 'WHATSAPP_AUTOMATION' | 'ECOMMERCE' | 'REFUND_CANCELLATION' | 'INTERNATIONAL_CLIENT' | 'DISCOUNT_SEEKER' | 'AGENCY_PARTNERSHIP' | 'PREVIOUS_CLIENT_SUPPORT' | 'UI_UX_SPECIFIC' | 'SEO_SPECIFIC' | 'PERFORMANCE_SPECIFIC' | 'SECURITY_SPECIFIC' | 'HOSTING_DOMAIN' | 'APP_DEVELOPMENT' | 'AI_INTEGRATION' | 'COMPLIANCE_LEGAL' | 'MAINTENANCE_CONTRACT' | 'LANGUAGE_SUPPORT' | 'CUSTOM_DASHBOARD' | 'DATA_MIGRATION' | 'PAYMENT_GATEWAY' | 'ANALYTICS_TRACKING' | 'STARTUP_PITCH' | 'SKEPTICAL_CLIENT';

function normalizeArabic(text: string): string {
    return text.toLowerCase()
        .replace(/(.)\1{2,}/g, '$1') // Collapse 3+ repeated chars (بكاااام -> بكام)
        .replace(/[أإآ]/g, 'ا') // Normalize Alef
        .replace(/ة/g, 'ه') // Normalize Teh Marbuta to Heh
        .replace(/ى/g, 'ي') // Normalize Alef Maksura to Yeh
        .replace(/[\u064B-\u065F]/g, ''); // Remove diacritics
}

export function determineFlowState(message: string, history: ChatMessage[], userName?: string): FlowState {
    const rawQ = message.toLowerCase();
    const q = normalizeArabic(rawQ) + " " + rawQ; // Keep both normalized and raw for maximum compatibility
    const historyText = history.map(h => normalizeArabic(h.parts[0].text)).join(' ');
    
    // 1. TROLL detection (nonsense, gibberish, weird testing)
    const trollKeywords = ['غبي', 'عبيط', 'مش فاهم', 'صيني', 'هلوسة', 'تهلوس', 'اسكت', 'بطيخ', 'اختبار', 'ترغي', 'بلح', 'يع', 'يعم', 'قرف', 'زفت', 'هبل', 'ايه ده', 'ش', 'س', 'ق', 'وحش', 'بوسه', 'بوسة', 'بحبك', 'اتجوزك', 'شخ', 'احا', 'شرم', 'متناك', 'عرص', 'خرا'];
    const isGibberish = (q.length > 20 && !q.includes(' ') && !q.includes('ا')) || (q.length <= 2 && !['ها', 'اه', 'لا', 'ام'].includes(q));
    if (isGibberish || trollKeywords.some(k => q.includes(k) || rawQ.includes(k))) {
        return 'TROLL';
    }

    // 2. INTIMATE detection (friend, wife, father, etc.)
    const intimateKeywords = ['انا صاحب', 'صاحبك', 'صحبه', 'صاحب جمال', 'اخوه', 'ابوه', 'مراته', 'انا مرات', 'مراتي', 'ابن', 'قريبه', 'جوزي'];
    if (intimateKeywords.some(k => q.includes(k) || historyText.includes(k))) {
        return 'INTIMATE';
    }

    // 3. ANGRY_CLIENT
    const angryKeywords = ['زفت', 'سيء', 'مش شغال', 'بايظ', 'خربان', 'متضايق', 'مشكلة', 'مصيبة', 'نصب'];
    if (angryKeywords.some(k => q.includes(k))) {
        return 'ANGRY_CLIENT';
    }

    // 4. REFUND_CANCELLATION
    const refundKeywords = ['استرداد', 'فلوسي', 'الغاء', 'ارجع', 'مرتجع', 'refund', 'cancel'];
    if (refundKeywords.some(k => q.includes(k))) {
        return 'REFUND_CANCELLATION';
    }

    // 5. SCAMMER
    const scammerKeywords = ['تسويق', 'seo', 'اعلانات', 'متابعين', 'لايكات', 'سبونسر', 'marketing', 'followers'];
    if (scammerKeywords.some(k => q.includes(k)) && (q.includes('خدمات') || q.includes('اقدملك') || q.includes('شركة'))) {
        return 'SCAMMER';
    }

    // 6. URGENT
    const urgentKeywords = ['بسرعة', 'مستعجل', 'اقرب وقت', 'طوارئ', 'ضروري', 'حالا', 'امبارح'];
    if (urgentKeywords.some(k => q.includes(k))) {
        return 'URGENT';
    }

    // 7. COMPETITOR
    const competitorKeywords = ['غالي', 'برا ارخص', 'غيرك', 'منافس', 'بره ارخص', 'غالي جدا', 'سعرك عالي'];
    if (competitorKeywords.some(k => q.includes(k))) {
        return 'COMPETITOR';
    }

    // 8. SKEPTICAL_CLIENT
    const skepticalKeywords = ['ضمان', 'اتنصب عليا', 'خايف', 'اثبات', 'اضمن منين', 'مضمون'];
    if (skepticalKeywords.some(k => q.includes(k))) {
        return 'SKEPTICAL_CLIENT';
    }

    // 9. STARTUP_PITCH
    const startupKeywords = ['شريك', 'نسبة', 'فكرة مليونية', 'فكرة ابلكيشن', 'ابلكيشن هيغير', 'مفيش سيولة', 'معييش فلوس'];
    if (startupKeywords.some(k => q.includes(k))) {
        return 'STARTUP_PITCH';
    }

    // 10. DISCOUNT_SEEKER
    const discountKeywords = ['خصم', 'اوكازيون', 'تخفيض', 'ببلاش', 'غلبان', 'ارخص شوية', 'نزل في السعر'];
    if (discountKeywords.some(k => q.includes(k))) {
        return 'DISCOUNT_SEEKER';
    }

    // 11. PRICING
    const pricingKeywords = ['بكام', 'سعر', 'تكلفة', 'ميزانية', 'تكلف', 'حساب', 'price', 'cost'];
    if (pricingKeywords.some(k => q.includes(k))) {
        return 'PRICING';
    }

    // 12. INTERNATIONAL_CLIENT
    const internationalKeywords = ['دولار', 'سعودية', 'الامارات', 'كويت', 'قطر', 'ويسترن يونيون', 'تحويل', 'ريال'];
    if (internationalKeywords.some(k => q.includes(k))) {
        return 'INTERNATIONAL_CLIENT';
    }

    // 13. AGENCY_PARTNERSHIP
    const agencyKeywords = ['شراكة', 'اوت سورس', 'outsource', 'شركة برمجة', 'b2b'];
    if (agencyKeywords.some(k => q.includes(k))) {
        return 'AGENCY_PARTNERSHIP';
    }

    // 14. PREVIOUS_CLIENT_SUPPORT
    const previousClientKeywords = ['تعديل', 'صيانة', 'باسوورد', 'الموقع وقع', 'نسيت', 'مشكلة في الموقع'];
    if (previousClientKeywords.some(k => q.includes(k)) && history.length > 5) {
        return 'PREVIOUS_CLIENT_SUPPORT';
    }

    // 15. UI_UX_SPECIFIC
    const uiuxKeywords = ['تصميم', 'شكل', 'الوان', 'فجما', 'figma', 'ui', 'ux', 'ديزاين'];
    if (uiuxKeywords.some(k => q.includes(k))) {
        return 'UI_UX_SPECIFIC';
    }

    // 16. SEO_SPECIFIC
    const seoKeywords = ['جوجل', 'بحث', 'ترتيب', 'كلمات مفتاحية', 'ارشفة', 'seo'];
    if (seoKeywords.some(k => q.includes(k)) && !q.includes('تسويق')) {
        return 'SEO_SPECIFIC';
    }

    // 17. PERFORMANCE_SPECIFIC
    const performanceKeywords = ['سرعة', 'بطيء', 'lighthouse', 'تقيل', 'بيحمل ببطء'];
    if (performanceKeywords.some(k => q.includes(k))) {
        return 'PERFORMANCE_SPECIFIC';
    }

    // 18. SECURITY_SPECIFIC
    const securityKeywords = ['هكر', 'اختراق', 'حماية', 'امان', 'سكيورتي', 'امني', 'ثغرة', 'security'];
    if (securityKeywords.some(k => q.includes(k))) {
        return 'SECURITY_SPECIFIC';
    }

    // 19. HOSTING_DOMAIN
    const hostingKeywords = ['استضافة', 'سيرفر', 'دومين', 'هوست', 'aws', 'vercel', 'hosting', 'domain'];
    if (hostingKeywords.some(k => q.includes(k))) {
        return 'HOSTING_DOMAIN';
    }

    // 20. APP_DEVELOPMENT
    const appKeywords = ['تطبيق', 'اندرويد', 'ايفون', 'ابلكيشن', 'موبايل', 'app', 'ios', 'android'];
    if (appKeywords.some(k => q.includes(k))) {
        return 'APP_DEVELOPMENT';
    }

    // 21. AI_INTEGRATION
    const aiKeywords = ['ذكاء اصطناعي', 'شات جي بي تي', 'ai', 'chatgpt', 'openai', 'gemini'];
    if (aiKeywords.some(k => q.includes(k))) {
        return 'AI_INTEGRATION';
    }

    // 22. COMPLIANCE_LEGAL
    const legalKeywords = ['عقد', 'فاتورة', 'ضرائب', 'ضريبة', 'قانوني', 'nda', 'ضمانات'];
    if (legalKeywords.some(k => q.includes(k))) {
        return 'COMPLIANCE_LEGAL';
    }

    // 23. MAINTENANCE_CONTRACT
    const maintenanceKeywords = ['عقد صيانة', 'شهري', 'ادارة', 'تمسك الموقع', 'دعم فني'];
    if (maintenanceKeywords.some(k => q.includes(k))) {
        return 'MAINTENANCE_CONTRACT';
    }

    // 24. LANGUAGE_SUPPORT
    const languageKeywords = ['لغتين', 'انجليزي وعربي', 'ترجمة', 'لغات', 'rtl', 'ltr'];
    if (languageKeywords.some(k => q.includes(k))) {
        return 'LANGUAGE_SUPPORT';
    }

    // 25. CUSTOM_DASHBOARD
    const dashboardKeywords = ['لوحة تحكم', 'ادمن', 'erp', 'crm', 'نظام ادارة', 'شيت', 'لوحة'];
    if (dashboardKeywords.some(k => q.includes(k))) {
        return 'CUSTOM_DASHBOARD';
    }

    // 26. DATA_MIGRATION
    const migrationKeywords = ['نقل', 'هجرة', 'وردبريس', 'بلوجر', 'بيانات قديمة', 'wordpress', 'نقل الداتا'];
    if (migrationKeywords.some(k => q.includes(k))) {
        return 'DATA_MIGRATION';
    }

    // 27. PAYMENT_GATEWAY
    const paymentKeywords = ['دفع', 'فيزا', 'فوري', 'بيموب', 'بايبال', 'شريط', 'stripe', 'paymob', 'تقسيط', 'فاليو', 'valu'];
    if (paymentKeywords.some(k => q.includes(k))) {
        return 'PAYMENT_GATEWAY';
    }

    // 28. ANALYTICS_TRACKING
    const analyticsKeywords = ['بيكسل', 'تتبع', 'اناليتكس', 'بيكسل فيسبوك', 'جوجل اناليتكس', 'pixel', 'analytics'];
    if (analyticsKeywords.some(k => q.includes(k))) {
        return 'ANALYTICS_TRACKING';
    }

    // 29. HIRING_SEEKER
    const hiringKeywords = ['شغل', 'تدريب', 'اشتغل معاكم', 'توظيف', 'cv', 'وظيفة', 'انترفيو', 'internship'];
    if (hiringKeywords.some(k => q.includes(k)) && (q.includes('عايز') || q.includes('ابعت') || q.includes('ممكن'))) {
        return 'HIRING_SEEKER';
    }

    // 30. STUDENT_MENTORSHIP
    const studentKeywords = ['اتعلم ايه', 'ابدا ازاي', 'طالب', 'كورسات', 'نصيحة', 'خريج', 'كورس', 'مبرمج مبتدئ'];
    if (studentKeywords.some(k => q.includes(k))) {
        return 'STUDENT_MENTORSHIP';
    }

    // 31. TECHNICAL_GEEK
    const techKeywords = ['react', 'next.js', 'node', 'api', 'داتا بيز', 'ssr', 'database', 'typescript', 'tailwind'];
    if (techKeywords.some(k => q.includes(k))) {
        return 'TECHNICAL_GEEK';
    }

    // 32. WHATSAPP_AUTOMATION
    const whatsappKeywords = ['واتساب', 'بوت واتساب', 'api واتساب', 'رد الي', 'whatsapp'];
    if (whatsappKeywords.some(k => q.includes(k))) {
        return 'WHATSAPP_AUTOMATION';
    }

    // 33. ECOMMERCE
    const ecommerceKeywords = ['شوبيفاي', 'منتجات', 'بوابات دفع', 'متجر', 'دروبشيبينج', 'shopify', 'ecommerce'];
    if (ecommerceKeywords.some(k => q.includes(k))) {
        return 'ECOMMERCE';
    }

    // 34. JOKER detection
    const jokerKeywords = ['نكتة', 'هزار', 'اضحك', 'حلوة', 'هههه'];
    if (jokerKeywords.some(k => q.includes(k))) {
        return 'JOKER';
    }

    // 35. CONSULTATION / LEAD
    const consultationKeywords = ['استشارة', 'مشروع', 'مساعدة', 'عايز اعمل', 'ابني', 'فكرة'];
    if (consultationKeywords.some(k => q.includes(k))) {
        return 'CONSULTATION';
    }

    // 36. CONTACT
    if (q.includes('رقم') || q.includes('تواصل') || q.includes('تليفون') || q.includes('اتصل') || q.includes('اكلمك')) {
        return 'CONTACT';
    }

    // 37. PORTFOLIO
    if (q.includes('اعمال') || q.includes('موقع') || q.includes('خدمات') || q.includes('شغل') || q.includes('تفاصيل') || q.includes('مشاريع')) {
        return 'PORTFOLIO';
    }

    // 38. FREQUENT VISITOR (If history is long and user is known)
    const isKnownUser = (userName && userName.toLowerCase() !== 'guest' && userName !== 'زائر');
    if (history.length > 10 && isKnownUser) {
        if (q.includes('اهلا') || q.includes('ازيك') || q.includes('عامل ايه')) {
            return 'FREQUENT_VISITOR';
        }
    }

    // 39. GREETING
    if (history.length <= 2) {
        return 'GREETING';
    }

    // 40. Default Fallback
    return 'SUPPORT';
}
