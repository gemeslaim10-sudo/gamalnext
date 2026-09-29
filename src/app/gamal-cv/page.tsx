'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, Plus, Printer, Settings2, Trash2, Upload, X } from 'lucide-react';
import { CvTemplate, CVData } from '@/components/cv/CvTemplate';
import { Button, ButtonLink, Field, Input, Textarea } from '@/components/ui';
import { openCloudinaryWidget } from '@/lib/cloudinary';
import { cn } from '@/lib/utils';

const PERSONAL_FIELDS = [
    { name: 'fullName', label: 'Full name' },
    { name: 'jobTitle', label: 'Job title' },
    { name: 'email', label: 'Email' },
    { name: 'phone', label: 'Phone' },
    { name: 'location', label: 'Location' },
    { name: 'website', label: 'Website' },
] as const;

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

    const uploadPhoto = (): void => {
        openCloudinaryWidget((url) => {
            const imageUrl = Array.isArray(url) ? url[0] : url;
            setCvData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, image: imageUrl }
            }));
        });
    };

    return (
        <div className="flex flex-1 flex-col print:block">
            {/* Toolbar (screen only) */}
            <header className="sticky top-0 z-40 border-b border-border bg-background print:hidden">
                <div className="flex h-14 items-center gap-2 px-4 sm:px-6">
                    <ButtonLink href="/admin" variant="ghost" className="-ml-3 px-3" aria-label="Back to admin">
                        <ArrowLeft />
                        <span className="hidden sm:inline">Admin</span>
                    </ButtonLink>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="secondary" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
                            <Settings2 />
                            Edit
                        </Button>
                        <Button onClick={handlePrint}>
                            <Printer />
                            Print PDF
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 flex-col md:flex-row print:block">
                {/* Editor: full-screen panel on phones, side panel from md up. Never printed. */}
                <aside
                    aria-label="Edit CV"
                    className={cn(
                        "fixed inset-0 z-50 flex-col bg-background print:hidden",
                        "md:sticky md:inset-auto md:top-14 md:z-auto md:flex md:h-[calc(100dvh-3.5rem)] md:w-96 md:shrink-0 md:self-start md:border-r md:border-border md:bg-surface",
                        isSidebarOpen ? "flex" : "hidden"
                    )}
                >
                    <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
                        <h2 className="text-base font-semibold text-foreground">Edit CV</h2>
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(false)} aria-label="Close editor">
                            <X />
                        </Button>
                    </div>

                    <div className="flex-1 space-y-8 overflow-y-auto overscroll-contain p-4">
                        {/* Photo / personal info */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground">Personal information</h3>
                            <Field label="Photo URL" htmlFor="cv-image">
                                <div className="flex gap-2">
                                    <Input
                                        id="cv-image"
                                        type="text"
                                        name="image"
                                        value={cvData.personalInfo.image || ''}
                                        onChange={handlePersonalInfoChange}
                                        placeholder="https://example.com/photo.jpg"
                                    />
                                    <Button variant="secondary" size="icon" onClick={uploadPhoto} aria-label="Upload photo" title="Upload photo">
                                        <Upload />
                                    </Button>
                                </div>
                            </Field>
                            {PERSONAL_FIELDS.map((field) => (
                                <Field key={field.name} label={field.label} htmlFor={`cv-${field.name}`}>
                                    <Input
                                        id={`cv-${field.name}`}
                                        type="text"
                                        name={field.name}
                                        value={cvData.personalInfo[field.name] || ''}
                                        onChange={handlePersonalInfoChange}
                                    />
                                </Field>
                            ))}
                        </section>

                        {/* Experience */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="text-sm font-semibold text-foreground">Experience</h3>
                                <Button variant="ghost" onClick={addExperience}>
                                    <Plus />
                                    Add
                                </Button>
                            </div>

                            {cvData.experience.map((exp, idx) => (
                                <div key={idx} className="space-y-2 rounded-card border border-border p-3">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            value={exp.title}
                                            onChange={(e) => updateExperience(idx, 'title', e.target.value)}
                                            placeholder="Title"
                                            aria-label="Title"
                                            className="font-medium"
                                        />
                                        <Button variant="ghost" size="icon" onClick={() => removeExperience(idx)} aria-label="Remove experience" className="hover:text-danger">
                                            <Trash2 />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                                            placeholder="Company"
                                            aria-label="Company"
                                        />
                                        <Input
                                            type="text"
                                            value={exp.date}
                                            onChange={(e) => updateExperience(idx, 'date', e.target.value)}
                                            placeholder="Date"
                                            aria-label="Date"
                                        />
                                    </div>
                                    <Textarea
                                        value={exp.description.join('\n')}
                                        onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                                        rows={3}
                                        placeholder="Bullet points (one per line)"
                                        aria-label="Bullet points (one per line)"
                                    />
                                </div>
                            ))}
                        </section>

                        {/* Skills & languages */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground">Skills & languages</h3>
                            <Field label="Skills" htmlFor="cv-skills" hint="Comma separated">
                                <Textarea
                                    id="cv-skills"
                                    value={cvData.skills.join(', ')}
                                    onChange={(e) => handleArrayChange('skills', e.target.value)}
                                    rows={3}
                                />
                            </Field>
                            <Field label="Languages" htmlFor="cv-languages" hint="Comma separated">
                                <Textarea
                                    id="cv-languages"
                                    value={cvData.languages.join(', ')}
                                    onChange={(e) => handleArrayChange('languages', e.target.value)}
                                    rows={2}
                                />
                            </Field>
                        </section>

                        {/* Specialized solutions & integrations */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground">Specialized solutions</h3>
                            <Field label="Solutions & integrations" htmlFor="cv-integrations" hint="One per line">
                                <Textarea
                                    id="cv-integrations"
                                    value={cvData.integrations ? cvData.integrations.join('\n') : ''}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setCvData({ ...cvData, integrations: e.target.value.split('\n').filter(Boolean) })}
                                    rows={5}
                                />
                            </Field>
                        </section>
                    </div>
                </aside>

                {/* Preview: the CV "paper" on the dark page. Only this part prints. */}
                <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-10 print:p-0">
                    <CvTemplate ref={printRef} data={cvData} />
                </main>
            </div>
        </div>
    );
}
