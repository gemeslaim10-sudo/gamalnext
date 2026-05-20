'use client';

import React, { useState, useRef } from 'react';
import { Bot, FileText, Printer, Sparkles, Loader2, ArrowRight, User, Briefcase, GraduationCap, Code } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CvTemplate, CVData } from './components/CvTemplate';

export default function AiCvBuilderPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
        languages: '',
        experience: '',
        education: '',
        skills: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [cvData, setCvData] = useState<CVData | null>(null);
    const printRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerate = async () => {
        if (!formData.fullName || !formData.jobTitle || !formData.experience) {
            toast.error('Please fill in the required fields (Name, Job Title, and Experience)!');
            return;
        }

        setIsLoading(true);
        try {
            // Combine data into a structured string for the AI to parse
            const combinedText = `
                Name: ${formData.fullName}
                Job Title: ${formData.jobTitle}
                Email: ${formData.email}
                Phone: ${formData.phone}
                Location: ${formData.location}
                Languages: ${formData.languages}
                Experience: ${formData.experience}
                Education: ${formData.education}
                Skills: ${formData.skills}
            `;

            const res = await fetch('/api/ai-cv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: combinedText }),
            });

            if (!res.ok) {
                throw new Error('Failed to generate CV');
            }

            const data = await res.json();
            setCvData(data);
            toast.success('CV generated successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to generate CV. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Header Section - hidden when printing */}
                <div className="text-center print:hidden">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4"
                    >
                        <Bot className="w-8 h-8 text-emerald-600" />
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl"
                    >
                        AI <span className="text-emerald-600">CV Builder</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
                    >
                        Fill in your details below. Our AI will automatically structure, enhance, and design a professional one-page resume for you.
                    </motion.p>
                </div>

                {!cvData && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 print:hidden"
                    >
                        <div className="p-6 sm:p-8 space-y-8">
                            
                            {/* Personal Info Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4 border-b pb-2">
                                    <User className="w-5 h-5 text-emerald-500" /> Personal Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500" placeholder="e.g. Ahmed Ali" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Job Title *</label>
                                        <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500" placeholder="e.g. Frontend Developer" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500" placeholder="e.g. ahmed@example.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500" placeholder="e.g. +20 100 123 4567" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500" placeholder="e.g. Cairo, Egypt" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                                        <input type="text" name="languages" value={formData.languages} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500" placeholder="e.g. Arabic (Native), English (Fluent)" />
                                    </div>
                                </div>
                            </div>

                            {/* Experience Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4 border-b pb-2">
                                    <Briefcase className="w-5 h-5 text-emerald-500" /> Experience *
                                </h3>
                                <textarea name="experience" value={formData.experience} onChange={handleChange} rows={5} className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500" placeholder="List your previous jobs. E.g: Worked at Google as Frontend Dev (2020-2023), built React apps. Then joined Microsoft as Senior Dev (2023-Present)." />
                                <p className="text-xs text-gray-500 mt-1">Don't worry about formatting. Just write down what you did, and AI will turn it into professional bullet points.</p>
                            </div>

                            {/* Education Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4 border-b pb-2">
                                    <GraduationCap className="w-5 h-5 text-emerald-500" /> Education
                                </h3>
                                <textarea name="education" value={formData.education} onChange={handleChange} rows={3} className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500" placeholder="E.g: Bachelor of Computer Science, Cairo University, 2015-2019" />
                            </div>

                            {/* Skills Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4 border-b pb-2">
                                    <Code className="w-5 h-5 text-emerald-500" /> Skills
                                </h3>
                                <textarea name="skills" value={formData.skills} onChange={handleChange} rows={2} className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500" placeholder="E.g: React, Node.js, Team Leadership, Problem Solving" />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4 flex justify-end border-t border-gray-100">
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading}
                                    className="inline-flex items-center gap-2 px-8 py-3.5 border border-transparent text-base font-bold rounded-xl shadow-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
                                >
                                    {isLoading ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /> Generating CV...</>
                                    ) : (
                                        <><Sparkles className="w-5 h-5" /> Generate CV <ArrowRight className="w-4 h-4 ml-1" /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {cvData && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        {/* Action Bar - Hidden in print */}
                        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200 print:hidden">
                            <div className="flex items-center gap-3 text-emerald-600 font-medium mb-4 sm:mb-0">
                                <FileText className="w-5 h-5" />
                                Your Professional CV is Ready
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCvData(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Edit Details
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                                >
                                    <Printer className="w-4 h-4" /> Download PDF
                                </button>
                            </div>
                        </div>

                        {/* CV Preview Area */}
                        <div className="flex justify-center bg-gray-200 p-8 rounded-2xl print:bg-transparent print:p-0 overflow-x-auto">
                            <CvTemplate ref={printRef} data={cvData} />
                        </div>
                    </motion.div>
                )}

            </div>
            
            {/* Global style to hide header/sidebar components if they exist on the page during print */}
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
                }
            `}} />
        </div>
    );
}
