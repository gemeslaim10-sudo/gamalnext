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

const data = {
  "site_content": {
    "experience": {
      "items": [
        {
          "title": "Web Developer",
          "period": "8 months",
          "description": "Developing full-stack websites with dynamic control panels.",
          "active": true
        },
        {
          "title": "WordPress & Shopify Expert",
          "period": "1 year",
          "description": "Building and managing WordPress and Shopify e-commerce stores.",
          "active": true
        },
        {
          "title": "WhatsApp API Integration",
          "period": "6 months",
          "description": "Integrating WhatsApp API for automated customer service and notifications.",
          "active": true
        }
      ]
    },
    "hero": {
      "heroTitle": "Crafting Modern Websites & Stores",
      "heroSubtitle": "Building Websites, Shopify Stores, WordPress, and WhatsApp API",
      "heroDescription": "I specialize in building stunning websites, powerful e-commerce stores, and integrating WhatsApp API to boost your business.",
      "whatsappNumber": "201024531452",
      "resumeLink": "#projects"
    },
    "projects": {
      "items": [
        {
          "title": "Art Vision Portfolio",
          "link": "https://artvision.pages.dev/",
          "description": "A modern portfolio for a design agency.",
          "tags": "React, Cloudflare, Dashboard",
          "category": "software",
          "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
        },
        {
          "title": "Noorva Store",
          "link": "https://noorva-eg.com",
          "tags": "E-commerce, Supabase, React",
          "description": "A fully functional e-commerce store.",
          "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
          "category": "software"
        },
        {
          "title": "Zakaryia Law Firm",
          "link": "https://zakaryialawfirm.netlify.app/",
          "description": "Corporate website for a law firm.",
          "tags": "Corporate, CMS, Dynamic",
          "category": "software",
          "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
        },
        {
          "image": "",
          "category": "software",
          "tags": "Netlify, Cloudinary, React",
          "description": "Web platform for content management.",
          "link": "https://wbrain-viluxe.com",
          "title": "Wbrain-Viluxe"
        },
        {
          "title": "Flow Up Marketing Agency",
          "link": "https://flow-up.pages.dev/",
          "description": "Agency website with dynamic portfolio.",
          "tags": "Cloudflare, React, Supabase",
          "category": "design",
          "image": ""
        },
        {
          "title": "Dream House Store And Website",
          "link": "https://dreamhouse-eg.net/",
          "tags": "Sveltia CMS, GitHub SSG",
          "description": "Real estate and home store platform.",
          "image": "",
          "category": "software"
        },
        {
          "image": "",
          "category": "design",
          "tags": "Cloudflare, React, Firebase",
          "description": "QR Code Profile platform.",
          "link": "https://profile.dreamhouse-eg.net/",
          "title": "Profile for QR Code"
        },
        {
          "category": "software",
          "image": "",
          "description": "WordPress e-commerce store.",
          "tags": "WordPress, WooCommerce, Elementor",
          "link": "https://alkarawan.sa",
          "title": "Alkarawan Store"
        },
        {
          "link": "https://artvisionstudio-eg.pages.dev/",
          "title": "Art Vision Studio",
          "image": "",
          "category": "design",
          "tags": "React, Cloudinary, Firebase",
          "description": "Studio portfolio website."
        },
        {
          "title": "Almotaheda",
          "link": "https://almotaheda-zeta.vercel.app/",
          "tags": "Next.js, Firebase",
          "description": "Company portal.",
          "image": "",
          "category": "software"
        },
        {
          "link": "https://insight-design.vercel.app/",
          "title": "Insight Design",
          "category": "software",
          "image": "",
          "description": "Creative agency website.",
          "tags": "Next.js"
        }
      ]
    },
    "skills": {
      "mainSkills": [
        {
          "title": "Web & E-commerce Development",
          "description": "Building full-stack websites, WordPress, and Shopify stores.",
          "tags": "Next.js, React, WordPress, Shopify",
          "icon": "Code"
        },
        {
          "title": "WhatsApp API Solutions",
          "description": "Integrating automated WhatsApp messaging and customer service.",
          "tags": "WhatsApp API, Node.js, Webhooks",
          "icon": "MessageSquare"
        }
      ],
      "techStack": [
        { "name": "React.js", "val": "95%" },
        { "name": "Next.js", "val": "85%" },
        { "name": "WordPress", "val": "95%" },
        { "name": "Shopify", "val": "90%" },
        { "name": "WhatsApp API", "val": "85%" }
      ],
      "software": [
        { "name": "VS Code", "level": "Professional", "color": "text-green-400" },
        { "name": "WordPress", "level": "Advanced", "color": "text-green-400" },
        { "name": "Shopify", "level": "Advanced", "color": "text-green-400" }
      ]
    }
  }
};

async function updateDB() {
    for (const [docId, docData] of Object.entries(data.site_content)) {
        await db.collection('site_content').doc(docId).set(docData);
        console.log(`Updated site_content/${docId}`);
    }
    console.log('Database updated successfully.');
}

updateDB().catch(console.error);
