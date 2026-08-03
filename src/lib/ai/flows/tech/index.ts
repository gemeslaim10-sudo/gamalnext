import { FlowDefinition } from "../types";
import { seoFlow } from "./seo";
import { performanceFlow } from "./performance";
import { securityFlow } from "./security";
import { customDashboardFlow } from "./customDashboard";
import { dataMigrationFlow } from "./dataMigration";
import { technicalGeekFlow } from "./technicalGeek";

export const techFlows: FlowDefinition[] = [
    seoFlow,
    performanceFlow,
    securityFlow,
    customDashboardFlow,
    dataMigrationFlow,
    technicalGeekFlow
];
