import { Github, Linkedin, Mail } from "lucide-react";
import type { SocialKind } from "@/lib/social";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function SocialIcon({ kind, className }: { kind: SocialKind; className?: string }) {
    switch (kind) {
        case "whatsapp":
            return <WhatsAppIcon className={className} />;
        case "email":
            return <Mail className={className} />;
        case "github":
            return <Github className={className} />;
        case "linkedin":
            return <Linkedin className={className} />;
    }
}
