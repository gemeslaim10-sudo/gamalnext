'use client';

import React, { useRef, useState } from 'react';
import { CvTemplate, CVData } from '@/app/tools/utils/ai-cv-builder/components/CvTemplate';
import { Printer, ArrowLeft, Image as ImageIcon, Settings2, X, Plus, Trash2, Upload } from 'lucide-react';
import Link from 'next/link';
import { openCloudinaryWidget } from '@/lib/cloudinary';

const initialCvData: CVData = {
    personalInfo: {
        fullName: "Gamal Sabeh",
        jobTitle: "Web Developer & Mobile App Developer",
        email: "gemeslaim10@gmail.com",
        phone: "+20 102 453 1452",
        location: "Cairo, Egypt",
        website: "gamaltech.info",
        image: "" // Add photo URL here
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

export default function GamalCvPage(): React.JSX.Element {
    const printRef = useRef<HTMLDivElement>(null);
    const [cvData, setCvData] = useState<CVData>(initialCvData);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handlePrint = (): void => {
        window.print();
    };

    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setCvData({
            ...cvData,
            personalInfo: { ...cvData.personalInfo, [e.target.name]: e.target.value }
        });
    };

    // Skills & Languages handlers
    const handleArrayChange = (field: 'skills' | 'languages', value: string): void => {
        setCvData({
            ...cvData,
            [field]: value.split(',').map(item => item.trim()).filter(Boolean)
        });
    };

    // Experience Handlers
    const updateExperience = (index: number, field: 'title' | 'company' | 'date' | 'description', value: string): void => {
        const newExp = [...cvData.experience];
        const item = newExp[index];
        if (!item) return;

        if (field === 'description') {
            item.description = value.split('\n').filter((l: string) => l.trim() !== '');
        } else {
            item[field] = value;
        }
        setCvData({ ...cvData, experience: newExp });
    };

    const addExperience = (): void => {
        setCvData({
            ...cvData,
            experience: [...cvData.experience, { title: "New Job", company: "Company", date: "Present", description: ["Task 1"] }]
        });
    };

    const removeExperience = (index: number): void => {
        const newExp = [...cvData.experience];
        newExp.splice(index, 1);
        setCvData({ ...cvData, experience: newExp });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            
            {/* Editor Sidebar (Hidden in print) */}
            <div className={`print:hidden fixed inset-y-0 left-0 z-50 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:static'}`}>
                <div className="p-4 border-b flex justify-between items-center bg-slate-900 text-white">
                    <h2 className="font-bold flex items-center gap-2"><Settings2 className="w-5 h-5" /> Edit CV</h2>
                    <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Image / Personal Info */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Photo URL</label>
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-gray-400" />
                                <input type="text" name="image" value={cvData.personalInfo.image || ''} onChange={handlePersonalInfoChange} className="flex-1 w-full text-sm border-b border-gray-300 p-1 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400" placeholder="https://example.com/photo.jpg" />
                                <button 
                                    onClick={() => {
                                        openCloudinaryWidget((url) => {
                                            const imageUrl = Array.isArray(url) ? url[0] : url;
                                            setCvData(prev => ({
                                                ...prev,
                                                personalInfo: { ...prev.personalInfo, image: imageUrl }
                                            }));
                                        });
                                    }}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                                    title="Upload Photo"
                                >
                                    <Upload className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500">Full Name</label>
                            <input type="text" name="fullName" value={cvData.personalInfo.fullName} onChange={handlePersonalInfoChange} className="w-full text-sm border-b border-gray-300 p-1 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500">Job Title</label>
                            <input type="text" name="jobTitle" value={cvData.personalInfo.jobTitle} onChange={handlePersonalInfoChange} className="w-full text-sm border-b border-gray-300 p-1 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500">Email</label>
                            <input type="text" name="email" value={cvData.personalInfo.email} onChange={handlePersonalInfoChange} className="w-full text-sm border-b border-gray-300 p-1 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500">Phone</label>
                            <input type="text" name="phone" value={cvData.personalInfo.phone} onChange={handlePersonalInfoChange} className="w-full text-sm border-b border-gray-300 p-1 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500">Location</label>
                            <input type="text" name="location" value={cvData.personalInfo.location} onChange={handlePersonalInfoChange} className="w-full text-sm border-b border-gray-300 p-1 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500">Website</label>
                            <input type="text" name="website" value={cvData.personalInfo.website || ''} onChange={handlePersonalInfoChange} className="w-full text-sm border-b border-gray-300 p-1 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400" />
                        </div>
                    </div>

                    {/* Experience Array */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h3 className="font-semibold text-gray-800">Experience</h3>
                            <button onClick={addExperience} className="text-blue-600 hover:text-blue-800"><Plus className="w-4 h-4" /></button>
                        </div>
                        
                        {cvData.experience.map((exp, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-lg border relative">
                                <button onClick={() => removeExperience(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="space-y-2 mt-2">
                                    <input type="text" value={exp.title} onChange={(e) => updateExperience(idx, 'title', e.target.value)} className="w-full text-sm border-b bg-transparent border-gray-300 p-1 font-semibold outline-none text-gray-900 placeholder:text-gray-400" placeholder="Title" />
                                    <div className="flex gap-2">
                                        <input type="text" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} className="w-1/2 text-xs border-b bg-transparent border-gray-300 p-1 outline-none text-gray-900 placeholder:text-gray-400" placeholder="Company" />
                                        <input type="text" value={exp.date} onChange={(e) => updateExperience(idx, 'date', e.target.value)} className="w-1/2 text-xs border-b bg-transparent border-gray-300 p-1 outline-none text-gray-900 placeholder:text-gray-400" placeholder="Date" />
                                    </div>
                                    <textarea value={exp.description.join('\n')} onChange={(e) => updateExperience(idx, 'description', e.target.value)} rows={3} className="w-full text-xs border bg-white border-gray-300 p-2 rounded outline-none text-gray-900 placeholder:text-gray-400" placeholder="Bullet points (one per line)" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Skills & Languages */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-800 border-b pb-2">Skills & Languages</h3>
                        <div>
                            <label className="text-xs font-medium text-gray-500">Skills (Comma separated)</label>
                            <textarea value={cvData.skills.join(', ')} onChange={(e) => handleArrayChange('skills', e.target.value)} rows={3} className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500">Languages (Comma separated)</label>
                            <textarea value={cvData.languages.join(', ')} onChange={(e) => handleArrayChange('languages', e.target.value)} rows={2} className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400" />
                        </div>
                    </div>

                    {/* Specialized Solutions & Integrations */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-800 border-b pb-2">Specialized Solutions</h3>
                        <div>
                            <label className="text-xs font-medium text-gray-500">Solutions & Integrations (One per line)</label>
                            <textarea 
                                value={cvData.integrations ? cvData.integrations.join('\n') : ''} 
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setCvData({ ...cvData, integrations: e.target.value.split('\n').filter(Boolean) })} 
                                rows={5} 
                                className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Preview Area */}
            <div className="flex-1 h-screen overflow-y-auto py-8 px-4 relative print:p-0 print:h-auto print:overflow-visible">
                
                {/* Header Actions */}
                <div className="max-w-[210mm] mx-auto flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 print:hidden">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 bg-gray-100 rounded-lg">
                            <Settings2 className="w-5 h-5" />
                        </button>
                        <Link href="/admin" className="text-gray-600 hover:text-gray-900 flex items-center gap-2 font-medium">
                            <ArrowLeft className="w-5 h-5" /> Admin
                        </Link>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        <Printer className="w-4 h-4" /> Print PDF
                    </button>
                </div>

                {/* CV Canvas */}
                <div className="flex justify-center rounded-2xl print:bg-transparent print:p-0 print:m-0 overflow-x-auto shadow-2xl print:shadow-none bg-white max-w-[210mm] mx-auto">
                    <CvTemplate ref={printRef} data={cvData} />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    nav, header, footer, [data-sidebar="true"], .print\\:hidden {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                        margin: 0;
                        padding: 0;
                    }
                    .min-h-screen {
                        min-height: auto !important;
                        padding: 0 !important;
                        background: white !important;
                    }
                    .overflow-y-auto {
                        overflow: visible !important;
                    }
                }
            `}} />
        </div>
    );
}
