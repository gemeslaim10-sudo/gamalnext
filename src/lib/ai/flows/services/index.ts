import { FlowDefinition } from "../types";
import { uiUxFlow } from "./uiUx";
import { hostingFlow } from "./hosting";
import { appDevelopmentFlow } from "./appDevelopment";
import { aiIntegrationFlow } from "./aiIntegration";
import { languageFlow } from "./language";
import { paymentFlow } from "./payment";
import { analyticsFlow } from "./analytics";
import { whatsappFlow } from "./whatsapp";
import { ecommerceFlow } from "./ecommerce";

export const servicesFlows: FlowDefinition[] = [
    uiUxFlow,
    hostingFlow,
    appDevelopmentFlow,
    aiIntegrationFlow,
    languageFlow,
    paymentFlow,
    analyticsFlow,
    whatsappFlow,
    ecommerceFlow
];
