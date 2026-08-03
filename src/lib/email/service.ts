import { getEmailConfig, EmailNotificationConfig } from "./config";

export interface SendEmailPayload {
    subject: string;
    title: string;
    message: string;
    details?: Record<string, string | number | boolean | null | undefined>;
}

export async function sendEmailNotification(payload: SendEmailPayload, overrideConfig?: EmailNotificationConfig) {
    const config = overrideConfig || await getEmailConfig();

    if (!config.enabled && !overrideConfig) {
        return { success: false, reason: "Notifications disabled in settings" };
    }

    if (!config.recipientEmail) {
        return { success: false, reason: "Recipient email (Gmail) is not configured" };
    }

    const htmlBody = generateHtmlEmail(payload.title, payload.message, payload.details);

    if (config.provider === "resend") {
        if (!config.resendApiKey) {
            return { success: false, reason: "Resend API Key is missing" };
        }

        try {
            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${config.resendApiKey.trim()}`,
                },
                body: JSON.stringify({
                    from: config.resendFromEmail || "Gamal Tech <onboarding@resend.dev>",
                    to: [config.recipientEmail.trim()],
                    subject: `[Gamal Tech Notification] ${payload.subject}`,
                    html: htmlBody,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                return { success: false, error: data.message || "Failed to send via Resend API" };
            }

            return { success: true, id: data.id };
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Network error";
            return { success: false, error: errorMessage };
        }
    }

    return { success: false, reason: "Unsupported email provider configured" };
}

function generateHtmlEmail(title: string, message: string, details?: Record<string, string | number | boolean | null | undefined>): string {
    const detailsHtml = details
        ? Object.entries(details)
            .map(
                ([key, val]) => `
                <tr>
                    <td style="padding: 8px 12px; font-weight: bold; background-color: #f1f5f9; border: 1px solid #e2e8f0; color: #334155;">${key}</td>
                    <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #0f172a;">${val !== undefined && val !== null ? String(val) : '-'}</td>
                </tr>`
            )
            .join("")
        : "";

    return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
            .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; padding: 24px; text-align: center; border-bottom: 3px solid #3b82f6; }
            .content { padding: 24px; }
            .title { font-size: 20px; font-weight: bold; color: #0f172a; margin-top: 0; margin-bottom: 12px; }
            .message { font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 20px; background: #f8fafc; padding: 16px; border-radius: 8px; border-right: 4px solid #3b82f6; }
            .table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px; }
            .footer { background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin:0; font-size: 22px;">جمال تك | Gamal Tech</h1>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">نظام الإشعارات الفورية</p>
            </div>
            <div class="content">
                <h2 class="title">${title}</h2>
                <div class="message">${message}</div>
                ${detailsHtml ? `<table class="table"><tbody>${detailsHtml}</tbody></table>` : ""}
            </div>
            <div class="footer">
                تم إرسال هذا الإشعار التلقائي من لوحة تحكم موقع جمال تك.
            </div>
        </div>
    </body>
    </html>
    `;
}
