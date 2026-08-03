import { FlowDefinition } from "../types";
import { angryFlow } from "./angry";
import { scammerFlow } from "./scammer";
import { urgentFlow } from "./urgent";
import { previousClientFlow } from "./previousClient";
import { legalFlow } from "./legal";
import { maintenanceFlow } from "./maintenance";
import { hiringFlow } from "./hiring";
import { studentFlow } from "./student";
import { consultationFlow } from "./consultation";
import { contactFlow } from "./contact";
import { portfolioFlow } from "./portfolio";

export const leadsFlows: FlowDefinition[] = [
    angryFlow,
    scammerFlow,
    urgentFlow,
    previousClientFlow,
    legalFlow,
    maintenanceFlow,
    hiringFlow,
    studentFlow,
    consultationFlow,
    contactFlow,
    portfolioFlow
];
