import { FlowDefinition } from "../types";
import { refundFlow } from "./refund";
import { competitorFlow } from "./competitor";
import { skepticalFlow } from "./skeptical";
import { startupFlow } from "./startup";
import { discountFlow } from "./discount";
import { pricingFlow } from "./pricing";
import { internationalFlow } from "./international";
import { agencyFlow } from "./agency";

export const salesFlows: FlowDefinition[] = [
    refundFlow,
    competitorFlow,
    skepticalFlow,
    startupFlow,
    discountFlow,
    pricingFlow,
    internationalFlow,
    agencyFlow
];
