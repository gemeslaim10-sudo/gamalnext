"use client";

import { User, Upload } from "lucide-react";
import { openCloudinaryWidget } from "@/lib/cloudinary";
import { CVData } from "@/app/tools/utils/ai-cv-builder/components/CvTemplate";

interface AdminCvPersonalInfoProps {
    cvData: CVData;
    setCvData: React.Dispatch<React.SetStateAction<CVData>>;
}

export function AdminCvPersonalInfo({ cvData, setCvData }: AdminCvPersonalInfoProps) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    المعلومات الشخصية (Personal Info)
                </span>
                <span className="text-xs text-slate-500 font-normal">محدد بحدود الصفحة الواحدة</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">الاسم الكامل (Full Name)</label>
                    <input
                        type="text"
                        required
                        maxLength={50}
                        value={cvData.personalInfo.fullName}
                        onChange={(e) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, fullName: e.target.value } })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">المسمى الوظيفي (Job Title)</label>
                    <input
                        type="text"
                        required
                        maxLength={60}
                        value={cvData.personalInfo.jobTitle}
                        onChange={(e) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, jobTitle: e.target.value } })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">البريد الإلكتروني (Email)</label>
                    <input
                        type="email"
                        required
                        maxLength={50}
                        value={cvData.personalInfo.email}
                        onChange={(e) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, email: e.target.value } })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">رقم الهاتف (Phone)</label>
                    <input
                        type="text"
                        required
                        maxLength={25}
                        value={cvData.personalInfo.phone}
                        onChange={(e) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, phone: e.target.value } })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">الموقع الجغرافي (Location)</label>
                    <input
                        type="text"
                        maxLength={40}
                        value={cvData.personalInfo.location}
                        onChange={(e) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, location: e.target.value } })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">الموقع الإلكتروني (Website)</label>
                    <input
                        type="text"
                        maxLength={40}
                        value={cvData.personalInfo.website || ""}
                        onChange={(e) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, website: e.target.value } })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">رابط الصورة الشخصية (Photo URL)</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={cvData.personalInfo.image || ""}
                            onChange={(e) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, image: e.target.value } })}
                            placeholder="https://..."
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                openCloudinaryWidget((url) => {
                                    const imageUrl = Array.isArray(url) ? url[0] : url;
                                    setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, image: imageUrl } });
                                });
                            }}
                            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl flex items-center gap-2 text-sm font-medium transition-all"
                        >
                            <Upload className="w-4 h-4" /> رفع صورة
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
