import { CVData } from "../CvTemplate";

interface CvTemplateMainProps {
    experience: CVData["experience"];
    education: CVData["education"];
    integrations?: string[];
    summary?: string;
}

export function CvTemplateMain({ experience, education, integrations, summary }: CvTemplateMainProps) {
    return (
        <div className="flex-1 p-6 space-y-6">
            {/* Professional Summary */}
            {summary && summary.trim().length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">Profile Summary</h3>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{summary}</p>
                </div>
            )}
            {/* Experience */}
            {experience && experience.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">Experience</h3>
                    <div className="space-y-5">
                        {experience.map((exp, index) => (
                            <div key={index} className="space-y-1.5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                    <h4 className="font-bold text-slate-900 text-sm">{exp.title}</h4>
                                    <span className="text-xs text-blue-600 font-semibold">{exp.date}</span>
                                </div>
                                <p className="text-xs font-semibold text-slate-500">{exp.company}</p>
                                {exp.description && exp.description.length > 0 && (
                                    <ul className="list-disc list-inside space-y-1 pt-1">
                                        {exp.description.map((item, i) => (
                                            <li key={i} className="text-xs text-slate-600 leading-relaxed">{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">Education</h3>
                    <div className="space-y-3">
                        {education.map((edu, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{edu.degree}</h4>
                                    <p className="text-xs text-slate-500 font-medium">{edu.institution}</p>
                                </div>
                                <span className="text-xs text-slate-400">{edu.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Specialized Solutions */}
            {integrations && integrations.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">Specialized Solutions</h3>
                    <div className="space-y-2">
                        {integrations.map((item, index) => (
                            <div key={index} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
