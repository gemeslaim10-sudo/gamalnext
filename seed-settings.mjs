import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env.local') });

// Configure Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function seedSettings() {
    console.log("Seeding default personal and branding settings...");
    try {
        const docRef = db.collection("site_content").doc("settings");
        
        await docRef.set({
            siteName: "GAMALTECH",
            siteLogo: "/gamal.jpg",
            ownerName: "Gamal Selim",
            ownerTitle: "Founder & Owner",
            ownerBio: "Software Engineer & Tech Entrepreneur. Building premium, high-performance digital solutions and AI systems.",
            ownerRole: "CEO @ Gamal Tech",
            ownerLocation: "Egypt",
            githubUrl: "https://github.com/montasrrm",
            linkedinUrl: "https://linkedin.com/in/gamalselim",
            emailAddress: "montasrrm@gmail.com"
        }, { merge: true });

        console.log("Settings seeded successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding settings:", err);
        process.exit(1);
    }
}

seedSettings();
