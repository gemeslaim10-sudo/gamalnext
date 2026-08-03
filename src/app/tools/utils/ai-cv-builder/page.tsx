'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CvTemplate, CVData } from './components/CvTemplate';
import { toast } from 'react-hot-toast';
import { CvBuilderHeader } from './components/builder/CvBuilderHeader';
import { CvBuilderFormSection } from './components/builder/CvBuilderFormSection';

const initialCvData: CVData = {
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
            date: "2022 - Present",
            description: [
                "Developed complete full-stack websites with dynamic admin dashboards.",
                "Expert in building custom admin dashboards and management portals for any system.",
                "Integrated AI Agents and advanced tools to streamline workflows.",
                "Built modern, responsive user interfaces using React.js and Next.js."
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
    skills: ["React.js (95%)", "Next.js (90%)", "TypeScript (85%)", "TailwindCSS (95%)", "Node.js (80%)"],
    languages: ["Arabic (Native)", "English (Professional)"]
};

export default function AiCvBuilderPage() {
    const [cvData, setCvData] = useState<CVData>(initialCvData);
    const [aiPrompt, setAiPrompt] = useState("");
    const [generating, setGenerating] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    const handleAiGenerate = async () => {
        if (!aiPrompt.trim()) return;
        setGenerating(true);
        try {
            const res = await fetch("/api/ai-cv", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: aiPrompt })
            });
            const result = await res.json();
            if (res.ok && result.cvData) {
                setCvData(result.cvData);
                toast.success("CV auto-filled with AI successfully!");
            } else {
                toast.error(result.error || "Failed to generate CV with AI");
            }
        } catch {
            toast.error("Error generating CV data");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />
            <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
                <CvBuilderHeader onPrint={handlePrint} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-6">
                        <CvBuilderFormSection
                            data={cvData}
                            setData={setCvData}
                            aiPrompt={aiPrompt}
                            setAiPrompt={setAiPrompt}
                            generating={generating}
                            onGenerate={handleAiGenerate}
                        />
                    </div>

                    <div className="lg:col-span-6 sticky top-28">
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-x-auto">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Live Resume Preview</h3>
                            <div className="flex justify-center">
                                <CvTemplate ref={printRef} data={cvData} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
