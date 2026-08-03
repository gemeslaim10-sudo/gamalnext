import { v2 as cloudinary } from 'cloudinary';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env.local') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace literal \n with actual newlines in the private key string
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

const adsToSeed = [
    {
        title: "خدمات تطوير الويب",
        description: "نصمم ونبرمج مواقع إلكترونية عصرية واحترافية تلبي احتياجات عملك وتزيد من مبيعاتك.",
        whatsappMessage: "أهلاً، أريد الاستفسار عن خدمات تطوير المواقع.",
        whatsappNumber: "201024531452",
        localImagePath: "C:\\Users\\GGG\\.gemini\\antigravity\\brain\\2794d1a1-a734-4fc6-9a65-76e8fd29d9ec\\ad_web_dev_1777062061563.png"
    },
    {
        title: "برمجة تطبيقات الجوال",
        description: "تطبيقات أندرويد و iOS بأحدث التقنيات وأفضل واجهات المستخدم لضمان تجربة مستخدم مميزة.",
        whatsappMessage: "أهلاً، أريد الاستفسار عن برمجة تطبيقات الجوال.",
        whatsappNumber: "201024531452",
        localImagePath: "C:\\Users\\GGG\\.gemini\\antigravity\\brain\\2794d1a1-a734-4fc6-9a65-76e8fd29d9ec\\ad_mobile_app_1777062076514.png"
    },
    {
        title: "حلول الذكاء الاصطناعي",
        description: "دمج الذكاء الاصطناعي في مشروعك لأتمتة العمليات وتحسين الإنتاجية باستخدام أحدث النماذج.",
        whatsappMessage: "أهلاً، أريد الاستفسار عن خدمات الذكاء الاصطناعي.",
        whatsappNumber: "201024531452",
        localImagePath: "C:\\Users\\GGG\\.gemini\\antigravity\\brain\\2794d1a1-a734-4fc6-9a65-76e8fd29d9ec\\ad_ai_solutions_1777062090906.png"
    },
    {
        title: "التسويق الرقمي والسيو",
        description: "تصدر نتائج البحث وزد من وصول علامتك التجارية باحترافية من خلال حملات تسويقية مبتكرة.",
        whatsappMessage: "أهلاً، أريد الاستفسار عن خدمات التسويق الرقمي.",
        whatsappNumber: "201024531452",
        localImagePath: "C:\\Users\\GGG\\.gemini\\antigravity\\brain\\2794d1a1-a734-4fc6-9a65-76e8fd29d9ec\\ad_marketing_seo_1777062106505.png"
    }
];

async function seedAds() {
    console.log("Starting ad seeding process...");
    try {
        for (const ad of adsToSeed) {
            console.log(`Uploading image for: ${ad.title}...`);
            const uploadResult = await cloudinary.uploader.upload(ad.localImagePath, {
                folder: 'gamal-tech/ads',
            });
            console.log(`Uploaded! URL: ${uploadResult.secure_url}`);

            const adDoc = {
                title: ad.title,
                description: ad.description,
                imageUrl: uploadResult.secure_url,
                whatsappMessage: ad.whatsappMessage,
                whatsappNumber: ad.whatsappNumber,
                active: true,
                showInSidebar: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await db.collection("ads").add(adDoc);
            console.log(`Ad saved to Firestore with ID: ${docRef.id}`);
        }
        console.log("Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding ads:", err);
        process.exit(1);
    }
}

seedAds();
