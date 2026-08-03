interface CvTemplateSidebarProps {
    parsedSkills: {
        withPercent: { name: string; percent: number }[];
        withoutPercent: string[];
    };
    languages?: string[];
}

export function CvTemplateSidebar({ parsedSkills, languages }: CvTemplateSidebarProps) {
    return (
        <div className="w-full md:w-1/3 bg-slate-50 p-6 space-y-6 border-r border-slate-200">
            {/* Skills */}
            {(parsedSkills.withPercent.length > 0 || parsedSkills.withoutPercent.length > 0) && (
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">Skills</h3>
                    
                    {parsedSkills.withPercent.length > 0 && (
                        <div className="space-y-3">
                            {parsedSkills.withPercent.map((skill, index) => (
                                <div key={index} className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                                        <span>{skill.name}</span>
                                        <span className="text-blue-600">{skill.percent}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${skill.percent}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {parsedSkills.withoutPercent.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                            {parsedSkills.withoutPercent.map((skill, index) => (
                                <span key={index} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-md text-xs font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">Languages</h3>
                    <div className="space-y-1.5">
                        {languages.map((lang, index) => (
                            <p key={index} className="text-xs text-slate-600 font-medium">{lang}</p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
