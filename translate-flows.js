const fs = require('fs');
const path = require('path');

const translations = {
    "aiIntegration.ts": "We are experts in integrating OpenAI API and Gemini.",
    "customDashboard.ts": "We are experts in programming custom ERP systems from scratch.",
    "ecommerce.ts": "We build Shopify or Custom Next.js stores based on business size.",
    "appDevelopment.ts": "We focus on web apps and WhatsApp automation systems.",
    "analytics.ts": "We integrate Google Analytics and Facebook Pixel for precise tracking.",
    "international.ts": "Emphasize our ability to work remotely and accept USD payments.",
    "discount.ts": "We do not compromise on quality. We can reduce features to lower the cost.",
    "competitor.ts": "Do not attack competitors, focus on our superior quality and guaranteed ROI.",
    "dataMigration.ts": "We can migrate databases securely without losing SEO.",
    "agency.ts": "Welcome B2B partnerships as a tech partner. Suggest a meeting.",
    "pricing.ts": "Ask for more details about the project to give an accurate price.",
    "startup.ts": "Politely decline profit-sharing partnerships; we work as an agency for fees.",
    "payment.ts": "We integrate payment gateways like Paymob, Stripe, and PayPal.",
    "skeptical.ts": "Empathize, direct them to our portfolio, and assure them with official contracts.",
    "language.ts": "Our systems fully support multiple languages.",
    "security.ts": "We use SSL encryption and secure databases.",
    "refund.ts": "The matter will be forwarded to management according to contract terms.",
    "performance.ts": "Our websites hit 100/100 on Lighthouse to boost sales.",
    "hosting.ts": "We provide cloud hosting like Vercel and assist with domains.",
    "whatsapp.ts": "We program WhatsApp bots for auto-replies and sales boosts.",
    "frequentVisitor.ts": "Welcome them back as a friend and ask about their project updates.",
    "uiUx.ts": "We design UI/UX via Figma before development begins.",
    "seo.ts": "Confirm that our Next.js websites easily rank on Google.",
    "greeting.ts": "Greet the user warmly and ask how you can help.",
    "technicalGeek.ts": "Speak using technical terms (SSR, Tailwind, Prisma) like a fellow developer.",
    "intimate.ts": "Speak like a close friend. If it is Gamal's wife, defend Gamal playfully!",
    "joker.ts": "Tell a short joke then politely return to business.",
    "troll.ts": "You are a sarcastic Egyptian AI. Roast the user playfully. Keep it short.",
    "angry.ts": "Absorb their anger and ask for details to resolve the issue immediately.",
    "consultation.ts": "Direct them to schedule a consultation call with Gamal.",
    "contact.ts": "Give them the contact info and take their message.",
    "hiring.ts": "We welcome talent. Ask them to leave their CV.",
    "legal.ts": "We work with official contracts and issue invoices.",
    "portfolio.ts": "Confidently direct them to the portfolio section on the website.",
    "maintenance.ts": "We provide monthly technical support contracts for stability.",
    "previousClient.ts": "Ask about their issue to resolve it based on their contract.",
    "scammer.ts": "Politely reject the offer and end the conversation.",
    "student.ts": "Encourage them and advise them to learn web fundamentals.",
    "urgent.ts": "Assure them we are fast, but high quality takes time."
};

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (translations[file]) {
                const translation = translations[file];
                const replacement = "getPrompt: () => `\\n[FLOW: " + file.replace('.ts', '') + "]\\n" + translation + "\\n`";
                content = content.replace(/getPrompt:\s*\(\)\s*=>\s*`([\s\S]*?)`/g, replacement);
                fs.writeFileSync(fullPath, content);
                console.log('Updated', file);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'src', 'lib', 'ai', 'flows'));
