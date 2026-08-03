import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { CVData } from "../CvTemplate";

export function CvTemplateHeader({ personalInfo }: { personalInfo: CVData["personalInfo"] }) {
    return (
        <div className="bg-slate-900 text-white p-8 rounded-b-2xl border-b border-blue-500/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left space-y-2 flex-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">{personalInfo.fullName}</h1>
                    <p className="text-blue-400 font-semibold text-lg">{personalInfo.jobTitle}</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 pt-2">
                        {personalInfo.email && (
                            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-400" />{personalInfo.email}</span>
                        )}
                        {personalInfo.phone && (
                            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-blue-400" />{personalInfo.phone}</span>
                        )}
                        {personalInfo.location && (
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-400" />{personalInfo.location}</span>
                        )}
                        {personalInfo.website && (
                            <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-blue-400" />{personalInfo.website}</span>
                        )}
                    </div>
                </div>

                {personalInfo.image && (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500/40 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={personalInfo.image} alt={personalInfo.fullName} className="w-full h-full object-cover" />
                    </div>
                )}
            </div>
        </div>
    );
}
