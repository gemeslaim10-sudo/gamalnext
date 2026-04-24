import { Briefcase, FileText, Wrench, MessageCircle } from "lucide-react";

// ── Feed Helpers ─────────────────────────────────────────────────────────────

export const getIconForType = (type: string) => {
    switch (type) {
        case "project": return <Briefcase className="w-4 h-4 text-emerald-400" />;
        case "article": return <FileText className="w-4 h-4 text-blue-400" />;
        case "tool": return <Wrench className="w-4 h-4 text-purple-400" />;
        case "post": return <MessageCircle className="w-4 h-4 text-amber-400" />;
        default: return null;
    }
};

export const getLabelForType = (type: string) => {
    switch (type) {
        case "project": return "New Project";
        case "article": return "New Article";
        case "tool": return "Useful Tool";
        case "post": return "Community Post";
        default: return "Update";
    }
};
