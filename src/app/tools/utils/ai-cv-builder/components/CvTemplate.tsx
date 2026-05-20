'use client';

import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export interface CVData {
    personalInfo: {
        fullName: string;
        jobTitle: string;
        email: string;
        phone: string;
        location: string;
        website?: string;
        image?: string;
    };
    experience: {
        title: string;
        company: string;
        date: string;
        description: string[];
    }[];
    education: {
        degree: string;
        institution: string;
        date: string;
    }[];
    skills: string[];
    languages: string[];
    integrations?: string[];
}

export const CvTemplate = React.forwardRef<HTMLDivElement, { data: CVData }>(({ data }, ref) => {
    const parsedSkills = React.useMemo(() => {
        if (!data.skills) return { withPercent: [], withoutPercent: [] };
        const withPercent: { name: string; percent: number }[] = [];
        const withoutPercent: string[] = [];
        
        data.skills.forEach(skill => {
            const match = skill.match(/^(.*?)\s*\((\d+)%\)$/);
            if (match && match[1] && match[2]) {
                withPercent.push({
                    name: match[1].trim(),
                    percent: parseInt(match[2].trim(), 10)
                });
            } else {
                withoutPercent.push(skill.trim());
            }
        });
        return { withPercent, withoutPercent };
    }, [data.skills]);

    return (
        <div ref={ref} className="relative bg-white text-gray-900 w-[210mm] min-h-[297mm] mx-auto shadow-2xl overflow-hidden print:shadow-none print:m-0 print:p-0 print:h-[296mm] print:max-h-[296mm] print:overflow-hidden page-break-after-avoid">
            <div className="p-6 pb-4 border-b-4 border-blue-600 bg-gray-50 pr-40">
                <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-tight">{data.personalInfo.fullName}</h1>
                <h2 className="text-xl text-blue-600 font-semibold mt-1 uppercase tracking-widest">{data.personalInfo.jobTitle}</h2>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                    {data.personalInfo.email && (
                        <div className="flex items-center gap-1.5"><Mail size={14} className="text-blue-500" /> {data.personalInfo.email}</div>
                    )}
                    {data.personalInfo.phone && (
                        <div className="flex items-center gap-1.5"><Phone size={14} className="text-blue-500" /> {data.personalInfo.phone}</div>
                    )}
                    {data.personalInfo.location && (
                        <div className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-500" /> {data.personalInfo.location}</div>
                    )}
                    {data.personalInfo.website && (
                        <div className="flex items-center gap-1.5">
                            <Globe size={14} className="text-blue-500" />
                            <a href={`https://${data.personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">
                                {data.personalInfo.website}
                            </a>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Absolute positioning for the photo to place it on the top right */}
            {data.personalInfo.image && (
                <div className="absolute top-6 right-6 w-28 h-28 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-gray-100 print:shadow-none print:border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.personalInfo.image} alt={data.personalInfo.fullName} className="w-full h-full object-cover" />
                </div>
            )}

            <div className="p-6 grid grid-cols-12 gap-6">
                {/* Main Content Column */}
                <div className="col-span-8 space-y-4">
                    {data.experience && data.experience.length > 0 && (
                        <section>
                            <h3 className="text-base font-bold text-gray-800 uppercase border-b-2 border-gray-200 pb-1 mb-2">Experience</h3>
                            <div className="space-y-3">
                                {data.experience.map((exp, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h4 className="text-sm font-semibold text-gray-900">{exp.title}</h4>
                                            {exp.date && (
                                                <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded whitespace-nowrap ml-2">{exp.date}</span>
                                            )}
                                        </div>
                                        <div className="text-xs font-medium text-gray-600 mb-1">{exp.company}</div>
                                        <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5 ml-1 leading-snug">
                                            {exp.description.map((desc, dIdx) => (
                                                <li key={dIdx} className="leading-snug">{desc}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {data.integrations && data.integrations.length > 0 && (
                        <section className="mt-4">
                            <h3 className="text-base font-bold text-gray-800 uppercase border-b-2 border-gray-200 pb-1 mb-2">Specialized Solutions & Integrations</h3>
                            <ul className="list-disc list-inside text-xs text-gray-700 space-y-1.5 ml-1 leading-snug">
                                {data.integrations.map((item, idx) => (
                                    <li key={idx} className="leading-snug">
                                        {item.includes(':') ? (
                                            <>
                                                <strong className="text-gray-900">{item.split(':')[0]}:</strong>
                                                {item.split(':').slice(1).join(':')}
                                            </>
                                        ) : (
                                            item
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                {/* Sidebar Column */}
                <div className="col-span-4 space-y-5">
                    {data.skills && data.skills.length > 0 && (
                        <section className="space-y-3">
                            <h3 className="text-base font-bold text-gray-800 uppercase border-b-2 border-gray-200 pb-1 mb-2">Skills</h3>
                            {parsedSkills.withPercent.length > 0 && (
                                <div className="space-y-2.5">
                                    {parsedSkills.withPercent.map((skill, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs font-semibold text-gray-700">
                                                <span>{skill.name}</span>
                                                <span className="text-blue-600">{skill.percent}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                <div 
                                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                                                    style={{ width: `${skill.percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {parsedSkills.withoutPercent.length > 0 && (
                                <div className="space-y-2">
                                    {parsedSkills.withPercent.length > 0 && (
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-3">Other Tools</h4>
                                    )}
                                    <div className="flex flex-wrap gap-1.5">
                                        {parsedSkills.withoutPercent.map((skill, idx) => (
                                            <span key={idx} className="bg-gray-100 text-gray-800 text-[11px] px-2 py-0.5 rounded-md font-medium border border-gray-200">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {data.education && data.education.length > 0 && (
                        <section>
                            <h3 className="text-base font-bold text-gray-800 uppercase border-b-2 border-gray-200 pb-1 mb-2">Education</h3>
                            <div className="space-y-2">
                                {data.education.map((edu, idx) => (
                                    <div key={idx}>
                                        <h4 className="text-xs font-bold text-gray-900 leading-tight">{edu.degree}</h4>
                                        <div className="text-[11px] text-gray-600 mt-0.5">{edu.institution}</div>
                                        <div className="text-[10px] text-gray-500 mt-0.5">{edu.date}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.languages && data.languages.length > 0 && (
                        <section>
                            <h3 className="text-base font-bold text-gray-800 uppercase border-b-2 border-gray-200 pb-1 mb-2">Languages</h3>
                            <ul className="text-xs text-gray-700 space-y-1">
                                {data.languages.map((lang, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        {lang}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>
            
            {/* Print styles injection to ensure 1 page exact A4 rendering */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    @page { size: A4; margin: 0; }
                    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin: 0; padding: 0; }
                    html, body { background: white; height: 100%; overflow: hidden; }
                    .page-break-after-avoid { page-break-after: avoid; break-after: avoid; }
                }
            `}} />
        </div>
    );
});
CvTemplate.displayName = 'CvTemplate';
