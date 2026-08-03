import { FlowDefinition } from "../types";
import { trollFlow } from "./troll";
import { intimateFlow } from "./intimate";
import { jokerFlow } from "./joker";
import { frequentVisitorFlow } from "./frequentVisitor";
import { greetingFlow } from "./greeting";

export const personasFlows: FlowDefinition[] = [
    trollFlow,
    intimateFlow,
    jokerFlow,
    frequentVisitorFlow,
    greetingFlow
];
