import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface EmailNotificationConfig {
    enabled: boolean;
    provider: "resend" | "smtp";
    recipientEmail: string; // E.g. Gmail
    
    // Resend Config
    resendApiKey?: string;
    resendFromEmail?: string;

    // SMTP Config
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPass?: string;

    // Events triggers
    notifyOnNewLead?: boolean;
    notifyOnNewPost?: boolean;
    notifyOnNewReview?: boolean;
}

export async function getEmailConfig(): Promise<EmailNotificationConfig> {
    try {
        const snap = await getDoc(doc(db, "site_content", "email_notifications"));
        if (snap.exists()) {
            return snap.data() as EmailNotificationConfig;
        }
    } catch (e) {
        console.error("Error fetching email notification config:", e);
    }

    return {
        enabled: false,
        provider: "resend",
        recipientEmail: "",
        resendApiKey: "",
        resendFromEmail: "onboarding@resend.dev",
        notifyOnNewLead: true,
        notifyOnNewPost: true,
        notifyOnNewReview: true
    };
}

export async function saveEmailConfig(config: EmailNotificationConfig): Promise<boolean> {
    try {
        await setDoc(doc(db, "site_content", "email_notifications"), config, { merge: true });
        return true;
    } catch (e) {
        console.error("Error saving email notification config:", e);
        return false;
    }
}
