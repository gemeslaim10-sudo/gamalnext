const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        })
    });
}
const db = admin.firestore();

async function run() {
  console.log("Starting DB Enhancement...");

  // 1. Update Settings
  await db.collection('site_content').doc('settings').set({
    siteName: 'Gamal Tech | Elite Digital Solutions',
    siteDescription: 'Specializing in high-performance Web Applications, custom Shopify & WordPress E-commerce stores, and intelligent WhatsApp Automations to drastically scale your business.',
    ownerName: 'Gamal Abdelaty',
    ownerTitle: 'Lead Software Engineer & Business Automation Expert',
    ownerBio: 'With extensive experience in crafting state-of-the-art digital products, I help ambitious businesses transform their vision into scalable, high-converting platforms. From bespoke enterprise software to AI-driven automation, my goal is to deliver excellence and tangible ROI.',
    ownerRole: 'Founder @ Gamal Tech',
    ownerLocation: 'Egypt (Available Worldwide)',
    emailAddress: 'montasrrm@gmail.com',
    phoneDisplay: '+20 102 453 1452',
    whatsappNumber: '201024531452',
    githubUrl: 'https://github.com/montasrrm',
    linkedinUrl: 'https://linkedin.com/in/gamalselim10',
    siteLogo: 'https://res.cloudinary.com/dmtgpy7ux/image/upload/v1777106062/smart-web-logo_1_uahu1y.svg'
  }, { merge: true });
  console.log("Updated Settings successfully!");

  // 2. Refresh Ads
  const adsSnapshot = await db.collection('ads').get();
  const adsBatch = db.batch();
  adsSnapshot.docs.forEach(doc => adsBatch.delete(doc.ref));
  await adsBatch.commit();

  const ads = [
    {
      title: "Scale Your Business with Custom E-Commerce",
      description: "Stop losing sales. Get a high-converting, lightning-fast Shopify or WordPress store designed specifically for your brand.",
      buttonText: "Get a Free Consultation",
      link: "https://wa.me/201024531452",
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600",
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      title: "Automate Customer Support via WhatsApp",
      description: "Save hundreds of hours by automating responses, order tracking, and lead generation using our cutting-edge WhatsApp API integrations.",
      buttonText: "See How It Works",
      link: "https://wa.me/201024531452",
      imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600",
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ];
  for (const ad of ads) {
    await db.collection('ads').add(ad);
  }
  console.log("Added highly converting Ads!");

  // 3. Refresh Articles
  const articlesSnapshot = await db.collection('articles').get();
  const articlesBatch = db.batch();
  articlesSnapshot.docs.forEach(doc => articlesBatch.delete(doc.ref));
  await articlesBatch.commit();

  const articles = [
    {
      title: "Why Your Business Needs a Custom E-Commerce Store in 2026",
      excerpt: "In an increasingly competitive digital landscape, relying on generic marketplace platforms is no longer enough. Discover how a bespoke e-commerce store can multiply your conversion rates.",
      content: "### The Shift Towards Bespoke Experiences\n\nIn 2026, customers expect seamless, lightning-fast, and highly personalized shopping experiences. A custom e-commerce store built on modern technologies like **Next.js** or a heavily optimized **Shopify** setup provides exactly that.\n\n### Benefits of Going Custom\n- **Unmatched Speed:** Milliseconds dictate conversion rates.\n- **Brand Ownership:** Complete control over the user journey.\n- **Scalability:** Handle massive traffic spikes during sales without crashing.\n\nReady to upgrade your digital presence? Reach out to Gamal Tech for a free consultation today.",
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      authorId: "gamal_admin",
      authorName: "Gamal Abdelaty",
      authorRole: "Tech Consultant",
      tags: ["E-Commerce", "Business", "Scaling"],
      published: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      views: 1240,
      likes: 85
    },
    {
      title: "The Power of WhatsApp API: Automating Your Sales Funnel",
      excerpt: "Did you know WhatsApp has a 98% open rate? Learn how integrating the WhatsApp Business API can revolutionize your customer support and sales processes.",
      content: "### Why WhatsApp?\n\nEmail open rates hover around 20%, while WhatsApp boasts a staggering 98%. If you're not utilizing WhatsApp to communicate with your customers, you are leaving money on the table.\n\n### Key Automations You Can Implement Today\n1. **Abandoned Cart Recovery:** Automatically message users who left items in their cart.\n2. **Order Tracking:** Send instant, automated shipping updates.\n3. **AI Customer Support:** Use AI chatbots to resolve 80% of customer queries instantly.\n\nAt Gamal Tech, I specialize in integrating complex WhatsApp API solutions tailored to your specific business logic. Message me to learn more.",
      coverImage: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=1200",
      authorId: "gamal_admin",
      authorName: "Gamal Abdelaty",
      authorRole: "Tech Consultant",
      tags: ["WhatsApp API", "Automation", "Marketing"],
      published: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      views: 3205,
      likes: 142
    }
  ];
  for (const article of articles) {
    await db.collection('articles').add(article);
  }
  console.log("Added premium Articles!");

  // 4. Refresh Tools
  const toolsSnapshot = await db.collection('tools').get();
  const toolsBatch = db.batch();
  toolsSnapshot.docs.forEach(doc => toolsBatch.delete(doc.ref));
  await toolsBatch.commit();

  const tools = [
    {
      name: "AI Translator Pro",
      description: "Instantly translate entire documents with AI precision.",
      icon: "Languages",
      route: "/tools/translation/ai-translator",
      isActive: true,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20"
    },
    {
      name: "WhatsApp Link Gen",
      description: "Create custom WhatsApp chat links instantly.",
      icon: "MessageSquare",
      route: "/tools/utils/whatsapp",
      isActive: true,
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/20"
    },
    {
      name: "SEO Analyzer",
      description: "Audit your website for SEO best practices.",
      icon: "Activity",
      route: "/tools/data/seo",
      isActive: true,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    {
      name: "Store ROI Calculator",
      description: "Calculate expected ROI for a custom e-commerce store.",
      icon: "Calculator",
      route: "/tools/finance/roi",
      isActive: true,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20"
    }
  ];
  for (const tool of tools) {
    await db.collection('tools').add(tool);
  }
  console.log("Added premium Tools!");

  console.log("Database Enhancement Complete!");
}

run().catch(console.error);
