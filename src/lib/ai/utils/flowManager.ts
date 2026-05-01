import type { ChatMessage } from "./failoverManager";
import { determineFlowState } from "../flows/router";
import { getPortfolioFlow } from "../flows/portfolio";
import { getContactFlow } from "../flows/contact";
import { getTrollFlow } from "../flows/troll";
import { getJokerFlow } from "../flows/joker";
import { getConsultationFlow } from "../flows/consultation";
import { getFrequentVisitorFlow } from "../flows/frequent_visitor";
import { getGreetingFlow } from "../flows/greeting";
import { getIntimateFlow } from "../flows/intimate";
import {
    getPricingFlow,
    getCompetitorFlow,
    getTechnicalGeekFlow,
    getUrgentFlow,
    getAngryClientFlow,
    getHiringSeekerFlow,
    getStudentMentorshipFlow,
    getScammerFlow,
    getWhatsappSpecificFlow,
    getEcommerceSpecificFlow,
    getRefundFlow
} from "../flows/extendedFlows";

import {
    getInternationalClientFlow,
    getDiscountSeekerFlow,
    getAgencyPartnershipFlow,
    getPreviousClientSupportFlow,
    getUiUxSpecificFlow,
    getSeoSpecificFlow,
    getPerformanceSpecificFlow,
    getSecuritySpecificFlow,
    getHostingDomainFlow,
    getAppDevelopmentFlow,
    getAiIntegrationFlow,
    getComplianceLegalFlow,
    getMaintenanceContractFlow,
    getLanguageSupportFlow,
    getCustomDashboardFlow,
    getDataMigrationFlow,
    getPaymentGatewayFlow,
    getAnalyticsTrackingFlow,
    getStartupPitchFlow,
    getSkepticalClientFlow
} from "../flows/extendedFlows2";

export function getFlowInstruction(message: string, history: ChatMessage[], userName?: string, precomputedState?: import("../flows/router").FlowState): string {
    const state = precomputedState || determineFlowState(message, history, userName);
    const actualName = (userName && userName.toLowerCase() !== 'guest' && userName !== 'زائر') ? userName : null;
    
    switch (state) {
        case 'GREETING':
            return getGreetingFlow(actualName || undefined);
            
        case 'PORTFOLIO':
            return getPortfolioFlow();
            
        case 'CONTACT':
            return getContactFlow();
            
        case 'CONSULTATION':
            return getConsultationFlow();
            
        case 'TROLL':
            return getTrollFlow();
            
        case 'JOKER':
            return getJokerFlow();
            
        case 'FREQUENT_VISITOR':
            return getFrequentVisitorFlow(actualName || 'يا غالي');

        case 'INTIMATE':
            return getIntimateFlow(actualName || 'يا نجم');
            
        case 'PRICING':
            return getPricingFlow();
            
        case 'COMPETITOR':
            return getCompetitorFlow();
            
        case 'TECHNICAL_GEEK':
            return getTechnicalGeekFlow();
            
        case 'URGENT':
            return getUrgentFlow();
            
        case 'ANGRY_CLIENT':
            return getAngryClientFlow();
            
        case 'HIRING_SEEKER':
            return getHiringSeekerFlow();
            
        case 'STUDENT_MENTORSHIP':
            return getStudentMentorshipFlow();
            
        case 'SCAMMER':
            return getScammerFlow();
            
        case 'WHATSAPP_AUTOMATION':
            return getWhatsappSpecificFlow();
            
        case 'ECOMMERCE':
            return getEcommerceSpecificFlow();
            
        case 'REFUND_CANCELLATION':
            return getRefundFlow();

        case 'INTERNATIONAL_CLIENT':
            return getInternationalClientFlow();
            
        case 'DISCOUNT_SEEKER':
            return getDiscountSeekerFlow();
            
        case 'AGENCY_PARTNERSHIP':
            return getAgencyPartnershipFlow();
            
        case 'PREVIOUS_CLIENT_SUPPORT':
            return getPreviousClientSupportFlow();
            
        case 'UI_UX_SPECIFIC':
            return getUiUxSpecificFlow();
            
        case 'SEO_SPECIFIC':
            return getSeoSpecificFlow();
            
        case 'PERFORMANCE_SPECIFIC':
            return getPerformanceSpecificFlow();
            
        case 'SECURITY_SPECIFIC':
            return getSecuritySpecificFlow();
            
        case 'HOSTING_DOMAIN':
            return getHostingDomainFlow();
            
        case 'APP_DEVELOPMENT':
            return getAppDevelopmentFlow();
            
        case 'AI_INTEGRATION':
            return getAiIntegrationFlow();
            
        case 'COMPLIANCE_LEGAL':
            return getComplianceLegalFlow();
            
        case 'MAINTENANCE_CONTRACT':
            return getMaintenanceContractFlow();
            
        case 'LANGUAGE_SUPPORT':
            return getLanguageSupportFlow();
            
        case 'CUSTOM_DASHBOARD':
            return getCustomDashboardFlow();
            
        case 'DATA_MIGRATION':
            return getDataMigrationFlow();
            
        case 'PAYMENT_GATEWAY':
            return getPaymentGatewayFlow();
            
        case 'ANALYTICS_TRACKING':
            return getAnalyticsTrackingFlow();
            
        case 'STARTUP_PITCH':
            return getStartupPitchFlow();
            
        case 'SKEPTICAL_CLIENT':
            return getSkepticalClientFlow();
            
        case 'SUPPORT':
            return `
[التدفق: محادثة عامة ودعم (SUPPORT)]
مهمتك:
1. أجب على العميل باختصار وبشكل مفيد جداً ومباشر.
2. قم بإعادة توجيه المحادثة بذكاء شديد لتسويق خدمات جمال (مواقع، متاجر، أتمتة الواتساب).
`;
        
        default:
            return "";
    }
}
