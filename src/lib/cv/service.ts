import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CVData } from "@/app/tools/utils/ai-cv-builder/components/CvTemplate";

export const defaultCvData: CVData = {
    personalInfo: {
        fullName: "Gamal Sabeh",
        jobTitle: "Web Developer & Mobile App Developer",
        email: "gemeslaim10@gmail.com",
        phone: "+20 102 453 1452",
        location: "Cairo, Egypt",
        website: "gamaltech.info",
        image: ""
    },
    experience: [
        {
            title: "Web Developer & Designer",
            company: "Freelance",
            date: "",
            description: [
                "Developed complete full-stack websites with dynamic admin dashboards.",
                "Expert in building custom admin dashboards and management portals for any system.",
                "Integrated AI Agents and advanced tools to streamline workflows.",
                "Built modern, responsive user interfaces using React.js and Next.js."
            ]
        },
        {
            title: "WordPress Store Developer",
            company: "Freelance",
            date: "",
            description: [
                "Customized Xtra theme and managed WooCommerce operations.",
                "Optimized store performance and managed product listings."
            ]
        },
        {
            title: "Data Analyst",
            company: "Freelance",
            date: "",
            description: [
                "Analyzed advertising campaigns and generated detailed performance reports.",
                "Extracted actionable insights to improve campaign ROI."
            ]
        }
    ],
    education: [
        {
            degree: "Self-Taught Software Engineer",
            institution: "Various Online Platforms & Practical Experience",
            date: "Present"
        }
    ],
    skills: [
        "React.js (95%)",
        "WordPress (95%)",
        "PHP (95%)",
        "Laravel (90%)",
        "Flutter (90%)",
        "Dashboard Building (95%)",
        "Python (90%)",
        "Firebase (85%)",
        "Supabase (85%)",
        "Next.js (85%)",
        "HTML/CSS (90%)",
        "JavaScript (90%)",
        "AI Agent Builders",
        "Antigravity",
        "Manus",
        "MySQL / PostgreSQL"
    ],
    languages: [
        "Arabic (Native)",
        "English (Professional)"
    ],
    integrations: [
        "Meta Integration: Connecting platforms with Meta Pixel, Conversion API, and Facebook Graph API for advanced tracking.",
        "AI Chat Solutions: Implementing custom AI chatbots and virtual assistants inside web applications.",
        "CRM & ERP Systems: Building tailored business management software, automating relations and workflows.",
        "WhatsApp API: Connecting custom WhatsApp API gateways for automated messaging, notifications, and autoresponders.",
        "Data Dashboards: Creating interactive analytics dashboards for data visualization and business decisions.",
        "Graphic Design: Designing UI/UX mockups, visual assets, and marketing materials."
    ]
};

export async function getCvData(): Promise<CVData> {
    try {
        const snap = await getDoc(doc(db, "site_content", "cv"));
        if (snap.exists()) {
            return snap.data() as CVData;
        }
    } catch (e) {
        console.error("Error fetching CV data from Firestore:", e);
    }
    return defaultCvData;
}

export async function saveCvData(data: CVData): Promise<boolean> {
    try {
        await setDoc(doc(db, "site_content", "cv"), data, { merge: true });
        return true;
    } catch (e) {
        console.error("Error saving CV data to Firestore:", e);
        return false;
    }
}
