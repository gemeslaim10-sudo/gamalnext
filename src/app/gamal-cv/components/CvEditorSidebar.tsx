"use client";

import { Settings2, X, Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { openCloudinaryWidget } from "@/lib/cloudinary";
import { CVData } from "@/app/tools/utils/ai-cv-builder/components/CvTemplate";

interface CvEditorSidebarProps {
    cvData: CVData;
    setCvData: React.Dispatch<React.SetStateAction<CVData>>;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
}

export function CvEditorSidebar({ cvData, setCvData, isSidebarOpen, setIsSidebarOpen }: CvEditorSidebarProps) {
    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCvData({
            ...cvData,
            personalInfo: { ...cvData.personalInfo, [e.target.name]: e.target.value }
        });
    };

    const handleArrayChange = (field: "skills" | "languages", value: string) => {
        setCvData({
            ...cvData,
            [field]: value.split(",").map((item) => item.trim()).filter(Boolean)
        });
    };

    const updateExperience = (index: number, field: "title" | "company" | "date" | "description", value: string) => {
        const newExp = [...cvData.experience];
        const item = newExp[index];
        if (!item) return;

        if (field === "description") {
            item.description = value.split("\n").filter((l) => l.trim() !== "");
        } else {
            item[field] = value;
        }
        setCvData({ ...cvData, experience: newExp });
    };

    const addExperience = () => {
        setCvData({
            ...cvData,
            experience: [...cvData.experience, { title: "New Job", company: "Company", date: "Present", description: ["Task 1"] }]
        });
    };

    const removeExperience = (index: number) => {
        const newExp = [...cvData.experience];
        newExp.splice(index, 1);
        setCvData({ ...cvData, experience: newExp });
    };

    return (
        <div className={`print:hidden fixed inset-y-0 left-0 z-50 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:static"}`}>
            <div className="p-4 border-b flex justify-between items-center bg-slate-900 text-white">
                <h2 className="font-bold flex items-center gap-2"><Settings2 className="w-5 h-5" /> Edit CV</h2>
                <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                    <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Photo URL</label>
                        <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-gray-400" />
                            <input type="text" name="image" value={cvData.personalInfo.image || ""} onChange={handlePersonalInfoChange} className="flex-1 w-full text-sm border-b border-gray-300 p-1 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400" placeholder="https://example.com/photo.jpg" />
                            <button
                                onClick={() => {
                                    openCloudinaryWidget((url) => {
                                        const imageUrl = Array.isArray(url) ? url[0] : url;
                                        setCvData((prev) => ({
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
                        <input type="text" name="website" value={cvData.personalInfo.website || ""} onChange={handlePersonalInfoChange} className="w-full text-sm border-b border-gray-300 p-1 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400" />
                    </div>
                </div>

                {/* Experience */}
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
                                <input type="text" value={exp.title} onChange={(e) => updateExperience(idx, "title", e.target.value)} className="w-full text-sm border-b bg-transparent border-gray-300 p-1 font-semibold outline-none text-gray-900 placeholder:text-gray-400" placeholder="Title" />
                                <div className="flex gap-2">
                                    <input type="text" value={exp.company} onChange={(e) => updateExperience(idx, "company", e.target.value)} className="w-1/2 text-xs border-b bg-transparent border-gray-300 p-1 outline-none text-gray-900 placeholder:text-gray-400" placeholder="Company" />
                                    <input type="text" value={exp.date} onChange={(e) => updateExperience(idx, "date", e.target.value)} className="w-1/2 text-xs border-b bg-transparent border-gray-300 p-1 outline-none text-gray-900 placeholder:text-gray-400" placeholder="Date" />
                                </div>
                                <textarea value={exp.description.join("\n")} onChange={(e) => updateExperience(idx, "description", e.target.value)} rows={3} className="w-full text-xs border bg-white border-gray-300 p-2 rounded outline-none text-gray-900 placeholder:text-gray-400" placeholder="Bullet points (one per line)" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Skills & Languages */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 border-b pb-2">Skills &amp; Languages</h3>
                    <div>
                        <label className="text-xs font-medium text-gray-500">Skills (Comma separated)</label>
                        <textarea value={cvData.skills.join(", ")} onChange={(e) => handleArrayChange("skills", e.target.value)} rows={3} className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500">Languages (Comma separated)</label>
                        <textarea value={cvData.languages.join(", ")} onChange={(e) => handleArrayChange("languages", e.target.value)} rows={2} className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400" />
                    </div>
                </div>

                {/* Specialized Solutions */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 border-b pb-2">Specialized Solutions</h3>
                    <div>
                        <label className="text-xs font-medium text-gray-500">Solutions &amp; Integrations (One per line)</label>
                        <textarea
                            value={cvData.integrations ? cvData.integrations.join("\n") : ""}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCvData({ ...cvData, integrations: e.target.value.split("\n").filter(Boolean) })}
                            rows={5}
                            className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
